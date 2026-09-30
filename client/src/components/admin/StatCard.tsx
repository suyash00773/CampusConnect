import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'purple' | 'blue' | 'emerald' | 'amber' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
}) => {
  const colorStyles: Record<string, { iconBg: string }> = {
    purple: {
      iconBg: 'bg-indigo-950/70 border-indigo-700/40 text-indigo-400',
    },
    indigo: {
      iconBg: 'bg-indigo-950/70 border-indigo-700/40 text-indigo-400',
    },
    blue: {
      iconBg: 'bg-blue-950/70 border-blue-700/40 text-blue-400',
    },
    emerald: {
      iconBg: 'bg-emerald-950/70 border-emerald-700/40 text-emerald-400',
    },
    amber: {
      iconBg: 'bg-amber-950/70 border-amber-700/40 text-amber-400',
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-tech-surface/80 flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="text-2xl font-bold text-white mt-0.5 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-normal">{subtitle}</p>
        )}
      </div>

      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${style.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
