import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-tech-bg text-tech-text pb-20">
      {/* Hero Header */}
      <section className="border-b border-slate-800 bg-tech-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-tech-card border border-slate-700 text-xs font-semibold text-slate-300">
            <img src="/abes-logo.png" alt="ABES Engineering College" className="h-5 w-auto object-contain" />
            <span>ABES Engineering College, Ghaziabad (UP)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About CampusConnect
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A centralized platform for managing student events and club registrations.
          </p>
        </div>
      </section>

      {/* Main Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-tech-card text-blue-400 w-fit border border-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Student Clubs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore and join various active student-led technical and cultural clubs on campus.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-tech-card text-cyan-400 w-fit border border-slate-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Event Registration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Easily register for upcoming events and track your participation history.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-tech-card text-purple-400 w-fit border border-slate-700">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Digital Passes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive digital entry passes and track your check-ins for campus events.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Ready to join a chapter or attend an event?</h3>
          <div className="flex justify-center gap-3">
            <Link
              to="/events"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/clubs"
              className="px-5 py-2.5 rounded-xl bg-tech-surface hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700"
            >
              <span>View Chapters</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
