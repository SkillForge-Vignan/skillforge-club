import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { Loader2, Rocket, RefreshCw } from 'lucide-react';
import { api } from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getProjects();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [projects]);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  if (loading) return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-cyan-400" size={40} />
      <p className="text-slate-400 text-sm">Connecting to server...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <RefreshCw size={28} className="text-red-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Could not load projects</h2>
        <p className="text-slate-400 text-sm max-w-sm">The server may be waking up. Please wait a moment and try again.</p>
      </div>
      <button
        onClick={load}
        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
      >
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1121] text-white pt-24 pb-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'layout paint' }}>
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -20, 30, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
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

        {projects.length > 0 && (
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
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-white/5">
            <Rocket size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-lg font-medium">
              {projects.length === 0 ? 'No projects added yet.' : `No projects found in "${filter}".`}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {projects.length === 0 ? 'Projects will appear here once added by the admin.' : ''}
            </p>
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