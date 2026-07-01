import React, { useState, useEffect, useMemo } from 'react';
import TeamCard from '../components/TeamCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const MOCK_TEAM = useMemo(() => [
    {
      id: 1,
      name: "Dr. K. Srinivasa Rao",
      role: "Faculty Advisor",
      department: "Data Science & AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    {
      id: 2,
      name: "Harsh Vardhan",
      role: "Club President",
      department: "Web Development",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    {
      id: 3,
      name: "Ananya Sen",
      role: "Vice President & UI/UX Lead",
      department: "UI/UX Design",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  ], []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getTeam();
        if (Array.isArray(data)) {
          setTeam(data);
          setIsOffline(false);
        } else {
          setTeam(MOCK_TEAM);
          setIsOffline(true);
        }
      } catch (err) {
        console.log(err);
        setTeam(MOCK_TEAM);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [MOCK_TEAM]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-400" size={40} />
    </div>
  );

  const ROLE_ORDER = ['president', 'vice president', 'manager', 'technical lead', 'tech lead', 'design lead', 'designer'];

  const sorted = [...team].sort((a, b) => {
    const role = (r) => {
      const l = r?.toLowerCase() || '';
      if (l === 'president') return 0;
      if (l.includes('vice president')) return 1;
      if (l.includes('president')) return 0;
      if (l.includes('manager')) return 2;
      if (l.includes('design lead') || l.includes('designer')) return 3;
      if (l.includes('technical lead') || l.includes('tech lead')) return 4;
      return 99;
    };
    return role(a.role) - role(b.role);
  });

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

      {isOffline && (
        <div className="max-w-2xl mx-auto mb-10 px-6 py-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-400" />
          <span>
            <strong>Demo Mode:</strong> The frontend cannot connect to the backend server (at <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xs text-white">http://localhost:5000</code>). Showing offline mock team members.
          </span>
        </div>
      )}

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Core Team</h2>
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-950/20 rounded-3xl border border-white/5 max-w-lg mx-auto">
            No team members listed yet.
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