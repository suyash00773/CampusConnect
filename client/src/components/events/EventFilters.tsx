import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { EventCategory } from '../../types/index.js';

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  timeframe: 'upcoming' | 'past' | 'all';
  onTimeframeChange: (value: 'upcoming' | 'past' | 'all') => void;
  sort: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Hackathon',
  'Technical',
  'Workshop',
  'Cultural',
  'Sports',
  'Seminar',
  'Social',
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeframe,
  onTimeframeChange,
  sort,
  onSortChange,
  onReset,
}) => {
  const isFiltered = search || category !== 'All' || timeframe !== 'all' || sort !== 'date-asc';

  return (
    <div className="space-y-3.5 bg-tech-surface p-4 rounded-xl border border-slate-800">
      {/* Top Controls: Search, Timeframe, Sort */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, topics, venue or tags..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Timeframe & Sort Selectors */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Segmented Timeframe Control */}
          <div className="flex items-center rounded-lg bg-tech-card border border-slate-700/80 p-0.5 text-xs">
            <button
              onClick={() => onTimeframeChange('upcoming')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === 'upcoming'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onTimeframeChange('past')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === 'past'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => onTimeframeChange('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-tech-card border border-slate-700/80 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="date-asc">Date: Earliest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="popular">Most Popular</option>
            <option value="capacity">Largest Capacity</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1 uppercase tracking-wider">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          Filter:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition-colors ${
              category === cat
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-tech-card text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
