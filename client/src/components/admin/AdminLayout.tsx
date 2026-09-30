import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { AdminSidebar } from './AdminSidebar.js';
import { Loader } from '../common/Loader.js';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader label="Verifying admin credentials..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-ivory/90 border-b border-border backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-cream border border-border text-ink cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-ink flex items-center gap-1.5 font-display tracking-wide">
            Staff Console
          </span>
        </div>
      </header>

      {/* Responsive Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="lg:pl-64 flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        <Outlet />
      </main>
    </div>
  );
};
