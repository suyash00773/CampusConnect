import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { admin, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-tech-bg/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with ABES Engineering College Shield */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <img
              src="/abes-logo.png"
              alt="ABES Engineering College"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                CampusConnect
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5">
                ABES Event Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-tech-card text-white border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User & Admin Action Shortcuts */}
          <div className="hidden md:flex items-center gap-3">
            {/* Student Dashboard link */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-tech-surface border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Dashboard</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-tech-card border border-indigo-500/40 hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Log out of admin session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-tech-surface/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg bg-tech-surface text-slate-300 border border-slate-800"
              title="Student Dashboard"
            >
              <User className="w-4 h-4 text-cyan-400" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-tech-surface text-slate-300 hover:text-white border border-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-tech-surface px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-tech-card text-white border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 mt-2 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg bg-tech-card border border-slate-700 text-white text-sm font-semibold"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Student Dashboard</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg bg-indigo-950/60 border border-indigo-700/80 text-slate-200 text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-rose-400 hover:bg-slate-800 text-sm font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-center text-xs font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-center text-xs font-semibold"
                >
                  Admin Access
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
