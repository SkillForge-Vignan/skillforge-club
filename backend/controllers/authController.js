import bcrypt from "bcryptjs";
import { supabase } from "../config/db.js";
import { generateToken } from "../middleware/auth.js";
import { sendWelcomeEmail, sendOtpEmail } from "../utils/mailer.js";

const otpStore = new Map(); // { email -> { otp, expiresAt } }

export const sendOtp = async (req, res, next) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    email = email.toLowerCase().trim();

    const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendOtpEmail({ email, otp });
    res.json({ message: "OTP sent to your email" });
  } catch (err) { next(err); }
};

export const verifyOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });
    email = email.toLowerCase().trim();

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ error: "OTP not found. Please request a new one." });
    if (Date.now() > record.expiresAt) { otpStore.delete(email); return res.status(400).json({ error: "OTP expired. Please request a new one." }); }
    if (record.otp !== otp.trim()) return res.status(400).json({ error: "Invalid OTP" });

    otpStore.delete(email);
    res.json({ message: "Email verified", verified: true });
  } catch (err) { next(err); }
};

export const register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password required" });

    email = email.toLowerCase().trim();
    password = password.trim();

    const { data: existing } = await supabase.from("students").select("id").eq("email", email).single();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
      .from("students")
      .insert({ name, email, password: hashed })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });

    const token = generateToken({ ...user, role: "student" });
    sendWelcomeEmail({ name: user.name, email: user.email, role: "student" });

    // Mirror into users table to satisfy mentor_assignments FK constraint
    await supabase.from("users").upsert(
      { id: user.id, name: user.name, email: user.email, password: hashed, role: "student" },
      { onConflict: "id" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: "student" },
    });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    email = email.toLowerCase().trim();
    password = password.trim();

    let user = null;
    let role = null;

    // 1. Check students table
    const { data: student } = await supabase.from("students").select("*").eq("email", email).single();
    if (student) { user = student; role = "student"; }

    // 2. Check dedicated mentors table
    if (!user) {
      const { data: mentor } = await supabase.from("mentors").select("*").eq("email", email).single();
      if (mentor) { user = mentor; role = "mentor"; }
    }

    // 3. Check admins table
    if (!user) {
      const { data: admin } = await supabase.from("admins").select("*").eq("email", email).single();
      if (admin) { user = admin; role = "admin"; }
    }

    // 4. Fallback: shared users table (legacy records)
    if (!user) {
      const { data: userRow } = await supabase.from("users").select("*").eq("email", email).single();
      if (userRow) { user = userRow; role = userRow.role ?? "student"; }
    }

    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken({ ...user, role });
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    let user = null;
    if (req.user.role === "admin") {
      const { data } = await supabase.from("admins").select("id, name, email, created_at").eq("id", req.user.id).single();
      user = data;
    } else if (req.user.role === "mentor") {
      const { data } = await supabase.from("mentors").select("id, name, email, created_at").eq("id", req.user.id).single();
      user = data;
    } else {
      const { data } = await supabase.from("students").select("id, name, email, created_at").eq("id", req.user.id).single();
      user = data;
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ...user, role: req.user.role });
  } catch (err) { next(err); }
};

export const completeOnboarding = async (req, res, next) => {
  try {
    const { year, branch, section, rollNumber, domainInterest, phone, bio } = req.body;
    const userId = req.user.id;

    // Update student profile
    const { data: updateData, error: updateError } = await supabase
      .from("students")
      .update({ year: year || "", branch: branch || "", section: section || "", roll_number: rollNumber || "", domain_interest: domainInterest || "", phone: phone || "", bio: bio || "", onboarded: true })
      .eq("id", userId)
      .select("id, name, email, year, branch, section, roll_number, domain_interest, onboarded");

    if (updateError) return res.status(500).json({ error: updateError.message });
    let user = Array.isArray(updateData) ? updateData[0] : updateData;

    if (!user) {
      // Legacy fallback: create the missing student row from shared users table if needed
      const { data: legacyUser, error: legacyError } = await supabase
        .from("users")
        .select("password")
        .eq("id", userId)
        .single();

      if (legacyError || !legacyUser) {
        return res.status(404).json({ error: "Student not found." });
      }

      const { data: insertedUser, error: insertError } = await supabase
        .from("students")
        .insert({
          id: userId,
          name: req.user.name,
          email: req.user.email,
          password: legacyUser.password,
          year: year || "",
          branch: branch || "",
          section: section || "",
          roll_number: rollNumber || "",
          domain_interest: domainInterest || "",
          phone: phone || "",
          bio: bio || "",
          onboarded: true,
        })
        .select("id, name, email, year, branch, section, roll_number, domain_interest, onboarded")
        .single();

      if (insertError) return res.status(500).json({ error: insertError.message });
      user = insertedUser;
    }

    // Save domains to student_domains table if domainInterest is provided
    if (domainInterest && typeof domainInterest === "string") {
      const domainNames = domainInterest.split(",").map((d) => d.trim());
      
      // Get domain IDs from domain names
      const { data: domainRecords } = await supabase
        .from("domains")
        .select("id, name")
        .in("name", domainNames);

      // Insert into student_domains table (only if records found)
      if (domainRecords && domainRecords.length > 0) {
        const studentDomainInserts = domainRecords.map((domain) => ({
          student_id: userId,
          domain_id: domain.id,
        }));

        await supabase
          .from("student_domains")
          .upsert(studentDomainInserts, { onConflict: "student_id,domain_id" });
      }
    }

    res.json({ message: "Onboarding complete", user: { ...user, role: "student" } });
  } catch (err) { next(err); }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (!user) return res.status(404).json({ error: "User not found" });

    const updates = {};
    if (name) updates.name = name;

    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ error: "Current password required" });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(401).json({ error: "Current password incorrect" });
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const { data: updated, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select("id, name, email, role")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Profile updated", user: updated });
  } catch (err) { next(err); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const [{ data: students }, { data: mentors }, { data: admins }] = await Promise.all([
      supabase.from("students").select("id, name, email, created_at"),
      supabase.from("mentors").select("id, name, email, created_at"),
      supabase.from("admins").select("id, name, email, created_at"),
    ]);
    res.json([
      ...(students || []).map((u) => ({ ...u, role: "student" })),
      ...(mentors || []).map((u) => ({ ...u, role: "mentor" })),
      ...(admins || []).map((u) => ({ ...u, role: "admin" })),
    ]);
  } catch (err) { next(err); }
};
