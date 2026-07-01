/**
 * Seed script — inserts sample projects into Supabase.
 * Run with: node utils/seedProjects.js
 */
import dotenv from "dotenv";
dotenv.config();
import { supabase } from "../config/supabase.js";

const PROJECTS = [
  {
    title: "SkillForge Portal",
    description: "A full-stack club management platform with member onboarding, event registration, and mentor assignment.",
    category: "Full Stack",
    tech_stack: ["React", "Node.js", "Supabase", "Tailwind CSS"],
    github_url: "https://github.com/skillforge/portal",
    live_url: "https://skillforge.club",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    status: "Completed",
    featured: true,
  },
  {
    title: "AI Resume Analyzer",
    description: "Analyzes resumes using NLP to provide skill gap insights and job match scores.",
    category: "AI/ML",
    tech_stack: ["Python", "FastAPI", "spaCy", "React"],
    github_url: "https://github.com/skillforge/ai-resume",
    live_url: null,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    status: "In Progress",
    featured: false,
  },
  {
    title: "Campus Event Hub",
    description: "A responsive web app for discovering and registering for campus events in real time.",
    category: "Web App",
    tech_stack: ["React", "Firebase", "Tailwind CSS"],
    github_url: "https://github.com/skillforge/event-hub",
    live_url: "https://events.skillforge.club",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    status: "Completed",
    featured: true,
  },
  {
    title: "SecureVault",
    description: "A password manager with AES-256 encryption, breach detection, and browser extension support.",
    category: "Cyber Security",
    tech_stack: ["Node.js", "React", "CryptoJS", "MongoDB"],
    github_url: "https://github.com/skillforge/securevault",
    live_url: null,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80",
    status: "In Progress",
    featured: false,
  },
  {
    title: "DesignKit UI",
    description: "An open-source Tailwind CSS component library with 50+ accessible, dark-mode-ready components.",
    category: "UI/UX",
    tech_stack: ["Tailwind CSS", "React", "Storybook"],
    github_url: "https://github.com/skillforge/designkit",
    live_url: "https://designkit.skillforge.club",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    status: "Completed",
    featured: true,
  },
  {
    title: "SmartAttend",
    description: "Automated attendance system using face recognition with real-time dashboard for faculty.",
    category: "AI/ML",
    tech_stack: ["Python", "OpenCV", "Flask", "React"],
    github_url: "https://github.com/skillforge/smartattend",
    live_url: null,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
    status: "In Progress",
    featured: false,
  },
];

const seed = async () => {
  console.log("🌱 Seeding projects...");

  const { data, error } = await supabase
    .from("projects")
    .upsert(PROJECTS, { onConflict: "title" })
    .select();

  if (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data.length} projects successfully.`);
  process.exit(0);
};

seed();
