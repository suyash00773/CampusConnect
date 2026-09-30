import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'purple' | 'blue' | 'emerald' | 'amber' | 'indigo' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color, // kept for prop compat, ignoring for design
}) => {
  return (
    <div className="p-6 rounded-card border border-border bg-white flex items-center justify-between shadow-subtle hover:shadow-card transition-shadow">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-light">
          {title}
        </span>
        <div className="text-3xl font-display font-bold text-ink mt-1 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-ink-light mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center shrink-0 bg-cream">
        <Icon className="w-6 h-6 text-ink" />
      </div>
    </div>
  );
};
