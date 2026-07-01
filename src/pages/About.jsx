import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Rocket, Trophy, Activity, Users, Star, Award, CheckCircle2, Code2, Target } from 'lucide-react';
import skillForgeLogo from '../assets/logo.png';

const About = () => {
  // Framer Motion Animation Variants
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1121] text-white pt-24 pb-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Dynamic Backgrounds - morphing floating gradient spheres */}
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -25, 30, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[40%] left-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl rotate-12 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] shadow-cyan-500/10"
          >
            <img src={skillForgeLogo} alt="SkillForge Club Logo" className="w-12 h-12 object-contain -rotate-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
          >
            The Story of SkillForge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-400 font-medium tracking-wide mb-8"
          >
             Established by the elite <span className="text-cyan-400 font-bold border-b border-cyan-400/30 pb-1">Data Science Section</span>
          </motion.p>
        </div>

         {/* Genesis Core Section */}
        <section className="mb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainerVariants}
            className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center group hover:border-cyan-500/30 transition-all shadow-[0_12px_45px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
            <motion.div variants={fadeInUpVariants} className="lg:w-1/2 space-y-6 relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-sm border border-cyan-500/20 uppercase tracking-widest">
                Our Origins
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">What is SkillForge?</h2>
               <p className="text-lg text-slate-300 leading-relaxed">
                SkillForge is a student-led technical community designed to bridge the gap between classroom theory and real-world software engineering. We believe that true engineering mastery comes from building, launching, and maintaining actual applications.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Founded by the <span className="text-cyan-400 font-bold">Data Science Section</span>, our mission is to foster a collaborative environment where students write clean code, launch web platforms, and deploy intelligent systems, guided by peer mentors with industry-level experience.
              </p>
            </motion.div>
            <motion.div variants={fadeInUpVariants} className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10 w-full">
              {[
                { label: 'Founded', val: '2026', desc: 'By Data Science Sec.', icon: <Award className="w-6 h-6 text-yellow-400" /> },
                { label: 'Active Mentors', val: '20', desc: '', icon: <Users className="w-6 h-6 text-blue-400" /> },
                { label: 'Domains', val: '6+', desc: 'Modern Stacks', icon: <Code2 className="w-6 h-6 text-purple-400" /> },
                { label: 'Freelancing Skills', val: '', desc: 'Can learn from those who have been doing it', icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" /> }
              ].map((b, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, borderColor: "rgba(6, 182, 212, 0.4)", backgroundColor: "rgba(15, 23, 42, 0.75)", boxShadow: "0 0 25px rgba(6, 182, 212, 0.15)" }}
                  className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-cyan-500/10 cursor-default"
                >
                   <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                   <h4 className="text-3xl font-black text-white mb-1">{b.val}</h4>
                   <span className="text-sm font-bold text-cyan-400 block mb-1">{b.label}</span>
                   <span className="text-xs text-slate-500 font-medium">{b.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default About;
