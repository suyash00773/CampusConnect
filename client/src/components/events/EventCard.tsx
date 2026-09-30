import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '../../types/index.js';
import { Badge } from '../common/Badge.js';
import { formatShortDate, getDaysRemainingBadge } from '../../utils/formatters.js';

interface EventCardProps {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  const shortDate = formatShortDate(event.date);
  const remainingBadge = getDaysRemainingBadge(event.date);
  const clubObj = typeof event.club === 'object' ? event.club : null;
  const clubName = clubObj ? clubObj.name : 'Campus Club';
  const clubLogo = clubObj ? clubObj.logoUrl : '';

  const spotsLeft = Math.max(0, (event.capacity || 100) - (event.registeredCount || 0));
  const isFull = spotsLeft === 0;
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
  );

  return (
    <article className="group flex flex-col rounded-xl bg-tech-surface border border-slate-800/90 overflow-hidden hover:border-slate-700 hover:shadow-card transition-all duration-200">
      {/* Banner Media with Date Badge */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-surface via-tech-surface/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge label={event.category} />
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${
              remainingBadge.urgent
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                : 'bg-slate-900/90 text-slate-300 border-slate-750'
            }`}
          >
            {remainingBadge.text}
          </span>
        </div>

        {/* Calendar Stamp */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/95 px-2.5 py-1 rounded-md border border-slate-800 shadow-sm">
          <div className="text-center pr-2 border-r border-slate-700/80">
            <span className="text-[9px] uppercase font-bold text-indigo-400 block leading-tight">
              {shortDate.month}
            </span>
            <span className="text-sm font-extrabold text-white leading-tight">
              {shortDate.day}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{event.startTime}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Organizing Club Reference */}
          <div className="flex items-center gap-2 mb-2">
            {clubLogo ? (
              <img
                src={clubLogo}
                alt={clubName}
                className="w-4 h-4 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-300">
                {clubName.charAt(0)}
              </div>
            )}
            <span className="text-xs text-slate-400 truncate max-w-[200px]">
              {clubName}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.slug || event._id}`} className="block group-hover:text-indigo-300 transition-colors">
            <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
              {event.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Venue & Mode */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700 shrink-0">
              {event.locationType}
            </span>
          </div>
        </div>

        {/* Bottom Section: Capacity + Action Buttons */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-slate-500" />
                Capacity
              </span>
              <span className={`font-semibold ${isFull ? 'text-rose-400' : 'text-slate-300'}`}>
                {isFull ? 'Sold Out' : `${spotsLeft} of ${event.capacity} left`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : percentFilled > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.slug || event._id}`}
              className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              disabled={isFull}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                isFull
                  ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              <span>{isFull ? 'Sold Out' : 'Register'}</span>
              {!isFull && <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
