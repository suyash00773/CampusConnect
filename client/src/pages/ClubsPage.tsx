import React, { useEffect, useState } from 'react';
import { Search, Users, AlertCircle } from 'lucide-react';
import { Club } from '../types/index.js';
import { clubService } from '../services/clubService.js';
import { ClubCard } from '../components/clubs/ClubCard.js';
import { Loader } from '../components/common/Loader.js';

export const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clubService.getClubs();
        setClubs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load clubs.');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const categories = ['All', ...Array.from(new Set(clubs.map((c) => c.category)))];

  const filteredClubs = clubs.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Student Societies
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Campus Clubs & Organizations
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Explore and join active student clubs, societies, and organizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-lg bg-tech-surface border border-slate-700/60 text-xs font-medium text-slate-300">
            Total Clubs: <span className="text-indigo-300 font-semibold">{clubs.length}</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-tech-surface border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name, field or description..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-tech-bg border border-slate-700/70 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-tech-bg text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <Loader label="Loading clubs directory..." size="lg" />
      ) : error ? (
        <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-800/40 text-center max-w-md mx-auto space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Failed to load clubs</h3>
          <p className="text-xs text-rose-300/90">{error}</p>
        </div>
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl bg-tech-surface border border-slate-800 space-y-3">
          <Users className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No clubs found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
        </div>
      )}
    </div>
  );
};
