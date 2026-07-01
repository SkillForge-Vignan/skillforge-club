import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Domains from './pages/Domains';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import StudentPortal from './pages/StudentPortal';
import AdminPortal from './pages/AdminPortal';
import MentorPortal from './pages/MentorPortal';

// Icons for Dashboard Menus
import { LayoutDashboard, BookOpen, Rocket, BookOpenCheck, BrainCircuit, MessageSquare, User, Users, ClipboardCheck, Code2, CalendarCheck, Settings, UserSquare } from 'lucide-react';

const studentMenu = [
  { title: 'Dashboard', path: '/student-portal', icon: <LayoutDashboard /> },
  { title: 'My Domains', path: '/student-portal/domains', icon: <BookOpen /> },
  { title: 'Assignments', path: '/student-portal/assignments', icon: <ClipboardCheck /> },
  { title: 'Mentor', path: '/student-portal/mentor', icon: <BrainCircuit /> },
  { title: 'Profile', path: '/student-portal/profile', icon: <User /> },
];

const mentorMenu = [
  { title: 'Dashboard', path: '/mentor-portal', icon: <LayoutDashboard /> },
  { title: 'My Students', path: '/mentor-portal/students', icon: <Users /> },
  { title: 'Assign Tasks', path: '/mentor-portal/assign', icon: <BookOpenCheck /> },
  { title: 'Messages', path: '/mentor-portal/messages', icon: <MessageSquare /> },
  { title: 'Profile', path: '/mentor-portal/profile', icon: <User /> },
];

const adminMenu = [
  { title: 'Dashboard',       path: '/admin-portal',          icon: <LayoutDashboard /> },
  { title: 'Manage Students', path: '/admin-portal/students',  icon: <Users /> },
  { title: 'Team Members',    path: '/admin-portal/team',      icon: <UserSquare /> },
  { title: 'Projects',        path: '/admin-portal/projects',  icon: <Rocket /> },
  { title: 'Events',          path: '/admin-portal/events',    icon: <CalendarCheck /> },
  { title: 'Messages',        path: '/admin-portal/messages',  icon: <MessageSquare /> },
  { title: 'Settings',        path: '/admin-portal/settings',  icon: <Settings /> },
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* Student Portal Routes */}
        <Route element={<DashboardLayout menuItems={studentMenu} role="Student" />}>
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/student-portal/*" element={<StudentPortal />} />
        </Route>

        {/* Mentor Portal Routes */}
        <Route element={<DashboardLayout menuItems={mentorMenu} role="Mentor" />}>
          <Route path="/mentor-portal" element={<MentorPortal />} />
          <Route path="/mentor-portal/*" element={<MentorPortal />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route element={<DashboardLayout menuItems={adminMenu} role="Admin" />}>
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="/admin-portal/*" element={<AdminPortal />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
