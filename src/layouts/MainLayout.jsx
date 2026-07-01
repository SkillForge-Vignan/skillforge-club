import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = React.memo(() => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';
export default MainLayout;
