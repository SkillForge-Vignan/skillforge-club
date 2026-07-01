import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldCheck, Mail, Lock, UserCog, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi, saveToken } from "../auth";

const ADMIN_EMAIL = "";
const ADMIN_PASS  = "";

const InputField = ({ icon: Icon, type, placeholder, value, onChange, color }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type={isPassword && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={`w-full bg-slate-800/80 border border-white/5 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-${color}-500 focus:bg-slate-800 transition-all font-medium`}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

const LoginCard = ({ role, color, icon: Icon, gradient, title, subtitle, emailPlaceholder, buttonText, onSubmit, loading, error, isAdmin, loginOnly }) => {
  const [email, setEmail]           = useState(isAdmin ? ADMIN_EMAIL : "");
  const [password, setPassword]     = useState(isAdmin ? ADMIN_PASS : "");
  const [name, setName]             = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, name, isRegister });
  };

  return (
    <motion.div
      key={role}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-8 md:p-10 rounded-[2rem] relative overflow-hidden group hover:border-${color}-500/50 transition-colors duration-500 w-full`}
    >
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${gradient}`}></div>

      <div className="flex flex-col items-center mb-8 mt-2 relative z-10">
        <div className={`w-16 h-16 bg-${color}-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 text-${color}-400`} />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
        <p className={`text-${color}-200/60 mt-2 text-center text-sm`}>{subtitle}</p>
      </div>

      <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
        {!isAdmin && isRegister && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <InputField icon={UserCog} type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} color={color} />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">{isAdmin ? "Admin Email" : "Email"}</label>
          <InputField icon={Mail} type="email" placeholder={emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} color={color} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">{isAdmin ? "Access Key" : "Password"}</label>
          <InputField icon={Lock} type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} color={color} />
          {!isAdmin && isRegister && (
            <p className="text-xs text-slate-500 ml-1">8–15 characters · one uppercase · one number · one special (!@#$%^&*)</p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-${color}-600 hover:bg-${color}-500 text-white font-bold py-4 rounded-xl transition-all mt-2 flex items-center justify-center gap-2`}
        >
          {loading
            ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span>
            : isRegister ? "Create Account" : buttonText
          }
        </button>

        {!isAdmin && !loginOnly && (
          <p className="text-center text-sm text-gray-500 pt-1">
            {isRegister ? "Already have an account? " : "New here? "}
            <button type="button" onClick={() => setIsRegister(!isRegister)}
              className={`text-${color}-400 font-semibold hover:underline`}>
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        )}
      </form>
    </motion.div>
  );
};

const Login = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const navigate                  = useNavigate();

  const handleSubmit = async ({ email, password, name, isRegister }) => {
    setError("");
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
        if (password.length < 8 || password.length > 15) { setError("Password must be 8–15 characters."); setLoading(false); return; }
        if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); setLoading(false); return; }
        if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); setLoading(false); return; }
        if (!/[!@#$%^&*]/.test(password)) { setError("Password must contain at least one special character (!@#$%^&*)."); setLoading(false); return; }
        res = await authApi.register(name, email, password);
      } else {
        res = await authApi.login(email, password);
      }

      console.log("Auth response:", res);
      if (res.token) {
        saveToken(res.token, res.user);
        if (isRegister) {
          navigate("/onboarding");
        } else if (res.user.role === "admin") {
          navigate("/admin-portal");
        } else if (res.user.role === "mentor") {
          navigate("/mentor-portal");
        } else {
          navigate("/student-portal");
        }
      } else {
        setError(res.error || res.errors?.[0]?.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "student", label: "Student", icon: GraduationCap, color: "blue" },
    { id: "mentor",  label: "Mentor",  icon: UserCog,       color: "emerald" },
    { id: "admin",   label: "Admin",   icon: ShieldCheck,   color: "purple" },
  ];

  const cardProps = {
    student: {
      color: "blue", gradient: "from-blue-400 to-cyan-400",
      icon: GraduationCap, title: "Student Portal",
      subtitle: "Access your learning journey",
      emailPlaceholder: "student@example.com",
      buttonText: "Login to Portal",
    },
    mentor: {
      color: "emerald", gradient: "from-emerald-400 to-teal-400",
      icon: UserCog, title: "Mentor Portal",
      subtitle: "Track your assigned students",
      emailPlaceholder: "mentor@example.com",
      buttonText: "Access Mentor Dashboard",
      loginOnly: true,
    },
    admin: {
      color: "purple", gradient: "from-purple-500 to-pink-500",
      icon: ShieldCheck, title: "Admin Portal",
      subtitle: "System management & overview",
      emailPlaceholder: ADMIN_EMAIL,
      buttonText: "Authorize Access",
      isAdmin: true,
      loginOnly: true,
    },
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
      <div className="flex bg-slate-800 p-1.5 rounded-full mb-10 w-full max-w-lg mx-auto border border-white/10 shadow-xl">
        {tabs.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setError(""); }}
            className={`flex-1 py-3 px-4 text-sm md:text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === id ? `bg-${color}-600 text-white` : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <LoginCard
            key={activeTab}
            role={activeTab}
            {...cardProps[activeTab]}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </AnimatePresence>
      </div>

      {activeTab === "admin" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl px-6 py-4 text-center max-w-md w-full"
        >
          <p className="text-purple-300 text-sm font-medium">Admin credentials are managed via the database.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
