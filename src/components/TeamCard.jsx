import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const COLORS = [
  'from-blue-600 to-cyan-500',
  'from-purple-600 to-pink-500',
  'from-emerald-600 to-teal-500',
  'from-orange-600 to-yellow-500',
  'from-rose-600 to-red-500',
];

const TeamCard = React.memo(({ name, role, domain, imageUrl, linkedin, github }) => {
  const color = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const displayImage = imageUrl && imageUrl.startsWith('/uploads/')
    ? `http://localhost:5000${imageUrl}`
    : imageUrl;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group glass-card rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors duration-200"
    >
      {/* Avatar */}
      <div className="h-52 relative overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
            <span className="text-5xl font-black text-white/30 select-none">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5 -mt-6 relative z-10">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-blue-400 text-sm font-medium">{role}</p>
        {domain && <p className="text-slate-500 text-xs mt-0.5">{domain}</p>}

        {/* Social links */}
        {(linkedin || github) && (
          <div className="flex gap-3 mt-4">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Github size={14} /> GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

TeamCard.displayName = 'TeamCard';
export default TeamCard;
