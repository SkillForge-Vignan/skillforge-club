import { supabase } from "../config/db.js";

export const getTeam = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("team_members").select("*").order("id", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getTeamMember = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("team_members").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Team member not found." });
    res.json(data);
  } catch (err) { next(err); }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, department, year, bio, linkedin, github, avatar } = req.body;
    if (!name || !role)
      return res.status(400).json({ error: "name and role are required." });

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        name, role,
        department: department || "",
        year: year || "",
        bio: bio || "",
        linkedin: linkedin || null,
        github: github || null,
        avatar: req.file ? `/uploads/${req.file.filename}` : (avatar || null),
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Team member added.", member: data });
  } catch (err) { next(err); }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, role, department, year, bio, linkedin, github, avatar } = req.body;
    const updates = {
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(department !== undefined && { department }),
      ...(year !== undefined && { year }),
      ...(bio !== undefined && { bio }),
      ...(linkedin !== undefined && { linkedin }),
      ...(github !== undefined && { github }),
      ...(req.file ? { avatar: `/uploads/${req.file.filename}` } : avatar !== undefined && { avatar }),
    };

    const { data, error } = await supabase
      .from("team_members").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Team member not found." });
    res.json({ message: "Team member updated.", member: data });
  } catch (err) { next(err); }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const { error } = await supabase.from("team_members").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Team member not found." });
    res.json({ message: "Team member removed." });
  } catch (err) { next(err); }
};
