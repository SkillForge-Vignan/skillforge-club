import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users, BrainCircuit, Rocket, CalendarCheck, LineChart,
  Settings, Plus, Search, Edit2, Trash2, ChevronRight, Mail,
  Loader2, X, Check
} from "lucide-react";
import { getTokenFor } from "../auth";

const BASE = "http://localhost:5000/api";

const authFetch = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getTokenFor("admin")}`, ...opts.headers },
  });
  const data = await res.json();
  return data;
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-slate-900/50 border border-white/10 rounded-2xl p-6 bg-gradient-to-br ${color} to-transparent hover:border-white/20 transition-all`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value ?? ""}</h3>
      </div>
      <div className="p-3 bg-slate-800/50 rounded-xl">{icon}</div>
    </div>
  </div>
);

const Badge = ({ status }) => {
  const active = status === "Active" || status === "member" || status === "admin" || status === true;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-white/10"}`}>
      {status}
    </span>
  );
};

const TableShell = ({ title, cols, rows, loading, onAdd, addLabel, search, setSearch, searchPlaceholder }) => (
  <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-slate-900 border border-white/10 text-sm rounded-full pl-9 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 w-64 transition-colors"
          />
        </div>
        {onAdd && (
          <button onClick={onAdd} className="h-10 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full flex items-center gap-2 shadow-lg transition-all">
            <Plus className="w-4 h-4" /> {addLabel}
          </button>
        )}
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-slate-900/50">
            {cols.map((c) => <th key={c} className="py-4 px-4 font-semibold">{c}</th>)}
          </tr>
        </thead>
        <tbody className="text-sm">
          {loading ? (
            <tr><td colSpan={cols.length} className="py-16 text-center text-slate-500"><Loader2 className="animate-spin inline" /></td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={cols.length} className="py-16 text-center text-slate-500">No data found.</td></tr>
          ) : rows}
        </tbody>
      </table>
    </div>
  </div>
);

const MentorChangeModal = ({ student, currentMentor, newMentor, onConfirm, onCancel, saving }) =>
  createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-1">Change Mentor</h3>
        <p className="text-slate-400 text-sm mb-6">Confirm mentor reassignment for this student.</p>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student</p>
              <p className="text-white font-bold text-sm">{student.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Mentor</p>
              <p className="text-rose-400 font-bold text-sm">{currentMentor?.name ?? "Unassigned"}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <div className="flex-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">New Mentor</p>
              <p className="text-emerald-400 font-bold text-sm">{newMentor.name}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-600 transition-colors">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />} Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

const MembersTab = () => {
  const [subTab, setSubTab]           = useState("students");
  const [students, setStudents]       = useState([]);
  const [mentors, setMentors]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [assigning, setAssigning]     = useState(null);
  const [modal, setModal]             = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [members, mentorList, assignList] = await Promise.all([
      authFetch("/members"),
      authFetch("/assignments/mentors"),
      authFetch("/assignments"),
    ]);
    setStudents(Array.isArray(members) ? members : []);
    setMentors(Array.isArray(mentorList) ? mentorList : []);
    setAssignments(Array.isArray(assignList) ? assignList : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDeleteStudent = async (id) => {
    if (!confirm("Remove this student?")) return;
    const res = await authFetch(`/members/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setStudents((d) => d.filter((m) => m.id !== id));
  };

  const handleDeleteMentor = async (id) => {
    if (!confirm("Remove this mentor?")) return;
    const res = await authFetch(`/members/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setMentors((d) => d.filter((m) => m.id !== id));
  };

  const openModal = (student, currentMentor, newMentorId) => {
    const newMentor = mentors.find((m) => m.id === newMentorId);
    if (!newMentor || newMentor.id === currentMentor?.id) return;
    setModal({ student, currentMentor, newMentor });
  };

  const handleAssign = async () => {
    if (!modal) return;
    setModalSaving(true);
    const res = await authFetch("/assignments", {
      method: "POST",
      body: JSON.stringify({ studentId: modal.student.id, mentorId: modal.newMentor.id }),
    });
    if (res.assignment) {
      setAssignments((prev) => [
        ...prev.filter((a) => a.student?.id !== modal.student.id),
        res.assignment,
      ]);
    }
    setModalSaving(false);
    setModal(null);
  };

  const getMentorForStudent = (studentId) =>
    assignments.find((a) => a.student?.id === studentId)?.mentor ?? null;

  const filteredStudents = students.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const studentRows = filteredStudents.map((m) => {
    const assignedMentor = getMentorForStudent(m.id);
    return (
      <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {((m.name || " ").charAt(0)).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white">{m.name || "Unnamed Student"}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-slate-400 text-sm">{m.roll_number || "—"}</td>
        <td className="py-4 px-4 text-slate-400 text-sm">{m.branch || "—"}</td>
        <td className="py-4 px-4 text-slate-400 text-sm">{m.year || "—"}</td>
        <td className="py-4 px-4 text-slate-400 text-sm">{m.section || "—"}</td>
        <td className="py-4 px-4 text-slate-400 text-sm">{m.phone || "—"}</td>
        <td className="py-4 px-4">
          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
            {m.domain_interest || "—"}
          </span>
        </td>
        <td className="py-4 px-4">
          {assignedMentor
            ? <span className="text-emerald-400 text-sm font-semibold">{assignedMentor.name}</span>
            : <span className="text-slate-500 text-xs">Unassigned</span>}
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <select
              value={assignedMentor?.id ?? ""}
              onChange={(e) => { if (e.target.value) openModal(m, assignedMentor, e.target.value); }}
              disabled={assigning === m.id}
              className="bg-slate-800 border border-white/10 text-xs rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
            >
              <option value="" disabled>Assign mentor...</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
              ))}
            </select>
            <button onClick={() => handleDeleteStudent(m.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  const filteredMentors = mentors.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const mentorRows = filteredMentors.map((m) => {
    const assignedStudents = assignments.filter((a) => a.mentor?.id === m.id);
    return (
      <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {((m.name || " ").charAt(0)).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white">{m.name || "Unnamed Mentor"}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">Mentor</span>
        </td>
        <td className="py-4 px-4">
          <span className="text-white font-bold text-sm">{assignedStudents.length}</span>
          <span className="text-slate-500 text-xs ml-1">student{assignedStudents.length !== 1 ? "s" : ""}</span>
        </td>
        <td className="py-4 px-4">
          {assignedStudents.length === 0 ? (
            <span className="text-slate-500 text-xs">No students assigned</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {assignedStudents.map((a) => (
                <span key={a.student?.id} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                  {a.student?.name ?? "—"}
                </span>
              ))}
            </div>
          )}
        </td>
        <td className="py-4 px-4">
          <button onClick={() => handleDeleteMentor(m.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="space-y-4">
      {modal && (
        <MentorChangeModal
          student={modal.student}
          currentMentor={modal.currentMentor}
          newMentor={modal.newMentor}
          onConfirm={handleAssign}
          onCancel={() => setModal(null)}
          saving={modalSaving}
        />
      )}
      <div className="flex gap-2">
        {[
          { key: "students", label: "Students", count: students.length, color: "cyan" },
          { key: "mentors",  label: "Mentors",  count: mentors.length,  color: "emerald" },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => { setSubTab(key); setSearch(""); }}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
              subTab === key
                ? color === "cyan"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            {label}
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-xs">{count}</span>
          </button>
        ))}
      </div>
      {subTab === "students" && (
        <TableShell
          title="Students & Mentor Assignment"
          cols={["Student", "Roll No", "Branch", "Year", "Section", "Phone", "Domain", "Assigned Mentor", "Actions"]}
          rows={studentRows} loading={loading} search={search} setSearch={setSearch} searchPlaceholder="Search students..."
        />
      )}
      {subTab === "mentors" && (
        <TableShell
          title="Mentors"
          cols={["Mentor", "Role", "Students Assigned", "Assigned Students", "Actions"]}
          rows={mentorRows} loading={loading} search={search} setSearch={setSearch} searchPlaceholder="Search mentors..."
        />
      )}
    </div>
  );
};

const EventsTab = () => {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ title: "", description: "", date: "", time: "", venue: "", category: "Workshop", capacity: "50", registrationLink: "" });
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await authFetch("/events");
    setData(Array.isArray(res) ? res : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    const res = await authFetch(`/events/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setData((d) => d.filter((e) => e.id !== id));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) || 50 };
      const res = await authFetch("/events", { method: "POST", body: JSON.stringify(payload) });
      if (res.event) {
        setData((d) => [res.event, ...d]);
        setShowForm(false);
        setForm({ title: "", description: "", date: "", time: "", venue: "", category: "Workshop", capacity: "50", registrationLink: "" });
      } else {
        setFormError(res.error || res.details?.[0]?.msg || JSON.stringify(res));
      }
    } catch {
      setFormError("Network error. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const filtered = data.filter((e) => (e.title || "").toLowerCase().includes(search.toLowerCase()));

  const rows = filtered.map((e) => (
    <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4 font-bold text-white">{e.title}</td>
      <td className="py-4 px-4"><Badge status={e.category} /></td>
      <td className="py-4 px-4 text-slate-400">{e.date}</td>
      <td className="py-4 px-4 text-slate-400">{e.registered}/{e.capacity}</td>
      <td className="py-4 px-4">
        <button onClick={() => handleDelete(e.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  ));

  const FIELDS = [
    { key: "title",            label: "Title",            type: "text",   required: true },
    { key: "date",             label: "Date",             type: "date",   required: true },
    { key: "time",             label: "Time",             type: "time",   required: false },
    { key: "venue",            label: "Venue",            type: "text",   required: true },
    { key: "category",         label: "Category",         type: "text",   required: true },
    { key: "capacity",         label: "Capacity",         type: "number", required: false },
    { key: "registrationLink", label: "Google Form Link", type: "url",    required: true },
  ];

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-[#1e293b]/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Create New Event</h3>
            <button onClick={() => setShowForm(false)}><X className="text-slate-400 hover:text-white" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ key, label, type, required }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">{label}</label>
                <input type={type} required={required} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm resize-none" />
            </div>
            {formError && <div className="sm:col-span-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{formError}</div>}
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-bold text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />} Create Event
              </button>
            </div>
          </form>
        </div>
      )}
      <TableShell title="Events" cols={["Title", "Category", "Date", "Registered", "Actions"]} rows={rows} loading={loading} onAdd={() => setShowForm(true)} addLabel="New Event" search={search} setSearch={setSearch} searchPlaceholder="Search events..." />
    </div>
  );
};

const ProjectsTab = () => {
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ title: "", description: "", category: "Web App", githubUrl: "", liveUrl: "", image: "", techStack: "" });
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await authFetch("/projects");
    setData(Array.isArray(res) ? res : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    const res = await authFetch(`/projects/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setData((d) => d.filter((p) => p.id !== id));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const res = await authFetch("/projects", { method: "POST", body: JSON.stringify(form) });
      if (res.project) {
        setData((d) => [res.project, ...d]);
        setShowForm(false);
        setForm({ title: "", description: "", category: "Web App", githubUrl: "", liveUrl: "", image: "", techStack: "" });
      } else {
        setFormError(res.error || res.details?.[0]?.msg || JSON.stringify(res));
      }
    } catch {
      setFormError("Network error. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const filtered = data.filter((p) => (p.title || "").toLowerCase().includes(search.toLowerCase()));

  const rows = filtered.map((p) => (
    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {p.image && <img src={p.image.startsWith('/uploads/') ? `http://localhost:5000${p.image}` : p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-white/10" />}
          <span className="font-bold text-white">{p.title}</span>
        </div>
      </td>
      <td className="py-4 px-4"><Badge status={p.category} /></td>
      <td className="py-4 px-4 text-slate-400">{p.status}</td>
      <td className="py-4 px-4 text-slate-400 text-xs">{Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.techStack}</td>
      <td className="py-4 px-4">
        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  ));

  const FORM_FIELDS = [
    ["title",     "Title",                        true],
    ["category",  "Category",                     true],
    ["githubUrl", "GitHub URL",                   false],
    ["liveUrl",   "Live / Demo URL",              false],
    ["image",     "Image URL",                    false],
    ["techStack", "Tech Stack (comma-separated)", false],
  ];

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-[#1e293b]/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Add New Project</h3>
            <button onClick={() => setShowForm(false)}><X className="text-slate-400 hover:text-white" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORM_FIELDS.map(([k, label, required]) => (
              <div key={k} className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">{label}</label>
                <input required={required} value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Description <span className="text-red-400">*</span></label>
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm resize-none" />
            </div>
            {formError && <div className="sm:col-span-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{formError}</div>}
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setFormError(""); }} className="px-6 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-bold text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />} Add Project
              </button>
            </div>
          </form>
        </div>
      )}
      <TableShell title="Projects" cols={["Title", "Category", "Status", "Tech Stack", "Actions"]} rows={rows} loading={loading} onAdd={() => setShowForm(true)} addLabel="New Project" search={search} setSearch={setSearch} searchPlaceholder="Search projects..." />
    </div>
  );
};

const TeamTab = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [editId, setEditId]   = useState(null);
  const EMPTY = { name: "", role: "", department: "", year: "", bio: "", linkedin: "", github: "", avatar: "" };
  const [form, setForm]       = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await authFetch("/team");
    setData(Array.isArray(res) ? res : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditId(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (m) => { setEditId(m.id); setForm({ name: m.name, role: m.role, department: m.department || "", year: m.year || "", bio: m.bio || "", linkedin: m.linkedin || "", github: m.github || "", avatar: m.avatar || "" }); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm("Remove this team member?")) return;
    const res = await authFetch(`/team/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setData((d) => d.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await authFetch(`/team/${editId}`, { method: "PUT", body: JSON.stringify(form) });
        if (res.member) { setData((d) => d.map((m) => m.id === editId ? res.member : m)); setShowForm(false); }
        else alert(res.error || "Update failed.");
      } else {
        const res = await authFetch("/team", { method: "POST", body: JSON.stringify(form) });
        if (res.member) { setData((d) => [res.member, ...d]); setShowForm(false); }
        else alert(res.error || "Failed to add team member.");
      }
    } catch { alert("Network error."); }
    finally { setSaving(false); }
  };

  const filtered = data.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const FIELDS = [["name","Full Name"],["role","Role/Position"],["department","Department"],["year","Year"],["linkedin","LinkedIn URL"],["github","GitHub URL"],["avatar","Profile Photo URL"]];

  const rows = filtered.map((m) => (
    <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {m.avatar
            ? <img src={m.avatar.startsWith('/uploads/') ? `http://localhost:5000${m.avatar}` : m.avatar} alt={m.name || "Team Member"} className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0" />
            : <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-black text-white flex-shrink-0">{((m.name || " ").charAt(0)).toUpperCase()}</div>
          }
          <div>
            <p className="font-bold text-white">{m.name}</p>
            <p className="text-xs text-slate-500">{m.department}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4"><Badge status={m.role} /></td>
      <td className="py-4 px-4 text-slate-400 text-sm">{m.year}</td>
      <td className="py-4 px-4 text-slate-400 text-xs max-w-xs truncate">{m.bio}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">LinkedIn</a>}
          {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:underline">GitHub</a>}
          <button onClick={() => openEdit(m)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(m.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-[#1e293b]/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{editId ? "Edit Team Member" : "Add Team Member"}</h3>
            <button onClick={() => setShowForm(false)}><X className="text-slate-400 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(([k, label]) => (
              <div key={k} className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">{label}</label>
                <input required={["name","role"].includes(k)} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-slate-700 text-slate-300 font-bold text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />} {editId ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      )}
      <TableShell title="Team Members" cols={["Name", "Role", "Year", "Bio", "Actions"]} rows={rows} loading={loading} onAdd={openAdd} addLabel="Add Member" search={search} setSearch={setSearch} searchPlaceholder="Search team..." />
    </div>
  );
};

const MessagesTab = () => {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [subTab, setSubTab]     = useState("contact");
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await authFetch("/contact");
    setData(Array.isArray(res) ? res : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    await authFetch(`/contact/${id}/read`, { method: "PATCH" });
    setData((d) => d.map((m) => m.id === id ? { ...m, is_read: true } : m));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    const res = await authFetch(`/contact/${id}`, { method: "DELETE" });
    if (res.error) return alert(res.error);
    setData((d) => d.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const handleRowClick = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    const msg = data.find((m) => m.id === id);
    if (msg && !msg.is_read) markRead(id);
  };

  const isFeedback = (m) => m.subject?.startsWith("Feedback");
  const filtered = data
    .filter((m) => (subTab === "feedback" ? isFeedback(m) : !isFeedback(m)))
    .filter((m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
    );

  const contactCount  = data.filter((m) => !isFeedback(m)).length;
  const feedbackCount = data.filter((m) =>  isFeedback(m)).length;

  return (
    <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-white">Messages</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
            className="bg-slate-900 border border-white/10 text-sm rounded-full pl-9 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 w-64 transition-colors" />
        </div>
      </div>
      <div className="flex gap-2">
        {[
          { key: "contact",  label: "Contact",  count: contactCount,  color: "cyan" },
          { key: "feedback", label: "Feedback", count: feedbackCount, color: "yellow" },
        ].map(({ key, label, count, color }) => (
          <button key={key} onClick={() => { setSubTab(key); setExpanded(null); }}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
              subTab === key
                ? color === "cyan" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                : "bg-slate-800 text-slate-400 border-white/10 hover:text-white"
            }`}>
            {label}<span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-xs">{count}</span>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-slate-900/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">{subTab === "feedback" ? "Rating" : "Subject"}</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={5} className="py-16 text-center text-slate-500"><Loader2 className="animate-spin inline" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-slate-500">No {subTab} messages yet.</td></tr>
            ) : filtered.map((m) => (
              <React.Fragment key={m.id}>
                <tr onClick={() => handleRowClick(m.id)}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${expanded === m.id ? "bg-white/10" : "hover:bg-white/5"} ${!m.is_read ? "bg-blue-500/5" : ""}`}>
                  <td className="py-4 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      {!m.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                      {m.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{m.email}</td>
                  <td className="py-4 px-4 text-slate-300">
                    {subTab === "feedback"
                      ? <span className="text-yellow-400 font-bold">{m.subject?.replace("Feedback — ", "")}</span>
                      : <span className="truncate max-w-[180px] block">{m.subject}</span>}
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-xs">{new Date(m.submitted_at || m.submittedAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {expanded === m.id && (
                  <tr className="border-b border-white/5">
                    <td colSpan={5} className="px-4 pb-4">
                      <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 mt-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Message</p>
                          <span className="text-xs text-slate-500">{new Date(m.submitted_at || m.submittedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                        {!m.is_read && (
                          <button onClick={() => markRead(m.id)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                            <Check className="w-3 h-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -- Overview ------------------------------------------------------------------

const Overview = ({ memberCount, eventCount, projectCount, handleTabChange }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Events",   icon: <CalendarCheck className="w-6 h-6 text-blue-400" />,   color: "blue",   tab: "events",   desc: "Create and manage all club events." },
          { label: "Projects", icon: <Rocket className="w-6 h-6 text-purple-400" />, color: "purple", tab: "projects", desc: "Add and track all club projects." },
        ].map(({ label, icon, color, tab, desc }) => (
          <div key={tab} onClick={() => handleTabChange(tab)} className={`bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl hover:border-${color}-500/30 transition-colors group cursor-pointer`}>
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 border border-${color}-500/20`}>{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{label} Management</h3>
            <p className="text-sm text-slate-400 mb-4">{desc}</p>
            <div className={`text-sm font-bold text-${color}-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
              Manage {label} <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
        <div className="space-y-4">
          {[
            { label: "Total Members",  value: memberCount,  color: "blue" },
            { label: "Total Events",   value: eventCount,   color: "purple" },
            { label: "Total Projects", value: projectCount, color: "emerald" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <span className="text-slate-400 text-sm">{label}</span>
              <span className={`text-${color}-400 font-black text-xl`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-900/20 to-slate-900 border border-rose-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20"><Settings className="w-5 h-5 text-rose-400" /></div>
          <h3 className="text-lg font-bold text-white">Messages</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">View and manage contact form submissions.</p>
        <button onClick={() => handleTabChange("messages")} className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold rounded-xl transition-all border border-rose-500/30 text-sm">
          View Messages
        </button>
      </div>
    </div>
  </div>
);

// -- Main AdminPortal ----------------------------------------------------------

const AdminPortal = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const [activeTab, setActiveTab]     = useState("overview");
  const [memberCount, setMemberCount] = useState("");
  const [projectCount, setProjectCount] = useState("");
  const [eventCount, setEventCount]   = useState("");

  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith("/students"))     setActiveTab("students");
    else if (path.endsWith("/team"))     setActiveTab("team");
    else if (path.endsWith("/projects")) setActiveTab("projects");
    else if (path.endsWith("/events"))   setActiveTab("events");
    else if (path.endsWith("/messages")) setActiveTab("messages");
    else setActiveTab("overview");
  }, [location.pathname]);

  useEffect(() => {
    authFetch("/members/stats").then((s) => { if (typeof s.total === "number") setMemberCount(s.total); });
    authFetch("/projects").then((d) => { if (Array.isArray(d)) setProjectCount(d.length); });
    authFetch("/events").then((d) => { if (Array.isArray(d)) setEventCount(d.length); });
  }, [activeTab]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    navigate(id === "overview" ? "/admin-portal" : `/admin-portal/${id}`);
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: <LineChart className="w-4 h-4" /> },
    { id: "students", name: "Members",  icon: <Users className="w-4 h-4" /> },
    { id: "team",     name: "Team",     icon: <BrainCircuit className="w-4 h-4" /> },
    { id: "events",   name: "Events",   icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "projects", name: "Projects", icon: <Rocket className="w-4 h-4" /> },
    { id: "messages", name: "Messages", icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Members"  value={memberCount}  icon={<Users className="w-6 h-6 text-blue-400" />}         color="from-blue-500/20" />
        <StatCard title="Total Events"   value={eventCount}   icon={<CalendarCheck className="w-6 h-6 text-purple-400" />} color="from-purple-500/20" />
        <StatCard title="Total Projects" value={projectCount} icon={<Rocket className="w-6 h-6 text-emerald-400" />}       color="from-emerald-500/20" />
      </div>

      <div className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-400 bg-cyan-400/5"
                : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <Overview memberCount={memberCount} eventCount={eventCount} projectCount={projectCount} handleTabChange={handleTabChange} />}
      {activeTab === "students" && <MembersTab />}
      {activeTab === "team"     && <TeamTab />}
      {activeTab === "events"   && <EventsTab />}
      {activeTab === "projects" && <ProjectsTab />}
      {activeTab === "messages" && <MessagesTab />}
    </div>
  );
};

export default AdminPortal;
