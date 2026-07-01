import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Share2, Github, Linkedin, Instagram, Youtube, Facebook } from 'lucide-react';
import { api } from '../api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1121] text-white pt-24 pb-16 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Dynamic Backgrounds - morphing floating gradient spheres */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"
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
        className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question or want to collaborate? Drop us a message and we'll get back to you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-start gap-4 shadow-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/30">
                <MapPin className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                <p className="text-gray-400">Vignan's Institute of Information Technology (VIIT),<br/>Beside VSEZ, Duvvada, Visakhapatnam,<br/>Andhra Pradesh 530049</p>
              </div>
            </div>
            
            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-start gap-4 shadow-xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0 border border-purple-500/30">
                <Mail className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                <p className="text-gray-400">skillforgeclub123@gmail.com</p>
              </div>
            </div>

            {/* Social Accounts Card */}
            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-start gap-4 shadow-xl">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center shrink-0 border border-cyan-500/30">
                <Share2 className="text-cyan-400" />
              </div>
              <div className="w-full">
                <h3 className="text-xl font-bold text-white mb-3">Connect With Us</h3>
                <div className="flex flex-wrap gap-3">
                  <a href="https://linkedin.com/company/skillforge-viit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all duration-200">
                    <Linkedin className="w-4 h-4 text-blue-400" /> LinkedIn
                  </a>
                  <a href="https://youtube.com/@skillforge_viit?si=CNGftmeEVKPEv-AY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all duration-200">
                    <Youtube className="w-4 h-4 text-red-500" /> YouTube
                  </a>
                  <a href="https://www.facebook.com/share/1AT2CbvTYd/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all duration-200">
                    <Facebook className="w-4 h-4 text-blue-500" /> Facebook
                  </a>
                  <a href="https://www.instagram.com/skillforge_club?igsh=MWF0a2FieXF3M2g2eQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all duration-200">
                    <Instagram className="w-4 h-4 text-pink-400" /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-950/45 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-white font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subject"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
              {status && status !== 'loading' && (
                <p className={`text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {status === 'success' ? 'Message sent successfully!' : 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;