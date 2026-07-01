import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Phone, Rocket, BookOpen, Trophy, Target, Clock, CheckCircle2, MessageSquare, BrainCircuit, Code2, Loader2, User, CalendarCheck, ExternalLink, ChevronRight, Star, Layers, Globe, Database, Brain, Cpu, Shield, Smartphone, BarChart2, Send } from "lucide-react";
import { getTokenFor, getUser, logout } from "../auth";

const BASE = "http://localhost:5000/api";
const authFetch = async (path) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${getTokenFor("student")}` },
  });
  return res.json();
};

// -- Overview ------------------------------------------------------------------
const OverviewView = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch("/student/overview"),
      authFetch("/assignments/my-mentor"),
      authFetch("/student/profile"),
    ]).then(([overview, mentor, profile]) => {
      setData({
        stats:            overview?.stats            ?? { totalProjects: 0, skillsLearned: 0, overallProgress: 0, tasksCompleted: 0 },
        progress:         overview?.progress         ?? [],
        assignments:      overview?.assignments      ?? [],
        registeredEvents: overview?.registeredEvents ?? [],
        activity:         overview?.activity         ?? [],
        assignedMentor:   mentor ?? null,
        profile:          profile?.id ? profile : null,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markDone = async (id) => {
    await fetch(`${BASE}/student/assignments/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getTokenFor("student")}` },
    });
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === id ? { ...a, status: "Completed", type: "done" } : a
      ),
    }));
  };

  if (loading || !data) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;

  const stats = [
    { title: "Registered Events", value: data.stats.totalProjects, icon: <Rocket className="w-6 h-6 text-cyan-400" />, color: "from-cyan-500/20" },
    { title: "Skills Learned",    value: data.stats.skillsLearned, icon: <BookOpen className="w-6 h-6 text-purple-400" />, color: "from-purple-500/20" },
    { title: "Overall Progress",  value: data.stats.overallProgress, icon: <Target className="w-6 h-6 text-blue-400" />, color: "from-blue-500/20" },
    { title: "Tasks Completed",   value: data.stats.tasksCompleted, icon: <Trophy className="w-6 h-6 text-yellow-400" />, color: "from-yellow-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-slate-900/50 border border-white/10 rounded-2xl p-6 bg-gradient-to-br ${stat.color} to-transparent hover:border-white/20 transition-all group`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Assignments */}
          <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Assigned Tasks</h3>
            <div className="space-y-4">
              {data.assignments.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/80 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    {task.type === "done" ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Clock className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-semibold text-white">{task.title}</h4>
                      <p className="text-sm text-slate-400">Deadline: <span className={task.type === "urgent" ? "text-rose-400 font-bold" : ""}>{task.deadline}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${task.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                      {task.status}
                    </span>
                    {task.status !== "Completed" && (
                      <button onClick={() => markDone(task.id)} className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-900 transition-all">
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Domains */}
          <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">My Domains</h3>
            <div className="flex flex-wrap gap-2">
              {(data.profile?.domain_interest || "").split(",").map((d) => d.trim()).filter(Boolean).map((domain) => (
                <span key={domain} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> {domain}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Mentor */}
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-4">Assigned Mentor</h3>
            {data.assignedMentor ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white border-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  {data.assignedMentor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{data.assignedMentor.name}</h4>
                  <p className="text-sm text-cyan-400 font-medium">{data.assignedMentor.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Assigned {new Date(data.assignedMentor.assignedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No mentor assigned yet. Contact your admin.</p>
            )}
          </div>

          {/* Registered Events */}
          <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">My Events</h3>
            {data.registeredEvents.length === 0 ? (
              <p className="text-slate-500 text-sm">No events registered yet. <a href="/events" className="text-cyan-400 hover:underline">Browse events ?</a></p>
            ) : (
              <div className="space-y-3">
                {data.registeredEvents.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                    <CalendarCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">{e.eventTitle}</p>
                      <p className="text-slate-500 text-xs">{new Date(e.registeredAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {data.activity.map((act, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-4 border-[#1e293b] ${act.dot} z-10`} />
                  <p className="text-sm font-bold text-white">{act.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.desc}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -- Profile -------------------------------------------------------------------
// -- Profile -------------------------------------------------------------------
const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", domains: [] });
  const [saveStatus, setSaveStatus] = useState("");

  const AVAILABLE_DOMAINS = [
    "Web Development",
    "Data Science",
    "AI/ML",
    "Cybersecurity",
    "App Development",
    "Cloud Computing"
  ];

  const fetchProfile = useCallback(() => {
    authFetch("/student/profile")
      .then((d) => {
        setProfile(d?.id ? d : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;
  if (!profile) return <div className="text-center text-slate-400 py-20">Could not load profile. Please try again.</div>;

  const initials = profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "??";
  const domainList = (profile.domain_interest || "").split(",").map((d) => d.trim()).filter(Boolean);

  const startEdit = () => {
    setEditForm({
      name: profile.name,
      domains: [...domainList]
    });
    setSaveStatus("");
    setIsEditing(true);
  };

  const toggleDomain = (d) => {
    setEditForm((prev) => {
      const exists = prev.domains.includes(d);
      if (exists) {
        return { ...prev, domains: prev.domains.filter((item) => item !== d) };
      } else {
        return { ...prev, domains: [...prev.domains, d] };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus("loading");
    try {
      const res = await fetch(`${BASE}/student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTokenFor("student")}`
        },
        body: JSON.stringify({
          name: editForm.name,
          domain_interest: editForm.domains.join(", ")
        })
      });
      if (!res.ok) throw new Error();
      
      const updated = await authFetch("/student/profile");
      setProfile(updated);
      setSaveStatus("success");
      setIsEditing(false);
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {!isEditing ? (
        <div className="bg-[#1c2536]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.3)] font-black text-5xl text-white">
              {initials}
            </div>
            <div className="text-center md:text-left w-full space-y-4">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold border bg-cyan-500/10 text-cyan-400 border-cyan-500/20 uppercase tracking-wider">
                  {profile.role} Member
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-1">{profile.name}</h2>
                <p className="text-slate-400 font-medium text-sm">{profile.email}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {[
                  { label: "My Domains", value: domainList.length, color: "text-cyan-400" },
                  { label: "Registered Events", value: profile.totalProjects, color: "text-purple-400" },
                  { label: "Year Level", value: "Sophomore", color: "text-white" },
                  { label: "Joined Year", value: new Date(profile.created_at || profile.createdAt).getFullYear(), color: "text-yellow-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center min-h-[85px] overflow-hidden">
                    <span className={`block font-black ${color} mb-0.5 leading-none text-center ${
                      typeof value === "string" && value.length > 7
                        ? "text-xs sm:text-sm md:text-base"
                        : "text-lg sm:text-2xl"
                    }`}>
                      {value}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center leading-normal mt-1">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 relative z-10 space-y-6">
            <h3 className="text-xl font-bold text-white">Student Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Display Name</span>
                <p className="text-white text-base font-semibold">{profile.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Address</span>
                <p className="text-white text-base font-semibold">{profile.email}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Domains Subscribed</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {domainList.length === 0 ? (
                    <p className="text-slate-400 text-sm">No domains selected</p>
                  ) : domainList.map((d) => (
                    <span key={d} className="px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-xs font-bold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={startEdit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-cyan-500/20"
              >
                Edit Profile Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#1c2536]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div>
            <h2 className="text-3xl font-black text-white">Modify Profile Details</h2>
            <p className="text-slate-400 text-sm mt-1">Update your display information and select the technology pathways you are learning.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">Display Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-white">Domains of Interest</label>
              <div className="flex flex-wrap gap-2.5">
                {AVAILABLE_DOMAINS.map((d) => {
                  const isSelected = editForm.domains.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDomain(d)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-slate-900/40 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex items-center justify-between gap-4">
            {saveStatus === "error" && (
              <p className="text-rose-400 text-sm font-bold">Failed to update details. Try again.</p>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-transparent text-slate-400 hover:text-white hover:border-white/20 transition-all font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveStatus === "loading"}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
              >
                {saveStatus === "loading" ? "Saving..." : "Save Details"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// -- Assignments ---------------------------------------------------------------
const AssignmentsView = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/student/assignments").then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const markDone = async (id) => {
    await fetch(`${BASE}/student/assignments/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getTokenFor("student")}` },
    });
    setData((prev) => prev.map((a) => a.id === id ? { ...a, status: "Completed", type: "done" } : a));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;

  const pending   = data.filter((a) => a.status !== "Completed");
  const completed = data.filter((a) => a.status === "Completed");

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-white border-b border-white/10 pb-4">Assignments</h2>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-amber-400">Pending ({pending.length})</h3>
        {pending.length === 0 && <p className="text-slate-500">All caught up! ??</p>}
        {pending.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/80 transition-colors">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white">{task.title}</h4>
                <p className="text-sm text-slate-400">Deadline: <span className={task.type === "urgent" ? "text-rose-400 font-bold" : ""}>{task.deadline}</span> � {task.domain}</p>
              </div>
            </div>
            <button onClick={() => markDone(task.id)} className="px-4 py-2 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-900 transition-all">
              Mark Done
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-emerald-400">Completed ({completed.length})</h3>
        {completed.map((task) => (
          <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/30 border border-white/5 opacity-70">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white line-through">{task.title}</h4>
              <p className="text-sm text-slate-500">{task.domain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -- Mentor View ---------------------------------------------------------------
const MentorView = () => {
  const [mentor, setMentor]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/assignments/my-mentor").then((d) => {
      setMentor(d && d.id ? d : null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black text-white border-b border-white/10 pb-4">My Mentor</h2>
      {mentor ? (
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-[2rem] p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-4xl font-black text-white border-4 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.4)] flex-shrink-0">
              {mentor.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-black text-white">{mentor.name}</h3>
              <p className="text-cyan-400 font-semibold mt-1">{mentor.email}</p>
              <p className="text-slate-500 text-sm mt-1">Assigned on {new Date(mentor.assignedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Role",   value: mentor.role ?? "Mentor",                                                                    color: "text-cyan-400" },
              { label: "Status", value: "Active",                                                                                   color: "text-emerald-400" },
              { label: "Since",  value: mentor.created_at ? new Date(mentor.created_at).getFullYear() : new Date(mentor.assignedAt).getFullYear(), color: "text-white" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center">
                <span className={"block text-2xl font-black mb-1 " + color}>{value}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">Your mentor is here to guide your learning journey. Reach out for feedback or to schedule a session using the channels below:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Email Button */}
              <a
                href={`mailto:${mentor.email}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-950/80 transition-all group text-center"
              >
                <Mail className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Email</span>
                <span className="text-white text-xs font-semibold mt-1 truncate max-w-full">{mentor.email}</span>
              </a>

              {/* Phone Button */}
              <a
                href="tel:+919876543210"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-950/80 transition-all group text-center"
              >
                <Phone className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Phone</span>
                <span className="text-white text-xs font-semibold mt-1">+91 98765 43210</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919876543210?text=Hi%20Mentor!%20I'm%20a%20student%20from%20SkillForge."
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-green-400/30 hover:bg-slate-950/80 transition-all group text-center"
              >
                <MessageSquare className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">WhatsApp</span>
                <span className="text-white text-xs font-semibold mt-1">Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-12 shadow-xl text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <BrainCircuit className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">No Mentor Assigned Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Your admin will assign a mentor to you soon.</p>
        </div>
      )}
    </div>
  );
};

// -- Domains ------------------------------------------------------------------
const DOMAIN_DATA = {
  "Web Development": {
    icon: <Globe className="w-8 h-8" />,
    color: "cyan",
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    description: "Build modern, responsive web applications using the latest frontend and backend technologies.",
    roadmap: [
      { phase: "Phase 1", title: "HTML & CSS Fundamentals", topics: ["Semantic HTML5", "CSS Flexbox & Grid", "Responsive Design", "CSS Variables"] },
      { phase: "Phase 2", title: "JavaScript Essentials", topics: ["ES6+ Syntax", "DOM Manipulation", "Fetch API", "Async/Await"] },
      { phase: "Phase 3", title: "React & Frontend", topics: ["React Hooks", "State Management", "React Router", "Tailwind CSS"] },
      { phase: "Phase 4", title: "Backend & Databases", topics: ["Node.js & Express", "REST APIs", "PostgreSQL", "Authentication"] },
    ],
    resources: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "Docs" },
      { name: "React Official Docs", url: "https://react.dev", type: "Docs" },
      { name: "The Odin Project", url: "https://www.theodinproject.com", type: "Course" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", type: "Course" },
      { name: "CSS Tricks", url: "https://css-tricks.com", type: "Blog" },
    ],
    tools: ["VS Code", "Git & GitHub", "Chrome DevTools", "Postman", "Figma"],
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL", "REST APIs"],
  },
  "Data Science": {
    icon: <BarChart2 className="w-8 h-8" />,
    color: "purple",
    gradient: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
    description: "Analyze data, build predictive models, and extract meaningful insights using Python and ML tools.",
    roadmap: [
      { phase: "Phase 1", title: "Python & Statistics", topics: ["Python Basics", "NumPy & Pandas", "Descriptive Statistics", "Probability"] },
      { phase: "Phase 2", title: "Data Analysis & Viz", topics: ["Matplotlib & Seaborn", "EDA Techniques", "Data Cleaning", "Plotly"] },
      { phase: "Phase 3", title: "Machine Learning", topics: ["Scikit-learn", "Regression & Classification", "Model Evaluation", "Feature Engineering"] },
      { phase: "Phase 4", title: "Advanced Topics", topics: ["Deep Learning Basics", "NLP Intro", "SQL for Data", "Deployment"] },
    ],
    resources: [
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "Course" },
      { name: "Towards Data Science", url: "https://towardsdatascience.com", type: "Blog" },
      { name: "fast.ai", url: "https://www.fast.ai", type: "Course" },
      { name: "Scikit-learn Docs", url: "https://scikit-learn.org", type: "Docs" },
      { name: "StatQuest YouTube", url: "https://www.youtube.com/@statquest", type: "Video" },
    ],
    tools: ["Python", "Jupyter Notebook", "Pandas", "Scikit-learn", "Tableau"],
    skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL", "EDA"],
  },
  "AI/ML": {
    icon: <Brain className="w-8 h-8" />,
    color: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    description: "Design and train intelligent systems using deep learning, neural networks, and modern AI frameworks.",
    roadmap: [
      { phase: "Phase 1", title: "Math & Python", topics: ["Linear Algebra", "Calculus", "Python for ML", "NumPy"] },
      { phase: "Phase 2", title: "ML Fundamentals", topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Scikit-learn"] },
      { phase: "Phase 3", title: "Deep Learning", topics: ["Neural Networks", "CNNs", "RNNs", "PyTorch / TensorFlow"] },
      { phase: "Phase 4", title: "Specialization", topics: ["NLP & Transformers", "Computer Vision", "Reinforcement Learning", "MLOps"] },
    ],
    resources: [
      { name: "fast.ai", url: "https://www.fast.ai", type: "Course" },
      { name: "DeepLearning.AI", url: "https://www.deeplearning.ai", type: "Course" },
      { name: "Papers With Code", url: "https://paperswithcode.com", type: "Research" },
      { name: "Hugging Face", url: "https://huggingface.co", type: "Docs" },
      { name: "3Blue1Brown", url: "https://www.youtube.com/@3blue1brown", type: "Video" },
    ],
    tools: ["Python", "PyTorch", "TensorFlow", "Jupyter", "Google Colab"],
    skills: ["Python", "Deep Learning", "NLP", "Computer Vision", "PyTorch", "MLOps"],
  },
  "Cybersecurity": {
    icon: <Shield className="w-8 h-8" />,
    color: "rose",
    gradient: "from-rose-500/20 to-orange-500/10",
    border: "border-rose-500/30",
    description: "Protect systems and networks by learning ethical hacking, penetration testing, and security best practices.",
    roadmap: [
      { phase: "Phase 1", title: "Networking Basics", topics: ["TCP/IP", "DNS & HTTP", "Linux Fundamentals", "Wireshark"] },
      { phase: "Phase 2", title: "Security Concepts", topics: ["CIA Triad", "Cryptography", "Authentication", "OWASP Top 10"] },
      { phase: "Phase 3", title: "Ethical Hacking", topics: ["Kali Linux", "Nmap & Metasploit", "Web App Pentesting", "CTF Challenges"] },
      { phase: "Phase 4", title: "Advanced Defense", topics: ["SOC Operations", "Incident Response", "Cloud Security", "Certifications"] },
    ],
    resources: [
      { name: "TryHackMe", url: "https://tryhackme.com", type: "Platform" },
      { name: "HackTheBox", url: "https://www.hackthebox.com", type: "Platform" },
      { name: "OWASP", url: "https://owasp.org", type: "Docs" },
      { name: "Cybrary", url: "https://www.cybrary.it", type: "Course" },
      { name: "PortSwigger Web Academy", url: "https://portswigger.net/web-security", type: "Course" },
    ],
    tools: ["Kali Linux", "Burp Suite", "Nmap", "Wireshark", "Metasploit"],
    skills: ["Networking", "Linux", "Penetration Testing", "Cryptography", "OWASP", "CTF"],
  },
  "App Development": {
    icon: <Smartphone className="w-8 h-8" />,
    color: "blue",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    description: "Build cross-platform mobile applications for iOS and Android using React Native or Flutter.",
    roadmap: [
      { phase: "Phase 1", title: "Mobile Fundamentals", topics: ["UI/UX for Mobile", "JavaScript/Dart", "Component Design", "Navigation"] },
      { phase: "Phase 2", title: "React Native / Flutter", topics: ["Core Components", "State Management", "APIs & Networking", "Local Storage"] },
      { phase: "Phase 3", title: "Native Features", topics: ["Camera & GPS", "Push Notifications", "Authentication", "Offline Support"] },
      { phase: "Phase 4", title: "Publishing", topics: ["App Store / Play Store", "CI/CD", "Analytics", "Performance"] },
    ],
    resources: [
      { name: "React Native Docs", url: "https://reactnative.dev", type: "Docs" },
      { name: "Flutter Docs", url: "https://flutter.dev", type: "Docs" },
      { name: "Expo", url: "https://expo.dev", type: "Tool" },
      { name: "App Brewery", url: "https://www.appbrewery.co", type: "Course" },
      { name: "Flutter & Dart - Udemy", url: "https://www.udemy.com", type: "Course" },
    ],
    tools: ["VS Code", "Android Studio", "Xcode", "Expo", "Firebase"],
    skills: ["React Native", "Flutter", "Dart", "Firebase", "REST APIs", "UI/UX"],
  },
  "Cloud Computing": {
    icon: <Layers className="w-8 h-8" />,
    color: "yellow",
    gradient: "from-yellow-500/20 to-orange-500/10",
    border: "border-yellow-500/30",
    description: "Deploy, manage, and scale applications on cloud platforms like AWS, Azure, and Google Cloud.",
    roadmap: [
      { phase: "Phase 1", title: "Cloud Basics", topics: ["Cloud Models (IaaS/PaaS/SaaS)", "Virtualization", "Linux CLI", "Networking"] },
      { phase: "Phase 2", title: "AWS / Azure Core", topics: ["EC2 & S3", "IAM & Security", "VPC & Networking", "RDS & Databases"] },
      { phase: "Phase 3", title: "DevOps & Containers", topics: ["Docker", "Kubernetes", "CI/CD Pipelines", "Terraform"] },
      { phase: "Phase 4", title: "Certifications", topics: ["AWS Solutions Architect", "Azure Administrator", "GCP Associate", "DevOps Engineer"] },
    ],
    resources: [
      { name: "AWS Free Tier", url: "https://aws.amazon.com/free", type: "Platform" },
      { name: "A Cloud Guru", url: "https://acloudguru.com", type: "Course" },
      { name: "Google Cloud Skills Boost", url: "https://cloudskillsboost.google", type: "Course" },
      { name: "KodeKloud", url: "https://kodekloud.com", type: "Course" },
      { name: "TechWorld with Nana", url: "https://www.youtube.com/@TechWorldwithNana", type: "Video" },
    ],
    tools: ["AWS CLI", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    skills: ["AWS/Azure/GCP", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
  },
};

const DEFAULT_DOMAIN = {
  icon: <Code2 className="w-8 h-8" />,
  color: "cyan",
  gradient: "from-cyan-500/20 to-blue-500/10",
  border: "border-cyan-500/30",
  description: "Explore your chosen domain and build expertise through structured learning and hands-on projects.",
  roadmap: [
    { phase: "Phase 1", title: "Fundamentals", topics: ["Core Concepts", "Basic Tools", "Best Practices", "First Project"] },
    { phase: "Phase 2", title: "Intermediate", topics: ["Advanced Topics", "Real Projects", "Community", "Open Source"] },
  ],
  resources: [
    { name: "freeCodeCamp", url: "https://www.freecodecamp.org", type: "Course" },
    { name: "Coursera", url: "https://www.coursera.org", type: "Course" },
    { name: "YouTube", url: "https://www.youtube.com", type: "Video" },
  ],
  tools: ["VS Code", "Git", "GitHub"],
  skills: ["Problem Solving", "Version Control", "Documentation"],
};

const TYPE_COLORS = {
  Docs: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Course: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Blog: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Video: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Platform: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Research: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Tool: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const DomainsView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    authFetch("/student/profile").then((d) => { setProfile(d?.id ? d : null); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;

  // Support multiple comma-separated domains
  const rawDomains = profile?.domain_interest?.trim() || "";
  const domainList = rawDomains ? rawDomains.split(",").map((d) => d.trim()).filter(Boolean) : [];

  if (domainList.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
        <Code2 className="w-10 h-10 text-slate-400" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">No Domain Selected</h2>
        <p className="text-slate-400 text-sm max-w-sm">Your domain interest hasn't been set yet. Please complete your profile or contact your admin.</p>
      </div>
      <a href="/onboarding" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all text-sm">
        Complete Profile
      </a>
    </div>
  );

  const colorMap = {
    cyan:    { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",     text: "text-cyan-400",    dot: "bg-cyan-500",    tab: "border-cyan-400 text-cyan-400 bg-cyan-400/5" },
    purple:  { badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", text: "text-purple-400",  dot: "bg-purple-500",  tab: "border-purple-400 text-purple-400 bg-purple-400/5" },
    emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500", tab: "border-emerald-400 text-emerald-400 bg-emerald-400/5" },
    rose:    { badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",       text: "text-rose-400",    dot: "bg-rose-500",    tab: "border-rose-400 text-rose-400 bg-rose-400/5" },
    blue:    { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",       text: "text-blue-400",    dot: "bg-blue-500",    tab: "border-blue-400 text-blue-400 bg-blue-400/5" },
    yellow:  { badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", text: "text-yellow-400",  dot: "bg-yellow-500",  tab: "border-yellow-400 text-yellow-400 bg-yellow-400/5" },
  };

  const currentDomain = domainList[activeTab];
  const domain = DOMAIN_DATA[currentDomain] ?? {
    ...DEFAULT_DOMAIN,
    description: `You are studying ${currentDomain}. Explore the roadmap and resources below.`,
  };
  const c = colorMap[domain.color] ?? colorMap.cyan;

  return (
    <div className="space-y-6">

      {/* Domain tabs — only show if multiple */}
      {domainList.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {domainList.map((d, idx) => {
            const dm = DOMAIN_DATA[d] ?? DEFAULT_DOMAIN;
            const cm = colorMap[dm.color] ?? colorMap.cyan;
            return (
              <button key={d} onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  activeTab === idx ? cm.tab : "bg-slate-800 text-slate-400 border-white/10 hover:text-white"
                }`}>
                {d}
              </button>
            );
          })}
        </div>
      )}

      {/* Header banner */}
      <div className={`bg-gradient-to-br ${domain.gradient} border ${domain.border} rounded-3xl p-8`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl ${c.badge} border flex items-center justify-center flex-shrink-0 ${c.text}`}>
            {domain.icon}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-white">{currentDomain}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.badge}`}>Your Domain</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">{domain.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Phases",    value: domain.roadmap.length },
            { label: "Skills",    value: domain.skills.length },
            { label: "Resources", value: domain.resources.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-black/20 rounded-2xl p-4 text-center border border-white/10">
              <p className={`text-2xl font-black ${c.text}`}>{value}</p>
              <p className="text-slate-400 text-xs font-semibold mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className={`w-2 h-6 rounded-full ${c.dot}`} /> Learning Roadmap
          </h3>
          <div className="space-y-4">
            {domain.roadmap.map((phase, idx) => (
              <div key={idx} className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`w-9 h-9 rounded-full ${c.dot} flex items-center justify-center text-sm font-black text-white flex-shrink-0`}>{idx + 1}</span>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-0.5`}>{phase.phase}</p>
                    <h4 className="text-white font-bold text-lg leading-tight">{phase.title}</h4>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.topics.map((topic) => (
                    <span key={topic} className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 text-xs font-semibold hover:border-white/20 transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1c2536]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> Key Skills
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {domain.skills.map((skill) => (
                <span key={skill} className={`px-4.5 py-2.5 rounded-xl text-sm font-bold border ${c.badge} shadow-sm shadow-black/20 hover:scale-105 transition-transform duration-200 cursor-default`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#1c2536]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-400" /> Tools & Tech
            </h3>
            <div className="space-y-1">
              {domain.tools.map((tool) => (
                <div key={tool} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-xl transition-colors duration-200">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot} shadow-sm`} />
                  <span className="text-slate-100 text-base font-semibold">{tool}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Learning Resources (Full Width Grid Below) */}
      <div className="bg-[#1c2536]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" /> Learning Resources
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {domain.resources.map((r) => {
            const badgeColor = TYPE_COLORS[r.type] ?? TYPE_COLORS.Docs;
            return (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col justify-between gap-4 p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/90 border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                    {r.type}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <span className="text-white text-base font-bold tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                  {r.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// -- Fallback ------------------------------------------------------------------
const FallbackView = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-28 h-28 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl">
      <Code2 className="w-12 h-12 text-slate-400" />
    </div>
    <h2 className="text-4xl font-black text-white mb-4">{title}</h2>
    <span className="px-4 py-1.5 text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">Coming Soon</span>
  </div>
);

// -- Main ----------------------------------------------------------------------
const StudentPortal = () => {
  const location = useLocation();
  const path     = location.pathname;

  const renderContent = () => {
    if (path.endsWith("/profile"))     return <ProfileView />;
    if (path.endsWith("/progress"))    return <ProgressView />;
    if (path.endsWith("/assignments")) return <AssignmentsView />;
    if (path.endsWith("/domains"))     return <DomainsView />;
    if (path.endsWith("/mentor"))      return <MentorView />;
    return <OverviewView />;
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default StudentPortal;







