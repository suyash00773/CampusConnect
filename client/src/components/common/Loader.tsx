import React from 'react';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ label = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-green/20 border-t-green animate-spin`}
      />
      {label && <p className="text-sm font-medium text-ink-light">{label}</p>}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-card bg-cream border border-border-light p-5 space-y-4 animate-pulse">
      <div className="h-48 w-full bg-sand rounded-card" />
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-sand rounded" />
        <div className="h-6 w-3/4 bg-sand rounded" />
        <div className="h-4 w-full bg-sand rounded" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-4 w-1/3 bg-sand rounded" />
        <div className="h-8 w-24 bg-sand rounded-pill" />
      </div>
    </div>
  );
};
