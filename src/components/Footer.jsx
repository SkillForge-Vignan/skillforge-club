import React from 'react';

const Footer = React.memo(() => {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50 mt-12 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tighter">
              SKILL<span className="text-gradient">FORGE</span>
            </span>
          </div>
          
          <div className="text-center md:text-left text-sm text-gray-400">
            <p className="mt-1">© {new Date().getFullYear()} SkillForge. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/company/skillforge-viit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              LinkedIn
            </a>
            <a href="https://youtube.com/@skillforge_viit?si=CNGftmeEVKPEv-AY" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              YouTube
            </a>
            <a href="https://www.facebook.com/share/1AT2CbvTYd/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              Facebook
            </a>
            <a href="https://www.instagram.com/skillforge_club?igsh=MWF0a2FieXF3M2g2eQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
