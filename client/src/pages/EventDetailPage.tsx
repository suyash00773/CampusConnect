import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  Share2,
  Check,
  Building,
  Mail,
  Shield,
  Tag,
  ListChecks,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Event } from '../types/index.js';
import { eventService } from '../services/eventService.js';
import { Badge } from '../components/common/Badge.js';
import { Loader } from '../components/common/Loader.js';
import { RegistrationModal } from '../components/events/RegistrationModal.js';
import { RegistrationSuccessModal } from '../components/events/RegistrationSuccessModal.js';
import { formatEventDate, getDaysRemainingBadge } from '../utils/formatters.js';
import { RegistrationSuccessResponse } from '../services/registrationService.js';

export const EventDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState<RegistrationSuccessResponse['data'] | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!idOrSlug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getEventByIdOrSlug(idOrSlug);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Event not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [idOrSlug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (loading) {
    return <Loader label="Loading event details..." size="lg" />;
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'This event does not exist.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Event Directory</span>
        </Link>
      </div>
    );
  }

  const clubObj = typeof event.club === 'object' ? event.club : null;
  const remaining = getDaysRemainingBadge(event.date);
  const spotsLeft = Math.max(0, (event.capacity || 100) - (event.registeredCount || 0));
  const isFull = spotsLeft === 0;
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-tech-surface/80 px-3 py-1.5 rounded-lg border border-slate-700/60"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-tech-surface px-3.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share Event</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
        <div className="h-64 sm:h-80 md:h-96 w-full relative">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-tech-bg/60 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge label={event.category} />
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-tech-bg/90 border border-slate-700 text-slate-300 backdrop-blur-sm">
              {remaining.text}
            </span>
          </div>

          {/* Bottom Title Header */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl line-clamp-2 leading-relaxed">
              {event.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Registration Sticky Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Information */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Schedule Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-tech-surface/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-tech-elevated border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Date</span>
                <p className="text-xs font-semibold text-slate-200">{formatEventDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-tech-elevated border border-slate-700/60 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Time</span>
                <p className="text-xs font-semibold text-slate-200">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-tech-elevated border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Venue</span>
                <p className="text-xs font-semibold text-slate-200 truncate">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* About Event Description */}
          <div className="space-y-4 rounded-xl bg-tech-surface/50 p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-white tracking-tight">About This Event</h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Requirements & Guidelines */}
          {event.requirements && event.requirements.length > 0 && (
            <div className="space-y-3 rounded-xl bg-tech-surface/50 p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-400" />
                <span>Participation Requirements</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                {event.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Organizing Club Card */}
          {clubObj && (
            <div className="p-6 rounded-xl bg-tech-surface/60 border border-slate-800 space-y-4">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Event Host & Organizer
              </span>

              <div className="flex items-start gap-4">
                <img
                  src={clubObj.logoUrl}
                  alt={clubObj.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 bg-slate-900 shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">{clubObj.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{clubObj.category}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {clubObj.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clubObj.leadEmail}</span>
                    </div>
                    <Link
                      to={`/events?club=${clubObj.slug}`}
                      className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>All {clubObj.name} Events</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Registration Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 rounded-xl bg-tech-surface border border-slate-800 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 block mb-1">
                Seat Availability
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">
                  {spotsLeft} <span className="text-xs font-normal text-slate-400">spots left</span>
                </span>
                <span className="text-xs text-slate-400">
                  Capacity: {event.capacity}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFull
                      ? 'bg-rose-500'
                      : percentFilled > 85
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-right">
                {event.registeredCount || 0} students confirmed
              </p>
            </div>

            {/* Big Action Button */}
            <button
              onClick={() => setShowRegModal(true)}
              disabled={isFull}
              className={`w-full py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isFull
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              <span>{isFull ? 'Event Full (Registrations Closed)' : 'Register for Event'}</span>
              {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal
          event={event}
          isOpen={showRegModal}
          onClose={() => setShowRegModal(false)}
          onSuccess={(data) => {
            setRegSuccessData(data);
            setEvent((prev) =>
              prev ? { ...prev, registeredCount: (prev.registeredCount || 0) + 1 } : prev
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
