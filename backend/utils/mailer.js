import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a notification email when a contact form is submitted.
 * @param {{ name: string, email: string, subject: string, message: string }} msg
 */
export const sendContactNotification = async (msg) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP credentials not set — skipping email notification.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"SkillForge Bot" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: `[Contact] ${msg.subject}`,
      html: `
        <h2>New Contact Message — SkillForge</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;">Name</td><td>${msg.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td>${msg.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Subject</td><td>${msg.subject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message</td><td>${msg.message}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Submitted At</td><td>${new Date().toLocaleString()}</td></tr>
        </table>
      `,
    });
    console.log("📧 Contact notification sent.");
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

/**
 * Send a confirmation email to the person who registered for an event.
 * @param {{ name: string, email: string, eventTitle: string, date: string, venue: string }} data
 */
export const sendOtpEmail = async ({ email, otp }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  try {
    await transporter.sendMail({
      from: `"SkillForge Club" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your SkillForge Verification Code: ${otp}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0f172a;color:#fff;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#06b6d4,#3b82f6);padding:32px;text-align:center">
            <h1 style="margin:0;font-size:26px;font-weight:900">Email Verification</h1>
            <p style="margin:8px 0 0;opacity:0.85">SkillForge Club</p>
          </div>
          <div style="padding:40px;text-align:center">
            <p style="color:#94a3b8;margin-bottom:24px">Use the code below to verify your email. It expires in <strong style="color:#fff">10 minutes</strong>.</p>
            <div style="background:#1e293b;border:2px dashed #06b6d4;border-radius:16px;padding:32px;letter-spacing:12px;font-size:42px;font-weight:900;color:#06b6d4">${otp}</div>
            <p style="color:#475569;font-size:13px;margin-top:24px">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    });
    console.log(`📧 OTP sent to ${email}`);
  } catch (err) {
    console.error("❌ OTP email failed:", err.message);
  }
};

export const sendWelcomeEmail = async ({ name, email, role }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  SMTP credentials not set — skipping welcome email.");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"SkillForge Club" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to SkillForge, ${name}! 🎉`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#fff;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#06b6d4,#3b82f6);padding:40px;text-align:center">
            <h1 style="margin:0;font-size:32px;font-weight:900">Welcome to SkillForge! 🚀</h1>
            <p style="margin:10px 0 0;opacity:0.85">Your account has been created successfully</p>
          </div>
          <div style="padding:40px">
            <p style="font-size:18px">Hi <strong>${name}</strong>,</p>
            <p style="color:#94a3b8;line-height:1.7">You have successfully registered on <strong style="color:#06b6d4">SkillForge</strong> as a <strong style="color:#a78bfa">${role}</strong>.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:14px">YOUR ACCOUNT DETAILS</p>
              <p style="margin:4px 0"><strong>Name:</strong> ${name}</p>
              <p style="margin:4px 0"><strong>Email:</strong> ${email}</p>
              <p style="margin:4px 0"><strong>Role:</strong> ${role}</p>
            </div>
            <p style="color:#94a3b8;line-height:1.7">Complete your profile setup to get started with your learning journey. Your mentor will be assigned to you soon.</p>
            <div style="text-align:center;margin-top:32px">
              <a href="http://localhost:5173/login" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px">Go to Portal →</a>
            </div>
          </div>
          <div style="padding:24px;text-align:center;border-top:1px solid #1e293b">
            <p style="color:#475569;font-size:13px;margin:0">SkillForge Club — Empowering Student Developers</p>
          </div>
        </div>
      `,
    });
    console.log(`📧 Welcome email sent to ${email}`);
  } catch (err) {
    console.error("❌ Welcome email failed:", err.message);
  }
};

export const sendRegistrationConfirmation = async (data) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    await transporter.sendMail({
      from: `"SkillForge Club" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `You're registered for ${data.eventTitle}!`,
      html: `
        <h2>Registration Confirmed 🎉</h2>
        <p>Hi ${data.name},</p>
        <p>You have successfully registered for <strong>${data.eventTitle}</strong>.</p>
        <ul>
          <li><strong>Date:</strong> ${data.date}</li>
          <li><strong>Venue:</strong> ${data.venue}</li>
        </ul>
        <p>See you there! — SkillForge Club Team</p>
      `,
    });
    console.log(`📧 Confirmation sent to ${data.email}`);
  } catch (err) {
    console.error("❌ Confirmation email failed:", err.message);
  }
};
