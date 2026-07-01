import { supabase } from "../config/db.js";

export const getMembers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("id, name, email, year, branch, section, roll_number, phone, domain_interest, onboarded, created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map((s) => ({ ...s, role: "student" })));
  } catch (err) { next(err); }
};

export const getMember = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("id, name, email, year, branch, domain_interest, created_at")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Member not found." });
    res.json({ ...data, role: "student" });
  } catch (err) { next(err); }
};

export const deleteMember = async (req, res, next) => {
  try {
    // Attempt deletion in both tables (students and users)
    const { error: studentErr } = await supabase.from("students").delete().eq("id", req.params.id);
    const { error: userErr } = await supabase.from("users").delete().eq("id", req.params.id);
    
    if (studentErr && userErr) {
      return res.status(500).json({ error: studentErr.message || userErr.message });
    }
    res.json({ message: "Member removed." });
  } catch (err) { next(err); }
};

export const getMemberStats = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("students").select("created_at");
    if (error) return res.status(500).json({ error: error.message });

    const total = data.length;
    const recentJoins = data.filter(
      (u) => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    res.json({ total, recentJoins });
  } catch (err) { next(err); }
};
