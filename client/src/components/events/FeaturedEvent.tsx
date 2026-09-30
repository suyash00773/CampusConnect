import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Award, ArrowRight } from 'lucide-react';
import { Event } from '../../types/index.js';
import { Badge } from '../common/Badge.js';
import { formatEventDate, getDaysRemainingBadge } from '../../utils/formatters.js';

interface FeaturedEventProps {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}

export const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event, onRegisterClick }) => {
  const remaining = getDaysRemainingBadge(event.date);
  const clubObj = typeof event.club === 'object' ? event.club : null;
  const clubName = clubObj ? clubObj.name : 'Campus Society';
  const spotsLeft = Math.max(0, (event.capacity || 100) - (event.registeredCount || 0));

  return (
    <div className="rounded-xl border border-slate-800 bg-tech-surface p-6 sm:p-8 shadow-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Image Banner */}
        <div className="lg:col-span-5 relative rounded-lg overflow-hidden border border-slate-800 aspect-[16/10] lg:aspect-auto lg:h-[340px] bg-slate-950">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              Editor's Spotlight
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-900/90 text-slate-200 border border-slate-700">
              {remaining.text}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <Badge label={event.category} />
          </div>
        </div>

        {/* Right Column: Editorial & Event Data */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            {/* Host Club Tag */}
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-1">
              <span>Hosted by</span>
              <span className="font-semibold text-slate-200">{clubName}</span>
            </div>

            {/* Event Title */}
            <Link to={`/events/${event.slug || event._id}`} className="block group">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors leading-tight">
                {event.title}
              </h2>
            </Link>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
              {event.shortDescription || event.description}
            </p>

            {/* Event Info Metrics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 p-3.5 rounded-lg bg-tech-card border border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Date</div>
                  <div className="text-xs font-semibold text-white">
                    {formatEventDate(event.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Time</div>
                  <div className="text-xs font-semibold text-white">{event.startTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Seats</div>
                  <div className="text-xs font-semibold text-emerald-400">
                    {spotsLeft} of {event.capacity} left
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Tag */}
            <div className="flex items-center gap-2 mt-3.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{event.venue}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                {event.locationType}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Register for Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to={`/events/${event.slug || event._id}`}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-center transition-colors"
            >
              Full Schedule & Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
