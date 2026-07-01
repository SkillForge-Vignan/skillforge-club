import React, { useState, useCallback, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, BrainCircuit } from "lucide-react";
import { getUserFor, logoutRole, getTokenFor } from "../auth";

const DashboardLayout = React.memo(({ menuItems = [], role = "User" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();
  const roleKey   = role.toLowerCase(); // "admin" | "mentor" | "student"
  const user      = getUserFor(roleKey);

  // Auth guard — redirect to login if no token for this specific role
  useEffect(() => {
    if (!getTokenFor(roleKey)) {
      navigate("/login", { replace: true });
    }
  }, [navigate, roleKey]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const handleLogout = () => {
    logoutRole(roleKey);
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : role[0].toUpperCase();

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-white/10 flex flex-col transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex-shrink-0`}>

        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-cyan-400" />
            <span className="font-bold text-xl tracking-tight text-white flex flex-col leading-none">
              <span>SkillForge</span>
              <span className="text-[0.65rem] text-cyan-400 tracking-widest uppercase mt-1">{role} Portal</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div className={`${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400"} transition-colors`}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none z-0" />

        {/* Header */}
        <header className="h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 relative z-10 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white hidden sm:block">
              Welcome back, {user?.name?.split(" ")[0] ?? role}! 👋
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-200 hidden sm:block">
                {user?.name ?? role}
              </span>
              <span className="text-xs text-cyan-400 font-bold uppercase hidden sm:block">
                {user?.role ?? role}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = "DashboardLayout";
export default DashboardLayout;
