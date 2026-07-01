import { supabase } from "../config/db.js";
import { sendRegistrationConfirmation } from "../utils/mailer.js";

export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, name, email, phone, rollNumber, branch, year } = req.body;
    if (!eventId || !name || !email)
      return res.status(400).json({ error: "eventId, name, and email are required." });

    const { data: event } = await supabase
      .from("events").select("*").eq("id", eventId).single();
    if (!event) return res.status(404).json({ error: "Event not found." });
    if (!event.is_active) return res.status(400).json({ error: "Registrations are closed for this event." });
    if (event.registered >= event.capacity)
      return res.status(400).json({ error: "Event is at full capacity." });

    const { data: duplicate } = await supabase
      .from("registrations")
      .select("id")
      .eq("event_id", eventId)
      .ilike("email", email)
      .single();
    if (duplicate) return res.status(409).json({ error: "You are already registered for this event." });

    const { data: reg, error } = await supabase
      .from("registrations")
      .insert({
        event_id: eventId,
        event_title: event.title,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        roll_number: rollNumber || null,
        branch: branch || null,
        year: year || null,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });

    await supabase.from("events").update({ registered: event.registered + 1 }).eq("id", eventId);

    // Send confirmation email to the applicant (non-blocking)
    sendRegistrationConfirmation({
      name,
      email,
      eventTitle: event.title,
      date: event.date,
      venue: event.venue,
    });

    res.status(201).json({
      message: `Successfully registered for "${event.title}".`,
      registration: { id: reg.id, eventTitle: reg.event_title, name: reg.name, email: reg.email, registeredAt: reg.registered_at },
    });
  } catch (err) { next(err); }
};

export const getAllRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.query;
    let query = supabase.from("registrations").select("*").order("registered_at", { ascending: false });
    if (eventId) query = query.eq("event_id", eventId);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("registrations").select("*").ilike("email", req.user.email);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const { data: reg } = await supabase
      .from("registrations").select("event_id").eq("id", req.params.id).single();
    if (!reg) return res.status(404).json({ error: "Registration not found." });

    await supabase.from("registrations").delete().eq("id", req.params.id);

    const { data: event } = await supabase
      .from("events").select("registered").eq("id", reg.event_id).single();
    if (event && event.registered > 0)
      await supabase.from("events").update({ registered: event.registered - 1 }).eq("id", reg.event_id);

    res.json({ message: "Registration cancelled." });
  } catch (err) { next(err); }
};

export const getStats = async (req, res, next) => {
  try {
    const { data: events } = await supabase.from("events").select("id, title, capacity, registered");
    const { data: regs } = await supabase.from("registrations").select("email");

    const totalEvents = events?.length || 0;
    const totalRegistrations = regs?.length || 0;
    const totalMembers = new Set(regs?.map((r) => r.email)).size;
    const byEvent = (events || []).map((e) => ({
      eventId: e.id,
      eventTitle: e.title,
      capacity: e.capacity,
      registered: e.registered,
      fillRate: `${Math.round((e.registered / e.capacity) * 100)}%`,
    }));

    res.json({ totalEvents, totalRegistrations, totalMembers, byEvent });
  } catch (err) { next(err); }
};
