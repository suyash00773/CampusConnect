import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  Award,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { Event, Club } from '../types/index.js';
import { eventService } from '../services/eventService.js';
import { clubService } from '../services/clubService.js';
import { EventCard } from '../components/events/EventCard.js';
import { ClubCard } from '../components/clubs/ClubCard.js';
import { RegistrationModal } from '../components/events/RegistrationModal.js';
import { RegistrationSuccessModal } from '../components/events/RegistrationSuccessModal.js';
import { CardSkeleton } from '../components/common/Loader.js';
import { RegistrationSuccessResponse } from '../services/registrationService.js';
import { MOCK_CLUBS, MOCK_EVENTS, EventData } from '../data/mockData.js';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [featuredEvent, setFeaturedEvent] = useState<Event | EventData | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<(Event | EventData)[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state for Upcoming Events section
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');

  // Registration modal states
  const [selectedEventForReg, setSelectedEventForReg] = useState<Event | EventData | null>(null);
  const [regSuccessData, setRegSuccessData] = useState<RegistrationSuccessResponse['data'] | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, eventsRes, clubsRes] = await Promise.all([
          eventService.getFeaturedEvents().catch(() => ({ featured: null })),
          eventService.getEvents({ timeframe: 'upcoming', limit: 8, sort: 'date-asc' }).catch(() => ({ data: [] })),
          clubService.getClubs().catch(() => []),
        ]);

        // Prioritize TechFest 2026 or API featured event
        const tf = MOCK_EVENTS.find((e) => e._id === 'event-techfest-2026') || MOCK_EVENTS[0];
        setFeaturedEvent(featuredRes.featured || tf);

        // Fall back to MOCK_EVENTS if backend returned empty
        const eventList = eventsRes.data && eventsRes.data.length > 0 ? eventsRes.data : MOCK_EVENTS;
        setUpcomingEvents(eventList);

        // Fall back to MOCK_CLUBS if backend returned empty
        const clubList = clubsRes && clubsRes.length > 0 ? clubsRes : (MOCK_CLUBS as unknown as Club[]);
        setClubs(clubList);
      } catch (err) {
        console.error('Failed to load homepage data, using mock fallback:', err);
        setFeaturedEvent(MOCK_EVENTS[0]);
        setUpcomingEvents(MOCK_EVENTS);
        setClubs(MOCK_CLUBS as unknown as Club[]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/events?search=${encodeURIComponent(tag)}`);
  };

  // Filtered upcoming events
  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((ev) => {
      const matchCat =
        selectedCategory === 'All' ||
        ev.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'AI & ML' && (ev.category.includes('AI') || ev.category.includes('ML')));

      const matchSearch =
        !eventSearchQuery.trim() ||
        ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(eventSearchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [upcomingEvents, selectedCategory, eventSearchQuery]);

  const categories = ['All', 'Coding', 'AI & ML', 'Hackathons', 'Robotics', 'Design', 'Cultural'];

  return (
    <div className="space-y-20 pb-20 bg-tech-bg text-tech-text">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Institution Badge with Official ABES Logo */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-tech-surface border border-slate-800">
                <img
                  src="/abes-logo.png"
                  alt="ABES Engineering College"
                  className="h-6 w-auto object-contain"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold tracking-wide text-slate-300">
                  ABES ENGINEERING COLLEGE
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                Where College{' '}
                <span className="text-cyan-400">
                  Ideas
                </span>{' '}
                <span className="text-blue-400">
                  Come to Life
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-medium">
                Connect with coding clubs, technical societies, hackathons, and innovative projects at ABES Engineering College. Instant verified digital passes with zero duplicate registration hassles.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleHeroSearchSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl p-1.5 rounded-xl bg-tech-surface border border-slate-800"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by event, hackathon, or club..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="text-slate-500 font-mono">Quick browse:</span>
                {['#Hackathon', '#CodeChef', '#WebDev', '#Robotics', '#AI/ML'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag.replace('#', ''))}
                    className="px-2.5 py-1 rounded-md bg-tech-card hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to="/events"
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/clubs"
                  className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm border border-slate-700 flex items-center gap-2 transition-colors"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Discover Clubs</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-lg bg-tech-surface overflow-hidden border border-slate-800">
                {/* Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80"
                    alt="ABES Campus Tech Fest"
                    className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tech-surface via-tech-surface/30 to-transparent" />

                  {/* Live Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-slate-700 text-xs font-semibold text-white">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>LIVE ON CAMPUS</span>
                  </div>
                </div>

                {/* Spotlight Banner Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                      Upcoming Highlight
                    </span>
                    <span className="text-xs font-mono text-slate-400">Oct 24-25, 2026</span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">
                    TechFest 2026: 36-Hour Hackathon & AI Summit
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2">
                    Join collegiate developers at Bhabha Auditorium. Solve real problems, win prizes, and get mentorship from top tech architects.
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Bhabha Auditorium, ABESEC</span>
                    </div>
                    <Link
                      to="/events/techfest-2026"
                      className="font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENT SECTION */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-medium text-cyan-400 flex items-center gap-1.5">
                Featured Event
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                Spotlight on Campus
              </h2>
            </div>
            <Link
              to="/events"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative rounded-lg bg-tech-surface border border-slate-800 hover:border-slate-700 overflow-hidden transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Event Image Banner */}
              <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full bg-slate-950 overflow-hidden">
                <img
                  src={featuredEvent.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80'}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tech-surface via-transparent to-black/60 lg:bg-gradient-to-r lg:from-transparent lg:to-tech-surface" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                    Annual Flagship
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/70 text-cyan-300 border border-slate-700">
                    {featuredEvent.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-purple-400 font-medium">Organized by:</span>
                    <span className="text-white font-medium">
                      {typeof featuredEvent.club === 'object' ? featuredEvent.club.name : 'ABES Technical Club'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {featuredEvent.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {featuredEvent.description || featuredEvent.shortDescription}
                  </p>

                  {/* Meta Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-tech-card border border-slate-800">
                      <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400">Date</div>
                        <div className="font-medium text-white truncate">{featuredEvent.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-tech-card border border-slate-800">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400">Timing</div>
                        <div className="font-medium text-white truncate">{featuredEvent.startTime}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-tech-card border border-slate-800 col-span-2 sm:col-span-1">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400">Venue</div>
                        <div className="font-medium text-white truncate">{featuredEvent.venue}</div>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Meter */}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-400">Live Registration Spots</span>
                      <span className="text-cyan-400 font-medium">
                        {featuredEvent.registeredCount || 382} / {featuredEvent.capacity || 500} registered
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((featuredEvent.registeredCount || 382) / (featuredEvent.capacity || 500)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForReg(featuredEvent)}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Register Free Pass</span>
                  </button>

                  <Link
                    to={`/events/${featuredEvent.slug || featuredEvent._id}`}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Full Schedule & Mentors</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. EXPLORE CLUBS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-sm font-medium text-purple-400">
              Student Organizations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Explore Campus Chapters
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Join recognized technical societies at ABES, collaborate on real-world projects, and participate in hackathons.
            </p>
          </div>

          <Link
            to="/clubs"
            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Chapters ({clubs.length || 6})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Clubs in 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(clubs.length > 0 ? clubs.slice(0, 6) : (MOCK_CLUBS as unknown as Club[])).map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      </section>

      {/* 4. UPCOMING EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-sm font-medium text-cyan-400">
              University Schedule
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Upcoming Events & Hackathons
            </h2>
          </div>

          <Link
            to="/events"
            className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Browse Full Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-tech-surface text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search inside Section */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={eventSearchQuery}
              onChange={(e) => setEventSearchQuery(e.target.value)}
              placeholder="Filter current view..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-tech-surface border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, 6).map((event) => (
              <EventCard
                key={event._id}
                event={event as Event}
                onRegisterClick={(ev) => setSelectedEventForReg(ev)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg bg-tech-surface border border-slate-800">
            <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No events found matching your criteria</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your category filter or keyword query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setEventSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-800 bg-tech-surface p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              How it works
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Simple, reliable event management for our campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Digital event passes',
                description: 'Get unique registration IDs with scannable QR verification instantly.',
                icon: ShieldCheck,
                color: 'text-cyan-400',
              },
              {
                title: 'One registration per student',
                description: 'Strict student ID validation ensures fair access to limited seating.',
                icon: CheckCircle2,
                color: 'text-indigo-400',
              },
              {
                title: 'Real-time availability',
                description: 'Live seat indicators automatically freeze registrations when venues are full.',
                icon: Clock,
                color: 'text-amber-400',
              },
              {
                title: 'Club profiles',
                description: 'Find official faculty coordinators and verified student leadership rosters.',
                icon: Award,
                color: 'text-purple-400',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-lg bg-tech-card border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className={`p-2.5 rounded-lg bg-tech-surface border border-slate-700/60 w-fit ${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-medium text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden p-8 sm:p-14 text-center border border-slate-800 bg-tech-surface">
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Find events and clubs at ABES
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Join engineers, designers, and innovators accelerating their tech careers through campus hackathons and collegiate societies.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/events"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <span>Browse All Upcoming Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/clubs"
                className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Join A Club Today</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      {selectedEventForReg && (
        <RegistrationModal
          event={selectedEventForReg as Event}
          isOpen={!!selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
          onSuccess={(data) => {
            setRegSuccessData(data);
            setUpcomingEvents((prev) =>
              prev.map((e) =>
                e._id === selectedEventForReg._id
                  ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
                  : e
              )
            );
          }}
        />
      )}

      {/* REGISTRATION SUCCESS MODAL (Digital Pass with ABES Logo & Barcode) */}
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
