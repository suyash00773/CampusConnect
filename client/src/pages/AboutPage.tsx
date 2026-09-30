import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-ivory text-ink pb-20 min-h-screen">
      {/* Hero Header */}
      <section className="border-b border-border bg-white py-16 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-pill bg-cream border border-border text-xs font-semibold text-ink-light">
            <img src="/abes-logo.png" alt="ABES Engineering College" className="h-5 w-auto object-contain" />
            <span>ABES Engineering College, Ghaziabad (UP)</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-ink tracking-tight">
            About CampusConnect
          </h1>

          <p className="text-sm sm:text-base text-ink-light max-w-2xl mx-auto leading-relaxed">
            A centralized platform for managing student events and club registrations.
          </p>
        </div>
      </section>

      {/* Main Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-card bg-cream border border-border space-y-4">
            <div className="p-3 rounded-full bg-white text-green w-fit border border-border shadow-subtle">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Student Clubs</h3>
            <p className="text-sm text-ink-light leading-relaxed">
              Explore and join various active student-led technical and cultural clubs on campus.
            </p>
          </div>

          <div className="p-8 rounded-card bg-cream border border-border space-y-4">
            <div className="p-3 rounded-full bg-white text-green w-fit border border-border shadow-subtle">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Event Registration</h3>
            <p className="text-sm text-ink-light leading-relaxed">
              Easily register for upcoming events and track your participation history.
            </p>
          </div>

          <div className="p-8 rounded-card bg-cream border border-border space-y-4">
            <div className="p-3 rounded-full bg-white text-green w-fit border border-border shadow-subtle">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Digital Passes</h3>
            <p className="text-sm text-ink-light leading-relaxed">
              Receive digital entry passes and track your check-ins for campus events.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 pt-8">
          <h3 className="font-display text-3xl text-ink">Ready to join a chapter or attend an event?</h3>
          <div className="flex justify-center gap-4">
            <Link
              to="/events"
              className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink font-semibold text-sm flex items-center gap-1.5 shadow-subtle"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/clubs"
              className="px-6 py-3 rounded-pill bg-transparent hover:bg-cream text-ink font-semibold text-sm border border-border"
            >
              <span>View Chapters</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
