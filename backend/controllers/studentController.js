import { supabase } from "../config/db.js";

const assignedToMatchesStudent = (task, userId, userEmail) => {
  const assignedTo = String(task.assigned_to || "all").trim().toLowerCase();
  const normalizedId = String(userId).trim().toLowerCase();
  const normalizedEmail = String(userEmail || "").trim().toLowerCase();
  return (
    assignedTo === "" ||
    assignedTo === "all" ||
    assignedTo === normalizedId ||
    (normalizedEmail && assignedTo === normalizedEmail)
  );
};

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: user } = await supabase.from("students").select("email").eq("id", userId).single();
    const { data: myRegs } = await supabase.from("registrations").select("event_id, event_title, registered_at").ilike("email", user?.email || "");
    const { data: allTasks } = await supabase.from("tasks").select("*");
    const myTasks = (allTasks || []).filter((task) => assignedToMatchesStudent(task, userId, user?.email));

    const completed = (myTasks || []).filter((t) => t.status === "Completed").length;
    const totalTasks = (myTasks || []).length;

    const domains = [...new Set((myTasks || []).map((t) => t.domain))];
    const progress = domains.map((domain) => {
      const dt = (myTasks || []).filter((t) => t.domain === domain);
      const done = dt.filter((t) => t.status === "Completed").length;
      const level = dt.length ? Math.round((done / dt.length) * 100) : 0;
      return { id: domain, domain, level, tier: level >= 70 ? "Advanced" : level >= 40 ? "Intermediate" : "Beginner" };
    });

    res.json({
      stats: {
        totalProjects: myRegs?.length || 0,
        skillsLearned: domains.length,
        overallProgress: `${completed}/${totalTasks}`,
        tasksCompleted: `${completed}/${totalTasks}`,
      },
      assignments: (myTasks || []).map((t) => ({ ...t, type: t.status === "Completed" ? "done" : "pending" })),
      registeredEvents: (myRegs || []).map((r) => ({
        eventId: r.event_id,
        eventTitle: r.event_title,
        registeredAt: r.registered_at,
      })),
      progress,
      activity: [],
    });
  } catch (err) { next(err); }
};

export const getAssignments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data: user } = await supabase.from("students").select("email").eq("id", userId).single();
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) return res.status(500).json({ error: error.message });
    const tasks = (data || []).filter((task) => assignedToMatchesStudent(task, userId, user?.email));
    res.json(tasks);
  } catch (err) { next(err); }
};

export const completeAssignment = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "Completed" })
      .eq("id", req.params.id)
      .select().single();
    if (error || !data) return res.status(404).json({ error: "Assignment not found." });
    res.json({ message: "Marked as completed.", assignment: data });
  } catch (err) { next(err); }
};

export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data: user } = await supabase.from("students").select("email").eq("id", userId).single();
    const { data } = await supabase.from("tasks").select("domain, status, assigned_to");
    const tasks = (data || []).filter((task) => assignedToMatchesStudent(task, userId, user?.email));

    const domains = [...new Set(tasks.map((t) => t.domain))];
    const result = domains.map((domain) => {
      const domainTasks = tasks.filter((t) => t.domain === domain);
      const done = domainTasks.filter((t) => t.status === "Completed").length;
      const level = domainTasks.length ? Math.round((done / domainTasks.length) * 100) : 0;
      return { domain, level, tier: level >= 70 ? "Advanced" : level >= 40 ? "Intermediate" : "Beginner" };
    });

    res.json(result);
  } catch (err) { next(err); }
};

export const getProfile = async (req, res, next) => {
  try {
    const { data: user } = await supabase.from("students").select("id, name, email, domain_interest, created_at").eq("id", req.user.id).single();
    if (!user) return res.status(404).json({ error: "User not found." });

    const { data: myRegs } = await supabase.from("registrations").select("*").ilike("email", user.email);
    res.json({ ...user, role: "student", totalProjects: myRegs?.length || 0, registeredEvents: myRegs || [] });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, domain_interest } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (domain_interest !== undefined) updates.domain_interest = domain_interest;

    const { data: updatedStudent, error: err1 } = await supabase
      .from("students")
      .update(updates)
      .eq("id", req.user.id)
      .select("*")
      .single();

    if (err1) throw err1;

    if (name) {
      await supabase
        .from("users")
        .update({ name })
        .eq("id", req.user.id);
    }

    res.json({ message: "Profile updated successfully", student: updatedStudent });
  } catch (err) {
    next(err);
  }
};
