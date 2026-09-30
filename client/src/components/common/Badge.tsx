import React from 'react';
import { getCategoryStyles } from '../../utils/formatters.js';

interface BadgeProps {
  label: string;
  variant?: 'category' | 'status' | 'outline' | 'solid';
  status?: 'published' | 'draft' | 'completed' | 'cancelled' | 'Confirmed' | 'Waitlisted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'category',
  status,
  className = '',
}) => {
  if (variant === 'status') {
    let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
    let dotColor = 'bg-slate-400';

    if (status === 'published' || status === 'Confirmed') {
      colorClass = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
      dotColor = 'bg-emerald-400';
    } else if (status === 'draft' || status === 'Waitlisted') {
      colorClass = 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      dotColor = 'bg-amber-400';
    } else if (status === 'cancelled') {
      colorClass = 'bg-rose-950/70 text-rose-300 border-rose-800/80';
      dotColor = 'bg-rose-400';
    } else if (status === 'completed') {
      colorClass = 'bg-slate-800/80 text-slate-400 border-slate-700';
      dotColor = 'bg-slate-500';
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5 shrink-0`} />
        {label}
      </span>
    );
  }

  const categoryStyles = getCategoryStyles(label);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${categoryStyles.bg} ${className}`}
    >
      {label}
    </span>
  );
};
