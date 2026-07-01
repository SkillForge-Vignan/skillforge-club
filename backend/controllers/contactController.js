import { supabase } from "../config/db.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: "name, email, and message are required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email format." });

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email: email.toLowerCase(),
        subject: subject || "General Inquiry",
        message,
        is_read: false,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({
      message: "Message received! We'll get back to you within 24–48 hours.",
      id: data.id,
    });
  } catch (err) { next(err); }
};

export const getMessages = async (req, res, next) => {
  try {
    const { unread } = req.query;
    let query = supabase.from("contact_messages").select("*").order("submitted_at", { ascending: false });
    if (unread === "true") query = query.eq("is_read", false);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const markRead = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: true, read_at: new Date() })
      .eq("id", req.params.id)
      .select().single();

    if (error || !data) return res.status(404).json({ error: "Message not found." });
    res.json({ message: "Marked as read.", contact: data });
  } catch (err) { next(err); }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { error } = await supabase.from("contact_messages").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (err) { next(err); }
};
