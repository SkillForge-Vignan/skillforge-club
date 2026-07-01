import { supabase } from "../config/db.js";

// GET /messages/:studentId  — fetch conversation between mentor and student
export const getConversation = async (req, res, next) => {
  try {
    const mentorId  = req.user.id;
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${mentorId},receiver_id.eq.${studentId}),and(sender_id.eq.${studentId},receiver_id.eq.${mentorId})`
      )
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    // Mark messages sent by student as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", studentId)
      .eq("receiver_id", mentorId)
      .eq("is_read", false);

    res.json(data || []);
  } catch (err) { next(err); }
};

// POST /messages/:studentId  — send a message from mentor to student
export const sendMessage = async (req, res, next) => {
  try {
    const mentorId  = req.user.id;
    const { studentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ error: "Message content required." });

    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: mentorId, receiver_id: studentId, sender_role: "mentor", content: content.trim() })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: data });
  } catch (err) { next(err); }
};

// GET /messages/student/:mentorId — student fetches conversation with their mentor
export const getConversationAsStudent = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { mentorId } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${studentId},receiver_id.eq.${mentorId}),and(sender_id.eq.${mentorId},receiver_id.eq.${studentId})`
      )
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", mentorId)
      .eq("receiver_id", studentId)
      .eq("is_read", false);

    res.json(data || []);
  } catch (err) { next(err); }
};

// POST /messages/student/:mentorId — student sends message to mentor
export const sendMessageAsStudent = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { mentorId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ error: "Message content required." });

    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: studentId, receiver_id: mentorId, sender_role: "student", content: content.trim() })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: data });
  } catch (err) { next(err); }
};

// GET /messages/unread-counts — mentor gets unread count per student
export const getUnreadCounts = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const { data, error } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("receiver_id", mentorId)
      .eq("is_read", false);

    if (error) return res.status(500).json({ error: error.message });

    const counts = {};
    (data || []).forEach(({ sender_id }) => {
      counts[sender_id] = (counts[sender_id] || 0) + 1;
    });
    res.json(counts);
  } catch (err) { next(err); }
};
