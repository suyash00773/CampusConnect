import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-300">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-tech-surface px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400 mt-1">Last revised: September 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Event Registration & Eligibility</h2>
          <p>
            CampusConnect is for managing college events and club activities. Registrations are open to all enrolled college students with a valid ID.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Registration Policy</h2>
          <p>
            Students may register once per event using their email address. Registrations cannot be transferred to others without approval.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Capacity Limits</h2>
          <p>
            Events have maximum capacity limits. You must present your entry pass and college ID when attending an event.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Club Responsibilities</h2>
          <p>
            Student clubs must provide accurate event details and notify participants of any changes or cancellations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">5. Code of Conduct</h2>
          <p>
            All participants must follow the university's code of conduct and safety guidelines during events and club activities.
          </p>
        </section>
      </div>
    </div>
  );
};
