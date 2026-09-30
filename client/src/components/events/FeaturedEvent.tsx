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
    <div className="bg-white rounded-card border border-border p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Image Banner */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-border aspect-[16/10] lg:aspect-auto lg:h-[340px] bg-cream">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-bold bg-green text-ink shadow-sm">
              <Award className="w-3.5 h-3.5" />
              Editor's Spotlight
            </span>
            <span className="px-3 py-1 rounded-pill text-[11px] font-semibold bg-white text-ink border border-border">
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
            <div className="inline-flex items-center gap-1.5 text-xs text-ink-light font-medium mb-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green" />
              <span>Hosted by</span>
              <span className="font-bold text-ink">{clubName}</span>
            </div>

            {/* Event Title */}
            <Link to={`/events/${event.slug || event._id}`} className="block group">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-ink tracking-tight group-hover:text-green transition-colors leading-tight">
                {event.title}
              </h2>
            </Link>

            {/* Short Description */}
            <p className="text-sm text-ink-light mt-2.5 leading-relaxed">
              {event.shortDescription || event.description}
            </p>

            {/* Event Info Metrics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 p-4 rounded-xl bg-cream border border-border-light">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-ink-light" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-ink-light">Date</div>
                  <div className="text-xs font-semibold text-ink">
                    {formatEventDate(event.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-ink-light" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-ink-light">Time</div>
                  <div className="text-xs font-semibold text-ink">{event.startTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-ink-light" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-ink-light">Seats</div>
                  <div className="text-xs font-semibold text-ink">
                    {spotsLeft} of {event.capacity} left
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-4 space-y-1.5">
               <div className="w-full h-1.5 rounded-full bg-border-light overflow-hidden">
                 <div
                   className="h-full bg-green rounded-full transition-all duration-300"
                   style={{ width: `${Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100))}%` }}
                 />
               </div>
            </div>

            {/* Venue Tag */}
            <div className="flex items-center gap-2 mt-3.5 text-xs text-ink-light">
              <MapPin className="w-3.5 h-3.5 text-ink-faint shrink-0" />
              <span>{event.venue}</span>
              <span className="px-2 py-0.5 rounded-pill bg-cream text-[10px] text-ink-light">
                {event.locationType}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              className="w-full sm:w-auto px-6 py-3 rounded-pill font-semibold text-sm bg-green hover:bg-green-hover text-ink flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Register for Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to={`/events/${event.slug || event._id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-pill font-semibold text-sm bg-cream hover:bg-sand text-ink border border-border text-center transition-colors"
            >
              Full Schedule & Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
