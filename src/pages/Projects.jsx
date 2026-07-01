import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const MOCK_PROJECTS = useMemo(() => [
    {
      id: 1,
      title: 'AI Resume Analyzer',
      description: 'An intelligent parsing engine that extracts critical information from resumes, scoring them against industry benchmarks to give students actionable feedback.',
      category: 'AI/ML',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      githubUrl: 'https://github.com/skillforge-club/ai-resume-analyzer',
      liveUrl: 'https://resume-analyzer.skillforge.club',
      techStack: ['Python', 'FastAPI', 'NLP', 'React']
    },
    {
      id: 2,
      title: 'Smart Home Hub',
      description: 'A centralized dashboard connecting multiple microcontrollers. Allows students to control lights, monitor temperature, and run automated routines directly from the web.',
      category: 'Full Stack',
      image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop',
      githubUrl: 'https://github.com/skillforge-club/smart-home-hub',
      liveUrl: 'https://smarthome.skillforge.club',
      techStack: ['C++', 'ESP32', 'React', 'Node.js']
    },
    {
      id: 3,
      title: 'SkillForge Student Hub',
      description: 'The internal student, mentor, and admin platform designed to track project progress, assign mentorship tasks, and manage code check-ins.',
      category: 'Web App',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
      githubUrl: 'https://github.com/skillforge-club/hub',
      liveUrl: 'https://portal.skillforge.club',
      techStack: ['React', 'Vite', 'Tailwind', 'Express', 'Postgres']
    }
  ], []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProjects();
        if (Array.isArray(data)) {
          setProjects(data);
          setIsOffline(false);
        } else {
          setProjects(MOCK_PROJECTS);
          setIsOffline(true);
        }
      } catch (err) {
        console.warn("Backend not running, falling back to mock projects.");
        setProjects(MOCK_PROJECTS);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [MOCK_PROJECTS]);

  // Derive categories dynamically from data
  const categories = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [projects]);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  if (loading) return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center">
      <Loader2 className="animate-spin text-cyan-400" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1121] text-white pt-24 pb-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Morphing background gradient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'layout paint' }}>
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" 
        />
        <motion.div
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 30, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-purple-500/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Discover the amazing products built by our community.
          </p>
        </div>

        {isOffline && (
          <div className="max-w-2xl mx-auto mb-10 px-6 py-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-400" />
            <span>
              <strong>Demo Mode:</strong> The frontend cannot connect to the backend server (at <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xs text-white">http://localhost:5000</code>). Showing offline mock projects.
            </span>
          </div>
        )}

        {/* Dynamic category filters from DB */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400'
                  : 'bg-slate-900/60 backdrop-blur-md text-gray-400 hover:text-white hover:bg-slate-800/80 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <p className="text-lg">No projects found{filter !== 'All' ? ` in "${filter}"` : ''}.</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    category={project.category}
                    image={project.image}
                    githubLink={project.github_url || project.githubUrl}
                    demoLink={project.live_url || project.liveUrl}
                    tags={project.tech_stack || project.techStack || []}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;