import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-cream pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border-light">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ink flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/abes-logo.png"
                  alt="ABES Engineering College"
                  className="h-9 w-auto object-contain object-left"
                />
              </div>
            </Link>
            <div className="text-xs font-semibold text-ink uppercase tracking-wider">
              CampusConnect Event Platform
            </div>
            <p className="text-sm text-ink-light leading-relaxed">
              Event registration and club management for ABES Engineering College.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Campus Events
            </h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li>
                <Link to="/events" className="hover:text-ink transition-colors">
                  Upcoming Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/events?category=Hackathon" className="hover:text-ink transition-colors">
                  National Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="hover:text-ink transition-colors">
                  Technical Workshops
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="hover:text-ink transition-colors">
                  Clubs & Societies Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li>
                <Link to="/terms" className="hover:text-ink transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-ink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-ink transition-colors">
                  Club Lead Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Support Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Help & Verification Desk
            </h4>
            <p className="text-sm text-ink-light leading-relaxed">
              Have questions regarding registration passes, room assignments, or event hosting?
            </p>
            <div className="pt-1">
              <a
                href="mailto:support@campusconnect.edu"
                className="inline-flex items-center text-sm text-ink hover:text-ink-light font-medium transition-colors"
              >
                support@campusconnect.edu
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-faint gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. All university rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
