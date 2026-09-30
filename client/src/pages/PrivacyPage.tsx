import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-ink-light">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-light hover:text-ink bg-cream px-3 py-1.5 rounded-lg border border-border transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-ink-light mt-1">Last revised: September 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">1. Information We Collect</h2>
          <p>
            When registering for an event, we collect your name, email address, college affiliation, year, and phone number to verify your student status and send your entry pass.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">2. How Your Data Is Used</h2>
          <p>
            Your information is accessible to the event organizers and administrators for:
          </p>
          <ul className="list-disc list-inside space-y-1 text-ink-light pl-2">
            <li>Generating your digital entry pass.</li>
            <li>In-person check-in at the venue.</li>
            <li>Important event updates and notifications.</li>
            <li>Issuing participation certificates.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">3. Information Sharing</h2>
          <p>
            We do not sell or monetize your personal information. Attendance records are only kept for administrative purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink">4. Data Deletion</h2>
          <p>
            If you cancel your registration, your information is removed from the active event roster and your spot is released.
          </p>
        </section>
      </div>
    </div>
  );
};
