import { supabase } from "../config/db.js";

export const getAnnouncements = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = supabase.from("announcements").select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getAnnouncement = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("announcements").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Announcement not found." });
    res.json(data);
  } catch (err) { next(err); }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, type, isPinned } = req.body;
    if (!title || !body)
      return res.status(400).json({ error: "title and body are required." });

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title, body,
        type: type || "general",
        is_pinned: isPinned === true || isPinned === "true",
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Announcement created.", announcement: data });
  } catch (err) { next(err); }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, body, type, isPinned } = req.body;
    const updates = {
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...(type !== undefined && { type }),
      ...(isPinned !== undefined && { is_pinned: isPinned === true || isPinned === "true" }),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("announcements").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Announcement not found." });
    res.json({ message: "Announcement updated.", announcement: data });
  } catch (err) { next(err); }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { error } = await supabase.from("announcements").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Announcement not found." });
    res.json({ message: "Announcement deleted." });
  } catch (err) { next(err); }
};
