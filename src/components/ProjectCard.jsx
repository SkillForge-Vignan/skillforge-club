import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const CATEGORY_COLORS = {
  'Web App':         'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Web Development': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Full Stack':      'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'AI/ML':           'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'UI/UX':           'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Cyber Security':  'bg-red-500/20 text-red-300 border-red-500/30',
  'Mobile':          'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const ProjectCard = React.memo(({ title, description, category, image, githubLink, demoLink, tags }) => {
  const displayImage = image && image.startsWith('/uploads/')
    ? `http://localhost:5000${image}`
    : image;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden group hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col h-full shadow-xl shadow-black/25"
    >
      {/* Image / Placeholder */}
      <div className="h-48 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent z-10" />
        {displayImage ? (
          <img src={displayImage} alt={title} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-500 font-bold opacity-30 text-2xl tracking-widest uppercase">{title}</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Title + Category badge */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="text-xl font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors duration-200">{title}</h3>
          {category && (
            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[category] || 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'}`}>
              {category}
            </span>
          )}
        </div>

        <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">{description}</p>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-0.5 bg-slate-900/60 text-slate-400 rounded-full border border-white/5 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
          {githubLink && githubLink !== '#' && (
            <a
              href={githubLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-200 border border-white/5"
            >
              <Github size={15} /> Code
            </a>
          )}
          {demoLink && demoLink !== '#' && (
            <a
              href={demoLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-cyan-500/10"
            >
              <ExternalLink size={15} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
