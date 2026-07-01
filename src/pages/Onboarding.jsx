import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, User, ChevronRight, Check, Loader2 } from "lucide-react";
import { getTokenFor, getUserFor, saveToken, getUser } from "../auth";

const BASE = "http://localhost:5000/api";

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "AIML", "CSD", "Other"];
const YEARS    = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SECTIONS = ["A", "B", "C", "D", "E"];

const steps = [
  { id: 1, title: "Personal Info",   icon: User,          color: "blue" },
  { id: 2, title: "Academic Info",   icon: GraduationCap, color: "purple" },
  { id: 3, title: "Domain Interest", icon: BookOpen,      color: "cyan" },
];

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-300 ml-1">{label}</label>
    {children}
  </div>
);

const inputCls  = "w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-all";
const selectCls = inputCls;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [domains, setDomains] = useState([]); // Fetch from API
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [form, setForm]       = useState({
    phone: "", bio: "",
    year: "", branch: "", section: "", rollNumber: "",
    domains: [], // multiple domains
  });

  // Fetch domains from API on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch(`${BASE}/domains`);
        const data = await res.json();
        setDomains(data.map((d) => d.name));
      } catch (err) {
        console.error("Error fetching domains:", err);
        // Fallback to default domains if API fails
        setDomains(["Web Development", "AI/ML", "Mobile Development", "Cybersecurity", "Data Science", "Cloud Computing", "UI/UX Design", "Blockchain", "IoT", "Other"]);
      } finally {
        setDomainsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleDomain = (d) => {
    setForm((p) => ({
      ...p,
      domains: p.domains.includes(d)
        ? p.domains.filter((x) => x !== d)
        : [...p.domains, d],
    }));
  };

  const handleNext = () => { setError(""); setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (form.domains.length === 0) { setError("Please select at least one domain."); return; }
    const token = getTokenFor("student");
    const studentUser = getUserFor("student");

    if (!token) {
      setError("Not authenticated.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/auth/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          domainInterest: form.domains.join(", "), // store as comma-separated
        }),
      });
      const data = await res.json();
      if (data.user) {
        saveToken(token, { ...studentUser, ...data.user });
        const role = getUserFor("student")?.role;
        navigate(role === "mentor" ? "/mentor-portal" : "/student-portal", { replace: true });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Welcome to SkillForge 🎉</h1>
          <p className="text-slate-400">Tell us a bit about yourself to get started</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                step === s.id ? `bg-${s.color}-500/20 text-${s.color}-400 border border-${s.color}-500/30` :
                step > s.id  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                               "bg-slate-800 text-slate-500 border border-white/5"
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="hidden sm:block">{s.title}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px w-6 ${step > s.id ? "bg-emerald-500" : "bg-slate-700"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-black text-white mb-6">Personal Info</h2>
                  <Field label="Phone Number">
                    <input className={inputCls} placeholder="e.g. 9876543210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </Field>
                  <Field label="Short Bio (optional)">
                    <textarea className={inputCls} rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={(e) => set("bio", e.target.value)} />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-black text-white mb-6">Academic Info</h2>
                  <Field label="Year">
                    <select className={selectCls} value={form.year} onChange={(e) => set("year", e.target.value)}>
                      <option value="">Select Year</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </Field>
                  <Field label="Branch">
                    <select className={selectCls} value={form.branch} onChange={(e) => set("branch", e.target.value)}>
                      <option value="">Select Branch</option>
                      {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Section">
                    <select className={selectCls} value={form.section} onChange={(e) => set("section", e.target.value)}>
                      <option value="">Select Section</option>
                      {SECTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Roll Number">
                    <input className={inputCls} placeholder="e.g. 22CS001" value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-black text-white mb-1">Domain Interest</h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Select all domains you're interested in.{" "}
                    {form.domains.length > 0 && (
                      <span className="text-cyan-400 font-bold">{form.domains.length} selected</span>
                    )}
                  </p>
                  {domainsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="animate-spin w-6 h-6 text-cyan-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {domains.map((d) => {
                        const selected = form.domains.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDomain(d)}
                            className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all text-left flex items-center justify-between gap-2 ${
                              selected
                                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <span>{d}</span>
                            {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/5 transition-all">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || form.domains.length === 0} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Check className="w-4 h-4" /> Complete Setup</>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-4 text-slate-500 text-sm">
          <button onClick={() => navigate(getUser()?.role === "mentor" ? "/mentor-portal" : "/student-portal")} className="hover:text-slate-300 underline">
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
