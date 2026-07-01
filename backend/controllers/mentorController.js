import { supabase } from "../config/db.js";

const selectUserFields = "id, name, email, created_at";

const getMentorRecord = async (mentorId) => {
  const { data: mentor, error: mentorError } = await supabase
    .from("mentors")
    .select(selectUserFields)
    .eq("id", mentorId)
    .single();

  if (mentorError || !mentor) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("users")
      .select(selectUserFields)
      .eq("id", mentorId)
      .single();
    if (fallbackError) throw fallbackError;
    return fallback;
  }

  return mentor;
};

const getStudentRecords = async (studentIds) => {
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, name, email, domain_interest, created_at")
    .in("id", studentIds);

  if (studentsError || !students || students.length === 0) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .in("id", studentIds);
    if (fallbackError) throw fallbackError;
    return (fallback || []).map((s) => ({ ...s, domain_interest: "" }));
  }

  return students;
};

export const getMentorOverview = async (req, res, next) => {
  try {
    const { data: assignments } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("mentor_id", req.user.id);

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("mentor_id", req.user.id);

    const totalStudents = assignments?.length || 0;

    res.json({
      stats: {
        totalStudents,
        activeStudents: totalStudents,
        tasksAssigned: tasks?.length || 0,
        avgPerformance: "0%",
      },
      tasks: tasks || [],
      recentMessages: [],
    });
  } catch (err) { next(err); }
};

export const getMentorStudents = async (req, res, next) => {
  try {
    // Get only students assigned to this mentor
    const { data: assignments, error: ae } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("mentor_id", req.user.id);
    if (ae) return res.status(500).json({ error: ae.message });

    if (!assignments || assignments.length === 0) return res.json([]);

    const studentIds = assignments.map((a) => a.student_id);
    const students = await getStudentRecords(studentIds);

    const { data: tasks, error: te } = await supabase
      .from("tasks")
      .select("id, title, status, deadline, domain, assigned_to, mentor_id")
      .eq("mentor_id", req.user.id);
    if (te) return res.status(500).json({ error: te.message });

    const tasksByStudent = (students || []).reduce((map, student) => {
      const studentId = String(student.id).trim().toLowerCase();
      const studentEmail = String(student.email).trim().toLowerCase();
      const studentTasks = (tasks || []).filter((task) => {
        const assignedTo = String(task.assigned_to || "all").trim().toLowerCase();
        return (
          assignedTo === "" ||
          assignedTo === "all" ||
          assignedTo === studentId ||
          assignedTo === studentEmail
        );
      });
      return {
        ...map,
        [student.id]: studentTasks,
      };
    }, {});

    res.json((students || []).map((s) => {
      const studentTasks = tasksByStudent[s.id] || [];
      const completed = studentTasks.filter((t) => t.status === "Completed").length;
      const progressLevel = studentTasks.length ? Math.round((completed / studentTasks.length) * 100) : 0;
      return {
        ...s,
        domain: s.domain_interest || "General",
        progressLevel,
        tasks: studentTasks,
        createdAt: s.created_at,
      };
    }));
  } catch (err) { next(err); }
};

export const getMentorTasks = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("mentor_id", req.user.id).order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, deadline, domain } = req.body;
    if (!title || !deadline)
      return res.status(400).json({ error: "title and deadline are required." });

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        mentor_id: req.user.id,
        title,
        description: description || "",
        assigned_to: assignedTo || "all",
        deadline,
        domain: domain || "General",
        status: "Pending",
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Task assigned successfully.", task: data });
  } catch (err) { next(err); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch (err) { next(err); }
};

export const getMentorProfile = async (req, res, next) => {
  try {
    const user = await getMentorRecord(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const { data: assignments } = await supabase.from("mentor_assignments").select("id").eq("mentor_id", req.user.id);
    const { data: tasks } = await supabase.from("tasks").select("id").eq("mentor_id", req.user.id);

    res.json({ ...user, role: "mentor", totalStudents: assignments?.length || 0, tasksAssigned: tasks?.length || 0 });
  } catch (err) { next(err); }
};
