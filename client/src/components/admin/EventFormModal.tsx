import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Save } from 'lucide-react';
import { Event, Club, EventCategory } from '../../types/index.js';
import { eventService } from '../../services/eventService.js';
import { clubService } from '../../services/clubService.js';

interface EventFormModalProps {
  isOpen: boolean;
  eventToEdit?: Event | null;
  onClose: () => void;
  onSuccess: (savedEvent: Event) => void;
}

const CATEGORIES: EventCategory[] = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Hackathon',
  'Seminar',
  'Social',
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  eventToEdit,
  onClose,
  onSuccess,
}) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [clubId, setClubId] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [venue, setVenue] = useState('');
  const [locationType, setLocationType] = useState<'In-Person' | 'Virtual' | 'Hybrid'>('In-Person');
  const [bannerUrl, setBannerUrl] = useState('');
  const [capacity, setCapacity] = useState<number>(100);
  const [status, setStatus] = useState<'published' | 'draft' | 'completed' | 'cancelled'>('published');
  const [featured, setFeatured] = useState<boolean>(false);
  const [tagsStr, setTagsStr] = useState('');
  const [reqsStr, setReqsStr] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubList = await clubService.getClubs();
        setClubs(clubList);
        if (clubList.length > 0 && !clubId && !eventToEdit) {
          setClubId(clubList[0]._id);
        }
      } catch (err) {
        console.error('Failed to load clubs for selector:', err);
      }
    };
    if (isOpen) {
      fetchClubs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setShortDescription(eventToEdit.shortDescription || '');
      setDescription(eventToEdit.description || '');
      setClubId(typeof eventToEdit.club === 'object' ? eventToEdit.club._id : eventToEdit.club);
      setCategory(eventToEdit.category);
      setDate(eventToEdit.date);
      setStartTime(eventToEdit.startTime || '10:00 AM');
      setEndTime(eventToEdit.endTime || '04:00 PM');
      setVenue(eventToEdit.venue);
      setLocationType(eventToEdit.locationType || 'In-Person');
      setBannerUrl(eventToEdit.bannerUrl);
      setCapacity(eventToEdit.capacity || 100);
      setStatus(eventToEdit.status || 'published');
      setFeatured(!!eventToEdit.featured);
      setTagsStr(eventToEdit.tags ? eventToEdit.tags.join(', ') : '');
      setReqsStr(eventToEdit.requirements ? eventToEdit.requirements.join(', ') : '');
    } else {
      // Default clean values for new event
      setTitle('');
      setShortDescription('');
      setDescription('');
      setCategory('Technical');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('10:00 AM');
      setEndTime('04:00 PM');
      setVenue('Main Campus Auditorium');
      setLocationType('In-Person');
      setBannerUrl('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80');
      setCapacity(150);
      setStatus('published');
      setFeatured(false);
      setTagsStr('Campus, StudentActivity');
      setReqsStr('Valid College ID Card');
    }
    setError(null);
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date || !venue.trim() || !bannerUrl.trim() || !clubId) {
      setError('Please fill in all required fields (Title, Club, Date, Venue, Banner URL).');
      return;
    }

    const payload = {
      title: title.trim(),
      shortDescription: shortDescription.trim() || title.trim(),
      description: description.trim() || shortDescription.trim() || title.trim(),
      club: clubId,
      category,
      date,
      startTime,
      endTime,
      venue: venue.trim(),
      locationType,
      bannerUrl: bannerUrl.trim(),
      capacity: Number(capacity) || 100,
      status,
      featured,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      requirements: reqsStr.split(',').map((r) => r.trim()).filter(Boolean),
    };

    setIsSubmitting(true);
    try {
      let saved: Event;
      if (eventToEdit) {
        saved = await eventService.updateEvent(eventToEdit._id, payload);
      } else {
        saved = await eventService.createEvent(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save event. Check fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-xl bg-tech-surface border border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-tech-bg border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {eventToEdit ? 'Edit Event Details' : 'Create New Campus Event'}
              </h3>
              <p className="text-xs text-slate-400">
                Publish high-impact events for students across faculties.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HackNova 2026: National Collegiate Hackathon"
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Club & Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Organizing Club <span className="text-rose-400">*</span>
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                required
              >
                {clubs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="04:00 PM"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Venue & Location Type & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Venue <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Auditorium Hall B"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mode
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Capacity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Banner Image URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Short Summary <span className="text-slate-500 font-normal">(Card preview)</span>
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief 1-2 sentence preview for cards..."
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive event details, agendas, keynote speakers, judging criteria, certificates..."
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Tags & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tags <span className="text-slate-500 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="AI, Hackathon, Coding, Prizes"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Requirements <span className="text-slate-500 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={reqsStr}
                onChange={(e) => setReqsStr(e.target.value)}
                placeholder="College ID, Laptop, Team of 3"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status & Featured Checkbox */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-lg bg-tech-bg border border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-300">Publishing Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <span>Highlight as Featured Spotlight</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : eventToEdit ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
