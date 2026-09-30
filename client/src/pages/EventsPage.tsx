import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { Event } from '../types/index.js';
import { eventService } from '../services/eventService.js';
import { EventCard } from '../components/events/EventCard.js';
import { EventFilters } from '../components/events/EventFilters.js';
import { CardSkeleton } from '../components/common/Loader.js';
import { RegistrationModal } from '../components/events/RegistrationModal.js';
import { RegistrationSuccessModal } from '../components/events/RegistrationSuccessModal.js';
import { RegistrationSuccessResponse } from '../services/registrationService.js';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [club, setClub] = useState(searchParams.get('club') || 'All');
  const [timeframe, setTimeframe] = useState<'upcoming' | 'past' | 'all'>(
    (searchParams.get('timeframe') as any) || 'upcoming'
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'date-asc');

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedEventForReg, setSelectedEventForReg] = useState<Event | null>(null);
  const [regSuccessData, setRegSuccessData] = useState<RegistrationSuccessResponse['data'] | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await eventService.getEvents({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        club: club !== 'All' ? club : undefined,
        timeframe,
        sort,
        limit: 50,
      });

      setEvents(res.data);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Unable to load events. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Sync state with URL params
    const newParams: Record<string, string> = {};
    if (search) newParams.search = search;
    if (category !== 'All') newParams.category = category;
    if (club !== 'All') newParams.club = club;
    if (timeframe !== 'upcoming') newParams.timeframe = timeframe;
    if (sort !== 'date-asc') newParams.sort = sort;
    setSearchParams(newParams, { replace: true });
  }, [search, category, club, timeframe, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setClub('All');
    setTimeframe('upcoming');
    setSort('date-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            University Event Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Explore Campus Events
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Browse and register for upcoming campus events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-tech-surface border border-slate-700/60 text-xs font-medium text-slate-300">
            Showing <span className="text-indigo-300 font-semibold">{events.length}</span> events
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <EventFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        sort={sort}
        onSortChange={setSort}
        onReset={handleResetFilters}
      />

      {/* Events Listing Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl bg-rose-950/30 border border-rose-800/40 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">Failed to load events</h3>
          <p className="text-xs text-rose-300/90">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegisterClick={(ev) => setSelectedEventForReg(ev)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-xl bg-tech-surface border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">No matching events found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any events matching your current filters. Try changing your search query or selecting a different category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {selectedEventForReg && (
        <RegistrationModal
          event={selectedEventForReg}
          isOpen={!!selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
          onSuccess={(data) => {
            setRegSuccessData(data);
            setEvents((prev) =>
              prev.map((e) =>
                e._id === selectedEventForReg._id
                  ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
                  : e
              )
            );
          }}
        />
      )}

      {/* Registration Success Modal */}
      {regSuccessData && (
        <RegistrationSuccessModal
          data={regSuccessData}
          isOpen={!!regSuccessData}
          onClose={() => setRegSuccessData(null)}
        />
      )}
    </div>
  );
};
