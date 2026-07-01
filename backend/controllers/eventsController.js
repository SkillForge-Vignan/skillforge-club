import { supabase } from "../config/db.js";

export const getEvents = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    let query = supabase.from("events").select("*").order("date", { ascending: true });

    if (category) query = query.ilike("category", category);
    if (active !== undefined) query = query.eq("is_active", active === "true");

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getEvent = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("events").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Event not found." });
    res.json(data);
  } catch (err) { next(err); }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, category, capacity, tags, registrationLink } = req.body;
    if (!title || !date || !venue || !category)
      return res.status(400).json({ error: "title, date, venue, and category are required." });

    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        description: description || "",
        date, time: time || "",
        venue, category,
        capacity: Number(capacity) || 100,
        registered: 0,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
        is_active: true,
        registration_link: registrationLink || null,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Event created.", event: data });
  } catch (err) { next(err); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, category, capacity, tags, isActive } = req.body;
    const updates = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date }),
      ...(time !== undefined && { time }),
      ...(venue !== undefined && { venue }),
      ...(category !== undefined && { category }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()) }),
      ...(isActive !== undefined && { is_active: isActive === "true" || isActive === true }),
      ...(req.file && { image: `/uploads/${req.file.filename}` }),
    };

    const { data, error } = await supabase
      .from("events").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event updated.", event: data });
  } catch (err) { next(err); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { error } = await supabase.from("events").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (err) { next(err); }
};

export const getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("events").select("category");
    if (error) return res.status(500).json({ error: error.message });
    const cats = [...new Set(data.map((e) => e.category))];
    res.json(cats);
  } catch (err) { next(err); }
};
