import { supabase } from "../config/db.js";

export const getProjects = async (req, res, next) => {
  try {
    const { category, status, featured } = req.query;
    let query = supabase.from("projects").select("*").order("created_at", { ascending: false });

    if (category) query = query.ilike("category", category);
    if (status)   query = query.ilike("status", status);
    if (featured !== undefined) query = query.eq("featured", featured === "true");

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { next(err); }
};

export const getProject = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("projects").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Project not found." });
    res.json(data);
  } catch (err) { next(err); }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, category, teamMembers, status, featured, image } = req.body;
    if (!title || !description || !category)
      return res.status(400).json({ error: "title, description, and category are required." });

    const parseArr = (val) => val ? (Array.isArray(val) ? val : val.split(",").map((v) => v.trim()).filter(Boolean)) : [];

    // Support image URL from body OR uploaded file
    const imageValue = req.file ? `/uploads/${req.file.filename}` : (image || null);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        description,
        tech_stack:   parseArr(techStack),
        github_url:   githubUrl  || null,
        live_url:     liveUrl    || null,
        category,
        team_members: parseArr(teamMembers),
        status:       status   || "In Progress",
        featured:     featured === "true" || featured === true,
        image:        imageValue,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Project created.", project: data });
  } catch (err) { next(err); }
};

export const updateProject = async (req, res, next) => {
  try {
    const fields = req.body;
    const parseArr = (val) => val ? (Array.isArray(val) ? val : val.split(",").map((v) => v.trim()).filter(Boolean)) : undefined;

    const updates = {
      ...(fields.title       !== undefined && { title:        fields.title }),
      ...(fields.description !== undefined && { description:  fields.description }),
      ...(fields.category    !== undefined && { category:     fields.category }),
      ...(fields.status      !== undefined && { status:       fields.status }),
      ...(fields.githubUrl   !== undefined && { github_url:   fields.githubUrl }),
      ...(fields.liveUrl     !== undefined && { live_url:     fields.liveUrl }),
      ...(fields.image       !== undefined && { image:        fields.image }),
      ...(fields.techStack   !== undefined && { tech_stack:   parseArr(fields.techStack) }),
      ...(fields.teamMembers !== undefined && { team_members: parseArr(fields.teamMembers) }),
      ...(fields.featured    !== undefined && { featured:     fields.featured === "true" || fields.featured === true }),
      ...(req.file           && { image: `/uploads/${req.file.filename}` }),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("projects").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Project not found." });
    res.json({ message: "Project updated.", project: data });
  } catch (err) { next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", req.params.id);
    if (error) return res.status(404).json({ error: "Project not found." });
    res.json({ message: "Project deleted." });
  } catch (err) { next(err); }
};
