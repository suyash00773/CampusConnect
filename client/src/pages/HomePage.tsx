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
    <div className="bg-ivory min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-ivory pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tagline with green dot */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-light">
              YOUR CAMPUS. YOUR PEOPLE. YOUR NEXT THING.
            </span>
          </div>

          {/* Massive serif headline with inline photo */}
          <h1 className="font-display text-hero text-ink mb-10 leading-tight">
            College life,<br />
            with <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=80&fit=crop" alt="students" className="inline-block w-24 h-14 sm:w-32 sm:h-16 lg:w-40 lg:h-20 object-cover rounded-full align-middle mx-1" /> more<br />
            <em className="text-green italic">possibility.</em>
          </h1>

          {/* Subtitle + CTAs row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-md space-y-6">
              <p className="text-base text-ink-light leading-relaxed">
                Find your people. Build something new.<br />
                Discover events and communities at<br />
                ABES Engineering College.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/events" className="btn-green text-ink">
                  Find your next event <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/clubs" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-green transition-colors">
                  Meet the clubs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink-faint leading-relaxed">
                A LITTLE CURIOSITY.<br />A LOT OF POSSIBILITY.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleHeroSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 p-2 bg-cream rounded-2xl border border-border">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
              <input 
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent text-sm text-ink placeholder-ink-faint focus:outline-none" 
                placeholder="What are you curious about? Coding, design, hackathons..." 
              />
            </div>
            <button type="submit" className="btn-green text-ink">
              Search events <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Curved transition */}
      <div className="h-12 bg-cream" style={{ borderRadius: '40px 40px 0 0' }} />

      <div className="bg-cream">
        {/* 2. HOW IT WORKS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-light">
              MADE FOR CAMPUS LIFE
            </span>
          </div>
          
          <div className="mb-12">
            <h2 className="font-display text-section text-ink leading-tight">
              Good things happen when they <em className="font-display italic text-green">show up.</em>
            </h2>
            <p className="text-ink-light mt-4 max-w-xl text-lg">
              Simple, reliable event management for our campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { num: '01', title: 'Find your event', desc: 'Browse hackathons, workshops, and talks happening on campus.' },
              { num: '02', title: 'Register instantly', desc: 'One-click signup with your college email. Get a verified digital pass.' },
              { num: '03', title: 'Show up and connect', desc: 'Meet your people, build your skills, and grow your network.' }
            ].map(step => (
              <div key={step.num} className="space-y-4">
                <div className="text-4xl font-bold text-green">{step.num}</div>
                <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
                <p className="text-ink-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FEATURED EVENT SECTION */}
        {featuredEvent && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-light">
                DON'T MISS THIS
              </span>
            </div>

            <div className="bg-white rounded-card shadow-card overflow-hidden border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredEvent.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80'}
                    alt={featuredEvent.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-cream text-ink text-xs font-semibold px-3 py-1 rounded-pill">
                      {featuredEvent.category}
                    </span>
                    <span className="text-sm font-semibold text-ink-light">
                      by {typeof featuredEvent.club === 'object' ? featuredEvent.club.name : 'ABES Technical Club'}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-4xl text-ink mb-4 leading-tight">
                    {featuredEvent.title}
                  </h3>
                  
                  <p className="text-ink-light mb-8 leading-relaxed">
                    {featuredEvent.description || featuredEvent.shortDescription}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-ink">
                      <Calendar className="w-5 h-5 text-green" />
                      <span className="font-semibold">{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink">
                      <Clock className="w-5 h-5 text-green" />
                      <span className="font-semibold">{featuredEvent.startTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink">
                      <MapPin className="w-5 h-5 text-green" />
                      <span className="font-semibold">{featuredEvent.venue}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-auto">
                    <button
                      onClick={() => setSelectedEventForReg(featuredEvent)}
                      className="btn-green text-ink"
                    >
                      Register Free Pass
                    </button>
                    <Link
                      to={`/events/${featuredEvent.slug || featuredEvent._id}`}
                      className="inline-flex items-center gap-2 font-semibold text-ink hover:text-green transition-colors"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="h-12 bg-ivory" style={{ borderRadius: '40px 40px 0 0', marginTop: '-40px', position: 'relative', zIndex: 10 }} />

      {/* 4. UPCOMING EVENTS SECTION */}
      <section className="bg-ivory pb-16 lg:pb-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-light">
                  UNIVERSITY SCHEDULE
                </span>
              </div>
              <h2 className="font-display text-section text-ink leading-tight">
                Your next <em className="font-display italic text-green">"I'm in."</em>
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-semibold text-ink hover:text-green transition-colors"
            >
              Browse Full Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-pill text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-green text-ink'
                      : 'bg-cream text-ink-light border border-border hover:border-ink/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                value={eventSearchQuery}
                onChange={(e) => setEventSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green"
              />
            </div>
          </div>

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
            <div className="text-center py-16 rounded-card bg-cream border border-border">
              <Calendar className="w-10 h-10 text-ink-faint mx-auto mb-3" />
              <h3 className="text-lg font-bold text-ink">No events found</h3>
              <p className="text-ink-light mt-1">
                Try adjusting your category filter or keyword query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setEventSearchQuery('');
                }}
                className="mt-4 px-6 py-2 rounded-pill bg-ink text-ivory text-sm font-semibold transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. CLUBS SECTION */}
      <section className="bg-cream py-16 lg:py-24" style={{ borderRadius: '40px 40px 0 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-light">
                  STUDENT ORGANIZATIONS
                </span>
              </div>
              <h2 className="font-display text-section text-ink leading-tight">
                A shared interest.<br />
                A whole <em className="font-display italic text-green">new circle.</em>
              </h2>
            </div>
            <Link
              to="/clubs"
              className="inline-flex items-center gap-2 font-semibold text-ink hover:text-green transition-colors"
            >
              View All Chapters ({clubs.length || 6}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(clubs.length > 0 ? clubs.slice(0, 6) : (MOCK_CLUBS as unknown as Club[])).map((club) => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="bg-cream pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-card bg-ivory border border-border p-12 lg:p-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-ink flex items-center justify-center overflow-hidden mx-auto mb-8">
              <img
                src="/abes-logo.png"
                alt="ABES Engineering College"
                className="h-14 w-auto object-contain object-left"
              />
            </div>
            <h2 className="font-display text-section text-ink leading-tight mb-6">
              Your campus.<br />Your next chapter.
            </h2>
            <p className="text-lg text-ink-light max-w-2xl mx-auto mb-10">
              Join engineers, designers, and innovators accelerating their tech careers through campus hackathons and collegiate societies.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/events" className="btn-green text-ink">
                Browse Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/clubs" className="btn-outline">
                Join A Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODALS */}
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
