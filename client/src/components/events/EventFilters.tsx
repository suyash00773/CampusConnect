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
    <div className="space-y-3.5 bg-cream p-4 rounded-2xl border border-border">
      {/* Top Controls: Search, Timeframe, Sort */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, topics, venue or tags..."
            className="w-full pl-9 pr-8 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Timeframe & Sort Selectors */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Segmented Timeframe Control */}
          <div className="flex items-center rounded-xl bg-ivory border border-border p-1 text-sm">
            <button
              onClick={() => onTimeframeChange('upcoming')}
              className={`px-4 py-1.5 rounded-pill font-medium transition-colors ${
                timeframe === 'upcoming'
                  ? 'bg-ink text-ivory font-semibold'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onTimeframeChange('past')}
              className={`px-4 py-1.5 rounded-pill font-medium transition-colors ${
                timeframe === 'past'
                  ? 'bg-ink text-ivory font-semibold'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => onTimeframeChange('all')}
              className={`px-4 py-1.5 rounded-pill font-medium transition-colors ${
                timeframe === 'all'
                  ? 'bg-ink text-ivory font-semibold'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              All
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-ivory border border-border text-sm font-medium text-ink focus:outline-none focus:border-green cursor-pointer"
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
              className="px-3 py-2.5 rounded-xl bg-cream hover:bg-sand text-sm font-medium text-ink border border-border transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar">
        <span className="text-[11px] font-semibold text-ink-light flex items-center gap-1 shrink-0 mr-1 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-ink-faint" />
          Filter:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-pill text-xs shrink-0 transition-colors ${
              category === cat
                ? 'bg-green text-ink font-semibold'
                : 'bg-ivory text-ink-light hover:text-ink border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
