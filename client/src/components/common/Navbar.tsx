import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
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
    <header className="sticky top-0 z-40 w-full bg-ivory border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with ABES Engineering College Shield */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <img
              src="/abes-logo.png"
              alt="ABES Engineering College"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="h-7 w-px bg-border hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-ink flex items-center gap-1.5">
                CampusConnect
                <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
              </span>
              <span className="text-[10px] text-ink-light tracking-wide -mt-0.5">
                ABES Event Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                    active
                      ? 'text-ink border-b-2 border-ink py-1'
                      : 'text-ink-light hover:text-ink py-1 border-b-2 border-transparent'
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
              className="bg-ink text-ivory text-xs font-semibold rounded-pill px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Student Dashboard
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="border border-ink/20 text-ink text-xs font-semibold rounded-pill px-4 py-2 hover:bg-ink/5 transition-colors"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-full text-ink-light hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label="Log out of admin session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="border border-ink/20 text-ink text-xs font-semibold rounded-pill px-4 py-2 hover:bg-ink/5 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:bg-cream rounded-lg transition-colors"
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
        <div className="md:hidden border-b border-border bg-ivory px-4 pt-3 pb-5 space-y-4 animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs font-semibold tracking-widest uppercase rounded-lg ${
                    active
                      ? 'text-ink bg-cream'
                      : 'text-ink-light hover:text-ink hover:bg-cream/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-ink text-ivory text-xs font-semibold rounded-pill px-4 py-3"
            >
              Student Dashboard
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-ink/20 text-ink text-xs font-semibold rounded-pill px-4 py-3"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-red-600 text-xs font-semibold rounded-pill px-4 py-3 hover:bg-red-50"
                >
                  Log Out of Admin
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-cream text-ink text-xs font-semibold rounded-pill px-4 py-3"
                >
                  Sign In
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center border border-ink/20 text-ink text-xs font-semibold rounded-pill px-4 py-3"
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
