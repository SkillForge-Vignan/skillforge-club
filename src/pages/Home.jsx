import React, { useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, BrainCircuit, Rocket, BookOpen, Calendar, Users, MessageSquare, LogIn, ChevronRight, CheckCircle2, ChevronDown, MonitorPlay, Code2, Sparkles, Mail, Phone, MapPin, Send, Code, Cpu, Smartphone, AlertCircle } from 'lucide-react';
import skillForgeLogo from '../assets/logo.png';
import campusBg from '../assets/campus.png';

const Home = React.memo(() => {
  const { scrollY } = useScroll();

  // Simplified parallax - reduced animation intensity
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Reduced scroll animation range  
  const skillX = useTransform(scrollY, [0, 400], [0, -50]);
  const forgeX = useTransform(scrollY, [0, 400], [0, 50]);

  // Framer Motion Animation Variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const scaleUpVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const [homeEvents, setHomeEvents] = useState([]);
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isProjectsOffline, setIsProjectsOffline] = useState(false);
  const [activeProj, setActiveProj] = useState(0);

  const FEATURED_PROJECTS = useMemo(() => [
    {
      id: 1,
      title: 'AI Resume Analyzer',
      category: 'Data & AI',
      desc: 'An intelligent parsing engine that extracts critical information from resumes, scoring them against industry benchmarks to give students actionable feedback.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      tech: ['Python', 'FastAPI', 'NLP', 'React'],
      link: '/projects'
    },
    {
      id: 2,
      title: 'Smart Home Hub',
      category: 'Hardware / IoT',
      desc: 'A centralized dashboard connecting multiple microcontrollers. Allows students to control lights, monitor temperature, and run automated routines directly from the web.',
      image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop',
      tech: ['C++', 'ESP32', 'React', 'Node.js'],
      link: '/projects'
    }
  ], []);

  const displayProjects = useMemo(() => {
    if (featuredProjects.length > 0) return featuredProjects;
    if (isProjectsOffline) return FEATURED_PROJECTS;
    return [];
  }, [featuredProjects, isProjectsOffline, FEATURED_PROJECTS]);

  useEffect(() => {
    if (activeProj >= displayProjects.length && displayProjects.length > 0) {
      setActiveProj(0);
    }
  }, [displayProjects, activeProj]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcoming = data.filter((e) => {
            const parts = e.date.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d >= today;
          });
          setHomeEvents((upcoming.length > 0 ? upcoming : data).slice(0, 3));
          setIsBackendOffline(false);
        }
      })
      .catch(() => {
        setIsBackendOffline(true);
      });

    fetch('http://localhost:5000/api/projects?featured=true')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedProjects(data);
          setIsProjectsOffline(false);
        }
      })
      .catch(() => {
        setIsProjectsOffline(true);
      });
  }, [FEATURED_PROJECTS]);

  return (
    <div className="min-h-screen text-white bg-[#0B1121] overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100" style={{ contain: 'layout' }}>

      {/* Optimized Dynamic Background - morphing floating gradient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'layout paint' }}>
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[60px]" 
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[60px]" 
        />
        <motion.div
          animate={{
            x: [0, 20, -40, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.05, 0.9, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[60px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 pt-20 pb-10 text-center" style={{ contain: 'layout style paint', backgroundImage: `url(${campusBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Logo with entrance + continuous floating animation */}
          <motion.div variants={logoVariants} className="relative mb-10 w-48 h-48">
            <motion.img
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={skillForgeLogo}
              alt="SkillForge Logo"
              className="relative z-10 w-full h-full object-contain opacity-90"
              loading="eager"
            />
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-center justify-center mb-8 mt-2">
            <div className="flex items-center gap-0">
              <motion.h1 style={{ x: skillX }} className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-slate-100 mb-0 pb-4 drop-shadow-lg">
                Skill
              </motion.h1>
              <motion.h1 style={{ x: forgeX }} className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 mb-0 pb-4 z-10">
                Forge
              </motion.h1>
            </div>
          </motion.div>

          <motion.h2 variants={heroItemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-200 mb-8 tracking-wide">
            Build Skills <span className="text-cyan-500 mx-2">•</span> Build Projects <span className="text-cyan-500 mx-2">•</span> Build Future
          </motion.h2>

          <motion.p variants={heroItemVariants} className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mx-auto mb-12">
            A technical community focused on transforming students into industry-ready professionals through hands-on projects, expert mentorship, and collaborative teamwork.
          </motion.p>

          <motion.div
            variants={heroItemVariants}
            className="absolute bottom-10 opacity-50 text-cyan-500"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Content wrapper */}
      <div className="relative z-20 bg-[#0B1121]/90 border-t border-white/5 pb-32" style={{ contain: 'layout style paint' }}>

        {/* Offline notice */}
        {(isBackendOffline || isProjectsOffline) && (
          <div className="max-w-4xl mx-auto mt-12 px-6 py-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)] relative z-30">
            <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-400" />
            <span>
              <strong>Demo Mode:</strong> The frontend cannot connect to the backend server (at <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xs text-white">http://localhost:5000</code>). Some sections are showing mock data.
            </span>
          </div>
        )}

        {/* ABOUT SECTION: Purpose, Vision, Mission */}
        <section id="about" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5 scroll-mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
            className="mb-10 text-center"
          >
            <motion.h2 variants={fadeInUpVariants} className="text-4xl md:text-5xl font-black text-white mb-6">About SkillForge</motion.h2>
            <motion.div variants={fadeInUpVariants} className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mb-16" />

            {/* 3 Cards: Purpose, Vision, Mission */}
            <motion.div variants={staggerContainerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { title: 'Our Purpose', desc: 'To act as a bridge for students by showing them a clear path to opportunities and connecting them with like-minded individuals.' },
                { title: 'Our Vision', desc: 'To cultivate a thriving ecosystem of innovators who are empowered to build real products and solve tangible problems.' },
                { title: 'Our Mission', desc: 'To transform enthusiastic students into proven, industry-ready professionals through collaboration and mentorship.' }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUpVariants}
                  whileHover={{ y: -8, borderColor: "rgba(6, 182, 212, 0.5)", backgroundColor: "rgba(15, 23, 42, 0.7)", boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)" }}
                  className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 text-left group box-border cursor-default shadow-xl shadow-black/25"
                >
                  <div className="mb-6 w-12 h-12 flex items-center justify-center bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                    <img src={skillForgeLogo} alt="SkillForge Club Logo" className="w-8 h-8 object-contain opacity-90" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Q&A Card */}
            <motion.div
              variants={fadeInUpVariants}
              whileHover={{ borderColor: "rgba(6, 182, 212, 0.4)", boxShadow: "0 0 40px rgba(6, 182, 212, 0.15)" }}
              className="bg-gradient-to-br from-cyan-950/20 via-slate-950/50 to-blue-950/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-left relative overflow-hidden group transition-all duration-300 box-border shadow-2xl shadow-black/30"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] -mr-32 -mt-32" style={{ willChange: 'none' }} />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">What is SkillForge?</h3>
              <p className="text-lg text-cyan-50/90 leading-relaxed relative z-10">
                SkillForge is a student-led technical community designed to bridge the gap between classroom theory and real-world software engineering. We believe that true engineering mastery comes from building, launching, and maintaining actual applications.
              </p>
              <p className="text-lg text-cyan-50/90 leading-relaxed relative z-10">
                Founded by the Data Science Section, our mission is to foster a collaborative environment where students write clean code, launch web platforms, and deploy intelligent systems, guided by peer mentors with industry-level experience.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* 1. PROJECTS: Interactive Showcase Deck */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 flex items-center justify-center gap-4">
              <Code2 className="w-12 h-12 text-cyan-400" /> Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </motion.div>

          {displayProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-16 text-slate-500 font-medium bg-slate-950/20 rounded-3xl border border-white/5 max-w-lg mx-auto"
            >
              No projects showcased at the moment.
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Left Tabs Selector */}
              <motion.div
                variants={slideInLeft}
                className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-4 pb-4 lg:pb-0 scrollbar-none snap-x relative z-10"
              >
                {displayProjects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    onClick={() => setActiveProj(idx)}
                    className={`snap-center shrink-0 w-[280px] lg:w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      activeProj === idx
                        ? 'bg-slate-950/60 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-950/20 border-white/5 hover:border-white/10 hover:bg-slate-950/40'
                    }`}
                  >
                    {/* Active highlight line */}
                    {activeProj === idx && (
                      <motion.div
                        layoutId="activeTabLine"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 hidden lg:block"
                      />
                    )}
                    {activeProj === idx && (
                      <motion.div
                        layoutId="activeTabLineMobile"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 lg:hidden"
                      />
                    )}
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-mono font-bold ${activeProj === idx ? 'text-cyan-400' : 'text-slate-500'}`}>
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className={`font-bold transition-colors ${activeProj === idx ? 'text-white' : 'text-slate-400'}`}>
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">{proj.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>

              {/* Right Display Panel */}
              <motion.div
                variants={slideInRight}
                className="lg:col-span-2 relative min-h-[420px]"
              >
                <AnimatePresence mode="wait">
                  {displayProjects[activeProj] && (
                    <motion.div
                      key={activeProj}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 h-full"
                    >
                      {/* Left Column (Image) */}
                      <div className="w-full md:w-1/2 relative aspect-video md:aspect-square lg:aspect-video rounded-3xl overflow-hidden border border-white/5 shrink-0 group/img">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-60 z-10" />
                        <img
                          src={displayProjects[activeProj].image ? (displayProjects[activeProj].image.startsWith('/uploads/') ? `http://localhost:5000${displayProjects[activeProj].image}` : displayProjects[activeProj].image) : ''}
                          alt={displayProjects[activeProj].title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Right Column (Info) */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div className="space-y-4">
                          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-semibold text-xs border border-cyan-500/20">
                            {displayProjects[activeProj].category}
                          </div>
                          <h3 className="text-3xl font-black text-white leading-tight">
                            {displayProjects[activeProj].title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {displayProjects[activeProj].desc || displayProjects[activeProj].description || ''}
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {(displayProjects[activeProj].tech || displayProjects[activeProj].tech_stack || []).map((t) => (
                              <span key={t} className="text-xs px-2.5 py-0.5 bg-slate-900/60 text-slate-400 rounded-full border border-white/5 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                          <Link
                            to={displayProjects[activeProj].link || '/projects'}
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-base transition-colors group/link"
                          >
                            Explore Case Study <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* 2. DOMAINS: Interactive Tree Branches */}
        <section className="py-24 bg-gradient-to-b from-[#0B1121] to-[#0f172a] relative scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Core Domains</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Master the technologies that dictate the future. Pick your path and start building.</p>
            </motion.div>

            {/* Tree Layout Container */}
            <div className="relative mt-20">
              
              {/* Root Node (Desktop) */}
              <div className="hidden md:flex justify-center mb-16 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-slate-950/60 backdrop-blur-xl border border-cyan-500/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                >
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-white font-bold tracking-wide uppercase text-xs">SkillForge Core Base</span>
                </motion.div>
              </div>

              {/* Tree Branches SVG (Desktop Only) */}
              <div className="absolute inset-x-0 top-[2.5rem] h-24 pointer-events-none hidden md:block z-0">
                <svg className="w-full h-full text-cyan-500/25" fill="none" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <path d="M 600 0 C 600 40, 200 60, 200 100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 600 0 L 600 100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 600 0 C 600 40, 1000 60, 1000 100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                </svg>
              </div>

              {/* Tree Trunk (Mobile Only) */}
              <div className="absolute left-[31px] top-[1.5rem] bottom-16 w-0.5 border-l border-dashed border-cyan-500/20 md:hidden z-0" />

              {/* Three Domain Nodes */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10"
              >
                {[
                  { 
                    title: 'Web Development', 
                    desc: 'Comprehensive guidance from HTML/CSS basics to advanced frontend frameworks and backend databases. Build real web products that launch to users.', 
                    icon: <Code className="w-6 h-6 text-cyan-400" />,
                    color: 'from-cyan-500/20 to-blue-500/5',
                    borderColor: 'group-hover:border-cyan-500/50',
                    shadowColor: 'rgba(6, 182, 212, 0.15)'
                  },
                  { 
                    title: 'Machine Learning', 
                    desc: 'Comprehensive guidance from foundations of linear algebra and statistics to deep neural networks. Design predictive models and computer vision pipelines.', 
                    icon: <Cpu className="w-6 h-6 text-purple-400" />,
                    color: 'from-purple-500/20 to-indigo-500/5',
                    borderColor: 'group-hover:border-purple-500/50',
                    shadowColor: 'rgba(168, 85, 247, 0.15)'
                  },
                  { 
                    title: 'App Development', 
                    desc: 'Comprehensive guidance on cross-platform frameworks and native architectures. Code smooth fluid animations and launch fully-functional applications.', 
                    icon: <Smartphone className="w-6 h-6 text-blue-400" />,
                    color: 'from-blue-500/20 to-cyan-500/5',
                    borderColor: 'group-hover:border-blue-500/50',
                    shadowColor: 'rgba(59, 130, 246, 0.15)'
                  }
                ].map((domain, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUpVariants}
                    whileHover={{ y: -8 }}
                    className="flex gap-4 md:flex-col items-start md:items-center text-left md:text-center group"
                  >
                    {/* Node connector dot / icon container */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300 relative z-20">
                      {domain.icon}
                    </div>

                    {/* Node details card */}
                    <div 
                      className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-300 shadow-xl shadow-black/25 flex flex-col justify-between flex-grow h-full border-t border-t-white/15"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-200">{domain.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{domain.desc}</p>
                      </div>
                      <div>
                        <Link to="/contact" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-white/5 group-hover:bg-cyan-500 group-hover:text-slate-950 border border-white/5 transition-all duration-300">
                          Start Learning
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUpVariants}
                className="mt-16 text-center relative z-20"
              >
                <Link
                  to="/domains"
                  className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden bg-slate-950/50 backdrop-blur-md text-cyan-400 font-bold border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-400 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    See More
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 3. EVENTS Timeline & TEAM Preview */}
        <section className="py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Events Timeline */}
            <motion.div variants={fadeInUpVariants}>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/20 rounded-xl"><Calendar className="w-8 h-8 text-blue-400" /></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Events</h2>
              </div>

              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl -z-10" />
                {homeEvents.length > 0 ? (
                  homeEvents.map((event, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUpVariants}
                      whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(30, 41, 59, 0.8)", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 transition-all duration-200 cursor-pointer"
                      onClick={() => window.location.href = '/events'}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-blue-400 font-semibold text-sm">{event.date || new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                          <h4 className="text-lg font-bold text-white mt-2">{event.title}</h4>
                          <p className="text-slate-400 text-sm mt-1">{event.venue || event.category || ''}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))
                ) : isBackendOffline ? (
                  [
                    { date: "25 Mar", title: "Web Dev Bootcamp", venue: "CS Lab 301" },
                    { date: "1 Apr", title: "AI Workshop Series", venue: "Seminar Hall" },
                    { date: "15 Apr", title: "Hackathon Finals", venue: "Main Auditorium" },
                  ].map((event, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUpVariants}
                      whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(30, 41, 59, 0.8)", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 transition-all duration-200 cursor-pointer"
                      onClick={() => window.location.href = '/events'}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-blue-400 font-semibold text-sm">{event.date}</p>
                          <h4 className="text-lg font-bold text-white mt-2">{event.title}</h4>
                          <p className="text-slate-400 text-sm mt-1">{event.venue}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 font-medium bg-slate-950/20 rounded-3xl border border-white/5">
                    No upcoming events scheduled.
                  </div>
                )}
              </motion.div>
              <div className="mt-8 text-center">
                <Link to="/events" className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4">See full calendar</Link>
              </div>
            </motion.div>

            {/* Team Stacked Cards */}
            <motion.div variants={fadeInUpVariants}>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-purple-500/20 rounded-xl"><Users className="w-8 h-8 text-purple-400" /></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">The Forces</h2>
              </div>

              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl -z-10" />
                {[
                  { title: "Managing Team", detail: "Operations & Strategy" },
                  { title: "Technical Team", detail: "Devs & Engineers" },
                  { title: "Designing Team", detail: "UI/UX & Graphics" },
                  { title: "Social Media Team", detail: "Marketing & Growth" },
                  { title: "Shooting & Editing Team", detail: "Media & Video Production" },
                ].map((team, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUpVariants}
                    whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.5)", backgroundColor: "rgba(30, 41, 59, 0.8)", boxShadow: "0 4px 20px rgba(168, 85, 247, 0.15)" }}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-between group transition-all duration-200 cursor-pointer"
                    onClick={() => window.location.href = '/team'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl text-white group-hover:bg-purple-500 transition-colors duration-200">
                        {team.title[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">{team.title}</h4>
                        <p className="text-slate-400 text-sm">{team.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors duration-200" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-8 text-center">
                <Link to="/team" className="text-purple-400 hover:text-purple-300 font-bold underline underline-offset-4">Meet everyone</Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 4. CONTACT SECTION */}
        <section className="py-24 bg-gradient-to-t from-[#0B1121] to-[#0f172a] relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Get In Touch</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have questions or want to collaborate? Reach out to us directly.</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto"
            >
              {[
                { title: 'Email Us', info: 'skillforgeclub123@gmail.com', icon: <Mail className="w-8 h-8 text-cyan-400" /> },
                { title: 'Visit Us', info: "Vignan's Institute of Information Technology, Visakhapatnam", icon: <MapPin className="w-8 h-8 text-blue-400" /> }
              ].map((contact, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUpVariants}
                  whileHover={{ y: -8, borderColor: "rgba(6, 182, 212, 0.5)", backgroundColor: "rgba(15, 23, 42, 0.7)", boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)" }}
                  className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 group cursor-default shadow-xl shadow-black/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 border border-white/5">
                    {contact.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                  <p className="text-cyan-100/70 font-medium">{contact.info}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="text-center"
            >
              <Link
                to="/contact"
                className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden bg-slate-950/50 backdrop-blur-md text-cyan-400 font-bold border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-400 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send a Direct Message
                </span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 5. Action Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUpVariants}
            className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 p-10 md:p-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10"
          >
            {/* Reduced blur background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] -mr-32 -mt-32" style={{ willChange: 'none' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] -ml-32 -mb-32" style={{ willChange: 'none' }} />

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to forge your skills?</h2>
              <p className="text-lg text-cyan-100/70 mb-8 leading-relaxed">
                Whether you want to access the student portal to track your progress, or step up as an admin to manage events. Join the hub today. Got ideas? Drop us your feedback.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to="/login" className="px-8 py-4 rounded-full bg-cyan-50 hover:opacity-80 text-slate-950 font-bold transition-opacity duration-200 flex items-center gap-2">
                  <LogIn className="w-5 h-5" /> Portal Login
                </Link>
                <Link to="/feedback" className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors duration-200 border border-white/10 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Leave Feedback
                </Link>
              </div>
            </div>

            {/* Club Logo */}
            <div className="relative z-10 hidden lg:flex items-center justify-center w-48 h-48 bg-cyan-500/10 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:scale-105 transition-all duration-300">
              <img src={skillForgeLogo} alt="SkillForge Logo" className="w-24 h-24 object-contain opacity-90" />
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
});

Home.displayName = 'Home';
export default Home;






