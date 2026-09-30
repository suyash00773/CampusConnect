import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-12 h-12 rounded-lg bg-tech-surface border border-slate-700/80 flex items-center justify-center text-indigo-400 mx-auto">
        <Compass className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The campus link you're trying to reach doesn't exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
      >
        <span>Return to Homepage</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
