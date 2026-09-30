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
    let colorClass = 'bg-cream text-ink border-border';
    let dotColor = 'bg-ink-light';

    if (status === 'published' || status === 'Confirmed') {
      colorClass = 'bg-green-light text-green border-green/20';
      dotColor = 'bg-green';
    } else if (status === 'draft' || status === 'Waitlisted') {
      colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
    } else if (status === 'cancelled') {
      colorClass = 'bg-red-50 text-red-700 border-red-200';
      dotColor = 'bg-red-500';
    } else if (status === 'completed') {
      colorClass = 'bg-cream text-ink-light border-border';
      dotColor = 'bg-ink-faint';
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold border ${colorClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5 shrink-0`} />
        {label}
      </span>
    );
  }

  // Assuming getCategoryStyles gives bg colors which we might ignore or override. 
  // For editorial, category badges are bg-cream text-ink.
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill text-[11px] font-semibold border bg-cream text-ink border-border ${className}`}
    >
      {label}
    </span>
  );
};
