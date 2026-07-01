import React, { useState, useEffect } from 'react';
import TeamCard from '../components/TeamCard';
import { Loader2, Users, RefreshCw } from 'lucide-react';
import { api } from '../api';

const Team = () => {
  const [team, setTeam]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getTeam();
      if (Array.isArray(data)) {
        setTeam(data);
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

  const sorted = [...team].sort((a, b) => {
    const rank = (r) => {
      const l = r?.toLowerCase() || '';
      if (l === 'president') return 0;
      if (l.includes('vice president')) return 1;
      if (l.includes('president')) return 0;
      if (l.includes('manager')) return 2;
      if (l.includes('design lead') || l.includes('designer')) return 3;
      if (l.includes('technical lead') || l.includes('tech lead')) return 4;
      return 99;
    };
    return rank(a.role) - rank(b.role);
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-400" size={40} />
      <p className="text-slate-400 text-sm">Connecting to server...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <RefreshCw size={28} className="text-red-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Could not load team</h2>
        <p className="text-slate-400 text-sm max-w-sm">The server may be waking up. Please wait a moment and try again.</p>
      </div>
      <button
        onClick={load}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
      >
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Meet The <span className="text-gradient">Team</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The passionate individuals who drive SkillForge forward.
        </p>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Core Team</h2>
        {sorted.length === 0 ? (
          <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-white/5 max-w-lg mx-auto">
            <Users size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No team members listed yet.</p>
            <p className="text-slate-600 text-sm mt-1">Team members will appear here once added by the admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((member) => (
              <TeamCard
                key={member.id}
                name={member.name}
                role={member.role}
                domain={member.department}
                imageUrl={member.avatar}
                linkedin={member.linkedin}
                github={member.github}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;