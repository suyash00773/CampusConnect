import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  LogOut,
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
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-cream border-r border-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-cream">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ink flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/abes-logo.png"
                  alt="ABES Engineering College"
                  className="h-9 w-auto object-contain object-left"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-ink tracking-tight leading-tight font-display">
                  Campus<span className="text-green">Connect</span>
                </div>
                <div className="text-[10px] text-ink-light font-bold tracking-widest uppercase mt-0.5">
                  Staff Console
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-xs font-bold text-ink-light uppercase tracking-widest mb-1">
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
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? 'bg-green-light text-ink font-semibold border-l-4 border-green'
                        : 'text-ink-light hover:text-ink hover:bg-sand border-l-4 border-transparent'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick link to public site */}
          <div className="px-4 pt-4 border-t border-border mx-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-ink hover:bg-sand border border-border transition-colors bg-white"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-4 h-4 text-ink-light" />
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border bg-white mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-sm font-bold text-ink shrink-0">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold text-ink truncate">
                  {admin?.name || admin?.username || 'Administrator'}
                </div>
                <div className="text-xs text-ink-light uppercase tracking-wider font-semibold">
                  {admin?.role || 'Admin'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-full text-ink-light hover:text-ink hover:bg-sand border border-border transition-colors cursor-pointer bg-cream"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
