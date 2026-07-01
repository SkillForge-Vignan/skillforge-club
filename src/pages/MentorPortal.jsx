import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Users, UserCheck, FileText, TrendingUp, Search, Plus, Loader2, Trash2, Check, Send, MessageSquare } from "lucide-react";
import { getTokenFor } from "../auth";

const BASE = "http://localhost:5000/api";
const authFetch = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getTokenFor("mentor")}`, ...opts.headers },
  });
  return res.json();
};

// -- Overview ------------------------------------------------------------------
const OverviewView = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/mentor/overview").then((d) => { setData(d?.stats ? d : null); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;
  if (!data)   return <div className="text-center text-slate-400 py-20">Could not load overview. Please try again.</div>;

  const stats = [
    { title: "Total Students",  value: data.stats.totalStudents,  icon: <Users className="w-6 h-6 text-blue-400" />,       color: "from-blue-500/20" },
    { title: "Active Students", value: data.stats.activeStudents, icon: <UserCheck className="w-6 h-6 text-emerald-400" />, color: "from-emerald-500/20" },
    { title: "Tasks Assigned",  value: data.stats.tasksAssigned,  icon: <FileText className="w-6 h-6 text-purple-400" />,   color: "from-purple-500/20" },
    { title: "Avg Performance", value: data.stats.avgPerformance, icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,   color: "from-cyan-500/20" },
  ];

  return (
    <div className="space-y-6">
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

      <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Recent Tasks</h3>
        <div className="space-y-3">
          {(data.tasks || []).slice(0, 4).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <div>
                <p className="font-semibold text-white">{task.title}</p>
                <p className="text-xs text-slate-400 mt-1">Deadline: {task.deadline} · {task.domain}</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {task.assigned_to === "all" ? "All Students" : "Specific Student"}
              </span>
            </div>
          ))}
          {(data.tasks || []).length === 0 && <p className="text-slate-500 text-sm">No tasks assigned yet.</p>}
        </div>
      </div>
    </div>
  );
};

// -- Students ------------------------------------------------------------------
const StudentsView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    authFetch("/mentor/students").then((d) => { setStudents(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpanded = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl min-h-[70vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black text-white">My Students Roster</h2>
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search students..."
            className="bg-slate-900 border border-white/10 text-sm rounded-full pl-12 pr-4 py-3 text-white outline-none focus:border-cyan-500 w-full sm:w-72 transition-colors" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          {students.length === 0 ? "No students assigned yet." : "No students match your search."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="pb-4 font-semibold pl-4">Student</th>
                <th className="pb-4 font-semibold">Domain</th>
                <th className="pb-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((s) => (
                <React.Fragment key={s.id}>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => toggleExpanded(s.id)}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </button>
                        <div>
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1.5 rounded-md bg-slate-800 text-xs font-bold border border-white/5 text-slate-300">{s.domain || "General"}</span>
                    </td>
                    <td className="py-4 text-right text-slate-400 text-xs whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                  {expanded[s.id] && (s.tasks || []).length > 0 && (
                    <tr className="bg-slate-950/20 border-b border-white/5">
                      <td colSpan="4" className="px-6 py-4">
                        <div className="space-y-3">
                          {(s.tasks || []).map((task) => (
                            <div key={task.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-white/10">
                              <div>
                                <p className="font-semibold text-white">{task.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{task.domain} · Deadline: {task.deadline}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "Completed" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-amber-500/10 text-amber-300 border border-amber-500/20"}`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// -- Assign Tasks --------------------------------------------------------------
const AssignTasksView = () => {
  const [tasks, setTasks]       = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [form, setForm]         = useState({ title: "", description: "", assignedTo: "all", deadline: "", domain: "Web Dev" });

  useEffect(() => {
    Promise.all([authFetch("/mentor/tasks"), authFetch("/mentor/students")])
      .then(([t, s]) => { setTasks(Array.isArray(t) ? t : []); setStudents(Array.isArray(s) ? s : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await authFetch("/mentor/tasks", { method: "POST", body: JSON.stringify(form) });
    if (res.task) {
      setTasks((prev) => [...prev, res.task]);
      setForm({ title: "", description: "", assignedTo: "all", deadline: "", domain: "Web Dev" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await authFetch(`/mentor/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getAssignedLabel = (assignedTo) => {
    if (assignedTo === "all") return "All Students";
    const s = students.find((s) => s.id === assignedTo);
    return s ? s.name : "Specific Student";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-purple-900/30 to-[#1e293b] border border-purple-500/20 rounded-[2rem] p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
          <Plus className="w-8 h-8 text-purple-400" /> Assign New Task
        </h2>
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 font-bold text-sm">
            <Check className="w-4 h-4" /> Task assigned successfully!
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {[["title", "Task Title", "text", "e.g. Deploy React App to Vercel"],
            ["deadline", "Deadline", "date", ""],
            ["domain", "Domain", "text", "e.g. Web Dev, AI/ML"]].map(([key, label, type, placeholder]) => (
            <div key={key}>
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block">{label}</label>
              <input required={["title", "deadline"].includes(key)} type={type} placeholder={placeholder}
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-purple-500 transition-all" />
            </div>
          ))}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide precise instructions..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-purple-500 transition-all resize-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block">Assign To</label>
            <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:border-purple-500 transition-all">
              <option value="all">All Students</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.email}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-lg rounded-xl transition-all flex justify-center items-center gap-3">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <><Plus className="w-5 h-5" /> Assign Task</>}
          </button>
        </form>
      </div>

      <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">All Assigned Tasks ({tasks.length})</h3>
        {loading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin text-cyan-400" /></div>
        ) : tasks.length === 0 ? (
          <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/50 transition-colors gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{task.title}</p>
                  <p className="text-xs text-slate-400 mt-1">Deadline: {task.deadline} · {task.domain}</p>
                  <span className="text-xs text-purple-400 font-bold">→ {getAssignedLabel(task.assigned_to)}</span>
                </div>
                <button onClick={() => handleDelete(task.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -- Profile -------------------------------------------------------------------
const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/mentor/profile").then((d) => { setProfile(d?.id ? d : null); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-cyan-400 w-8 h-8" /></div>;
  if (!profile) return <div className="text-center text-slate-400 py-20">Could not load profile. Please try again.</div>;

  const initials = profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "??";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#1e293b]/80 border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-emerald-500 shadow-[0_0_40px_rgba(52,211,153,0.4)] font-black text-6xl text-white relative z-10">
          {initials}
        </div>
        <div className="text-center md:text-left relative z-10 w-full">
          <h2 className="text-5xl font-black text-white mb-2">{profile.name}</h2>
          <p className="text-xl text-emerald-400 font-medium mb-2 uppercase tracking-widest">Mentor</p>
          <p className="text-slate-400 mb-8">{profile.email}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Students", value: profile.totalStudents, color: "text-white" },
              { label: "Tasks",    value: profile.tasksAssigned, color: "text-purple-400" },
              { label: "Since",    value: new Date(profile.created_at).getFullYear(), color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-center hover:bg-slate-800 transition-colors">
                <span className={`block text-3xl font-black ${color} mb-1`}>{value}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -- Messages -----------------------------------------------------------------
const MessagesView = () => {
  const [students, setStudents]               = useState([]);
  const [unread, setUnread]                   = useState({});
  const [selected, setSelected]               = useState(null);
  const [messages, setMessages]               = useState([]);
  const [text, setText]                       = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingMsgs, setLoadingMsgs]         = useState(false);
  const [sending, setSending]                 = useState(false);
  const [search, setSearch]                   = useState("");
  const bottomRef                             = useRef(null);

  useEffect(() => {
    Promise.all([authFetch("/mentor/students"), authFetch("/messages/unread-counts")])
      .then(([s, u]) => { setStudents(Array.isArray(s) ? s : []); setUnread(u && typeof u === "object" ? u : {}); setLoadingStudents(false); })
      .catch(() => setLoadingStudents(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingMsgs(true);
    authFetch(`/messages/${selected.id}`).then((msgs) => {
      setMessages(Array.isArray(msgs) ? msgs : []);
      setUnread((prev) => ({ ...prev, [selected.id]: 0 }));
      setLoadingMsgs(false);
    });
  }, [selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(() => {
      authFetch(`/messages/${selected.id}`).then((msgs) => { if (Array.isArray(msgs)) setMessages(msgs); });
    }, 5000);
    return () => clearInterval(interval);
  }, [selected]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected || sending) return;
    setSending(true);
    const res = await authFetch(`/messages/${selected.id}`, { method: "POST", body: JSON.stringify({ content: text.trim() }) });
    if (res.message) { setMessages((prev) => [...prev, res.message]); setText(""); }
    setSending(false);
  };

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const fmt = (iso) => {
    const d = new Date(iso), now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="w-80 flex-shrink-0 bg-[#1e293b] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" /> Messages
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..."
              className="w-full bg-slate-900 border border-white/10 text-sm rounded-full pl-9 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingStudents ? (
            <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin text-cyan-400 w-6 h-6" /></div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">{students.length === 0 ? "No students assigned yet." : "No results."}</div>
          ) : filteredStudents.map((s) => {
            const unreadCount = unread[s.id] || 0;
            const isActive = selected?.id === s.id;
            const lastMsg = messages[messages.length - 1];
            return (
              <button key={s.id} onClick={() => setSelected(s)}
                className={`w-full flex items-center gap-3 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left ${isActive ? "bg-cyan-500/10 border-l-2 border-l-cyan-400" : ""}`}>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 relative">
                  {s.name.charAt(0).toUpperCase()}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-[10px] font-black text-slate-950 flex items-center justify-center">{unreadCount}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold text-sm truncate ${unreadCount > 0 ? "text-white" : "text-slate-300"}`}>{s.name}</p>
                    {isActive && lastMsg && <span className="text-[10px] text-slate-500 flex-shrink-0 ml-1">{fmt(lastMsg.created_at)}</span>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{s.domain || s.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-slate-500" />
            </div>
            <p className="text-slate-400 font-semibold">Select a student to start messaging</p>
            <p className="text-slate-600 text-sm">Your conversations will appear here</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#1e293b]/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white">{selected.name}</p>
                <p className="text-xs text-slate-500">{selected.email}</p>
              </div>
              <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">{selected.domain || "Student"}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin text-cyan-400 w-6 h-6" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-700" />
                  <p className="text-slate-500 text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : messages.map((msg) => {
                const isMine = msg.sender_role === "mentor";
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-cyan-500 text-slate-950 rounded-br-sm" : "bg-[#1e293b] border border-white/10 text-white rounded-bl-sm"}`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMine ? "text-slate-800" : "text-slate-500"}`}>
                        {fmt(msg.created_at)}{isMine && <span className="ml-1">{msg.is_read ? " ✓✓" : " ✓"}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-white/5 bg-[#1e293b]/60">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${selected.name}...`}
                className="flex-1 bg-slate-900 border border-white/10 rounded-full px-5 py-3 text-white text-sm outline-none focus:border-cyan-500 transition-colors" />
              <button type="submit" disabled={!text.trim() || sending}
                className="w-11 h-11 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0">
                {sending ? <Loader2 className="animate-spin w-4 h-4 text-slate-950" /> : <Send className="w-4 h-4 text-slate-950" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// -- Main ----------------------------------------------------------------------
const MentorPortal = () => {
  const location = useLocation();
  const path     = location.pathname;

  const renderContent = () => {
    if (path.endsWith("/students")) return <StudentsView />;
    if (path.endsWith("/assign"))   return <AssignTasksView />;
    if (path.endsWith("/profile"))  return <ProfileView />;
    if (path.endsWith("/messages")) return <MessagesView />;
    return <OverviewView />;
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default MentorPortal;
