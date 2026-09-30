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
    <article className="group flex flex-col bg-white rounded-card border border-border overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
      {/* Banner Media with Date Badge */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-ivory">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover rounded-t-card group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge label={event.category} />
          <span
            className={`px-2 py-0.5 rounded-pill text-[10px] font-semibold tracking-wide border ${
              remainingBadge.urgent
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-cream text-ink border-border'
            }`}
          >
            {remainingBadge.text}
          </span>
        </div>

        {/* Calendar Stamp */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border shadow-subtle">
          <div className="text-center pr-2 border-r border-border-light">
            <span className="text-[9px] uppercase font-bold text-green block leading-tight tracking-wider">
              {shortDate.month}
            </span>
            <span className="text-sm font-extrabold text-ink leading-tight">
              {shortDate.day}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-ink-light font-medium">
            <Clock className="w-3 h-3 text-ink-faint" />
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
                className="w-4 h-4 rounded-full object-cover border border-border-light"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-cream flex items-center justify-center text-[9px] font-bold text-ink-light">
                {clubName.charAt(0)}
              </div>
            )}
            <span className="text-xs text-ink-light truncate max-w-[200px] font-medium">
              {clubName}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.slug || event._id}`} className="block group-hover:text-green transition-colors">
            <h3 className="text-base font-semibold text-ink leading-snug line-clamp-2">
              {event.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-sm text-ink-light mt-2 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Venue & Mode */}
          <div className="flex items-center gap-2 mt-3 text-xs text-ink-light font-medium">
            <MapPin className="w-3.5 h-3.5 text-ink-faint shrink-0" />
            <span className="truncate">{event.venue}</span>
            <span className="px-2 py-0.5 rounded-pill bg-cream text-[10px] text-ink-light shrink-0">
              {event.locationType}
            </span>
          </div>
        </div>

        {/* Bottom Section: Capacity + Action Buttons */}
        <div className="space-y-3 pt-3 border-t border-border-light">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-ink-light flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-ink-faint" />
                Capacity
              </span>
              <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-ink-light'}`}>
                {isFull ? 'Sold Out' : `${spotsLeft} of ${event.capacity} left`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border-light overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : percentFilled > 80 ? 'bg-amber-400' : 'bg-green'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.slug || event._id}`}
              className="flex-1 text-center py-2.5 px-3 rounded-pill bg-cream hover:bg-sand text-xs font-semibold text-ink border border-border transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              disabled={isFull}
              className={`flex-1 py-2.5 px-3 rounded-pill text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                isFull
                  ? 'bg-cream text-ink-faint cursor-not-allowed'
                  : 'bg-green hover:bg-green-hover text-ink'
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

