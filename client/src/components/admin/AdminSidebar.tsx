import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  LogOut,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = false, onClose }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Manage Events', path: '/admin/events', icon: CalendarDays },
    { label: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
    { label: 'Campus Clubs', path: '/admin/clubs', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-tech-bg border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img
                src="/abes-logo.png"
                alt="ABES Engineering College"
                className="h-9 w-auto object-contain"
              />
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <div className="font-bold text-xs text-white tracking-tight leading-tight">
                  Campus<span className="text-indigo-400">Connect</span>
                </div>
                <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                  Staff Console
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick link to public site */}
          <div className="px-3 pt-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-tech-surface/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-xs font-semibold text-indigo-300 shrink-0">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-white truncate">
                  {admin?.name || admin?.username || 'Administrator'}
                </div>
                <div className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
                  {admin?.role || 'Admin'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
