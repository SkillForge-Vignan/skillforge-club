import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImage from '../assets/logo.png';

const Navbar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Domains', path: '/domains' },
    { name: 'Projects', path: '/projects' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'Feedback', path: '/feedback' },
  ], []);

  const closeMenu = () => setIsOpen(false);

  // Optimized hash scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'auto' });
        });
      }
    }
  }, [location.hash]);

  return (
    <nav className="fixed w-full z-50 bg-slate-950/75 backdrop-blur-md border-b border-white/5 top-0" style={{ contain: 'layout style paint' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ willChange: 'transform' }}>
        <div className="flex items-center justify-between h-20">
          
          {/* Desktop Left Spacer (Balances Login button width to perfectly center links) */}
          <div className="hidden md:block w-[110px]"></div>

          {/* Centered Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (location.pathname === '/' && location.hash === link.path.replace('/', ''));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 text-base lg:text-lg font-medium transition-all duration-300 relative group ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 origin-center ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Login Button */}
          <div className="hidden md:flex justify-end w-[110px]">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full text-base font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-slate-950 hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              Login
            </Link>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between w-full">
            <div></div> {/* Spacer to push button to right */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/15 focus:outline-none transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (location.pathname === '/' && location.hash === link.path.replace('/', ''));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/5">
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full py-3.5 rounded-xl text-center text-lg font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-slate-950 hover:opacity-90 transition-opacity duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
