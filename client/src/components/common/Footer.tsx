import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/90 bg-tech-bg pt-16 pb-12 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src="/abes-logo.png"
                alt="ABES Engineering College"
                className="h-11 w-auto object-contain"
              />
            </Link>
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              CampusConnect Event Platform
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Event registration and club management for ABES Engineering College.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Campus Events
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition-colors">
                  Upcoming Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/events?category=Hackathon" className="hover:text-indigo-400 transition-colors">
                  National Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="hover:text-indigo-400 transition-colors">
                  Technical Workshops
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="hover:text-indigo-400 transition-colors">
                  Clubs & Societies Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Governance & Policies
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Club Lead Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Support Desk */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Help & Verification Desk
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions regarding registration passes, room assignments, or event hosting?
            </p>
            <div className="pt-1">
              <a
                href="mailto:support@campusconnect.edu"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                support@campusconnect.edu
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. All university rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
