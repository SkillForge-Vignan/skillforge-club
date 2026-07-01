import { supabase } from "../config/db.js";

export const getAssignments = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("mentor_assignments")
      .select("id, assigned_at, student_id, mentor_id");
    if (error) return res.status(500).json({ error: error.message });

    const results = await Promise.all((data || []).map(async (a) => {
      const { data: student } = await supabase.from("students").select("id, name, email").eq("id", a.student_id).single();
      const { data: mentor }  = await supabase.from("mentors").select("id, name, email").eq("id", a.mentor_id).single();
      return { id: a.id, assignedAt: a.assigned_at, student, mentor };
    }));

    res.json(results);
  } catch (err) { next(err); }
};

export const assignStudentToMentor = async (req, res, next) => {
  try {
    const { studentId, mentorId } = req.body;
    if (!studentId || !mentorId)
      return res.status(400).json({ error: "studentId and mentorId are required." });

    const { data: student } = await supabase.from("students").select("id, name, email").eq("id", studentId).single();
    const { data: mentor }  = await supabase.from("mentors").select("id, name, email, password").eq("id", mentorId).single();
    if (!student) return res.status(404).json({ error: "Student not found." });
    if (!mentor)  return res.status(404).json({ error: "Mentor not found." });

    // Ensure both exist in users table (FK requirement)
    await supabase.from("users").upsert(
      { id: student.id, name: student.name, email: student.email, password: "", role: "student" },
      { onConflict: "id" }
    );
    await supabase.from("users").upsert(
      { id: mentor.id, name: mentor.name, email: mentor.email, password: mentor.password || "", role: "mentor" },
      { onConflict: "id" }
    );

    await supabase.from("mentor_assignments").delete().eq("student_id", studentId);

    const { data, error } = await supabase
      .from("mentor_assignments")
      .insert({ student_id: studentId, mentor_id: mentorId })
      .select("id, assigned_at").single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({
      message: `${student.name} assigned to ${mentor.name}.`,
      assignment: { id: data.id, student, mentor, assignedAt: data.assigned_at },
    });
  } catch (err) { next(err); }
};

export const removeAssignment = async (req, res, next) => {
  try {
    const { error } = await supabase.from("mentor_assignments").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Assignment not found." });
    res.json({ message: "Assignment removed." });
  } catch (err) { next(err); }
};

export const getMentorsList = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("mentors").select("id, name, email");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getMyMentor = async (req, res, next) => {
  try {
    const { data } = await supabase
      .from("mentor_assignments")
      .select("assigned_at, mentor_id")
      .eq("student_id", req.user.id)
      .single();

    if (!data) return res.json(null);

    const { data: mentor } = await supabase.from("mentors").select("id, name, email, created_at").eq("id", data.mentor_id).single();
    res.json({ ...mentor, role: "mentor", assignedAt: data.assigned_at });
  } catch (err) { next(err); }
};
