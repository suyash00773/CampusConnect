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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white border border-border shadow-modal overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-cream border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-light border border-green/20 flex items-center justify-center text-green">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink leading-tight font-display">
                {eventToEdit ? 'Edit Event Details' : 'Create New Campus Event'}
              </h3>
              <p className="text-sm text-ink-light">
                Publish high-impact events for students across faculties.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-light hover:text-ink bg-white hover:bg-sand border border-border cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Event Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HackNova 2026: National Collegiate Hackathon"
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              required
            />
          </div>

          {/* Club & Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Organizing Club <span className="text-red-600">*</span>
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer transition-colors"
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
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer transition-colors"
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
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Event Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="04:00 PM"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>
          </div>

          {/* Venue & Location Type & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Venue <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Auditorium Hall B"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Mode
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer transition-colors"
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Max Capacity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                required
              />
            </div>
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Banner Image URL <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              required
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Short Summary <span className="text-ink-light font-normal normal-case tracking-normal">(Card preview)</span>
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief 1-2 sentence preview for cards..."
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green resize-none transition-colors"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive event details, agendas, keynote speakers, judging criteria, certificates..."
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green resize-none transition-colors"
            />
          </div>

          {/* Tags & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Tags <span className="text-ink-light font-normal normal-case tracking-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="AI, Hackathon, Coding, Prizes"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Requirements <span className="text-ink-light font-normal normal-case tracking-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                value={reqsStr}
                onChange={(e) => setReqsStr(e.target.value)}
                placeholder="College ID, Laptop, Team of 3"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>
          </div>

          {/* Status & Featured Checkbox */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-cream border border-border">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-ink">Publishing Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors cursor-pointer"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-green focus:ring-green bg-white border-border cursor-pointer"
              />
              <span>Highlight as Featured Spotlight</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-pill text-sm font-semibold bg-cream hover:bg-sand text-ink border border-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-sm font-semibold text-ink shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : eventToEdit ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
