import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Event, EventCategory } from '../types/index.js';
import { eventService } from '../services/eventService.js';
import { Badge } from '../components/common/Badge.js';
import { Loader } from '../components/common/Loader.js';
import { EventFormModal } from '../components/admin/EventFormModal.js';
import { ConfirmDialog } from '../components/admin/ConfirmDialog.js';
import { useToast } from '../context/ToastContext.js';
import { formatEventDate } from '../utils/formatters.js';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEvents({ limit: 100 });
      setEvents(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEventToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setEventToEdit(event);
    setModalOpen(true);
  };

  const handleOpenDelete = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await eventService.deleteEvent(eventToDelete._id);
      showToast(`Event "${eventToDelete.title}" and its registrations were deleted.`, 'success');
      setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in bg-ivory min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-green">
            Event Administration
          </span>
          <h1 className="font-display text-3xl text-ink tracking-tight mt-0.5">
            Manage Events
          </h1>
          <p className="text-xs sm:text-sm text-ink-light mt-1">
            Publish new university events, modify schedules, and manage seat capacities.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-card bg-white border border-border shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title or venue..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Seminar">Seminar</option>
            <option value="Social">Social</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <Loader label="Loading events..." size="lg" />
      ) : filteredEvents.length > 0 ? (
        <div className="rounded-card bg-white border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead>
                <tr className="bg-cream border-b border-border-light text-ink-light font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-4 pl-6">Event</th>
                  <th className="py-4 px-4">Club</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Date & Time</th>
                  <th className="py-4 px-4">Registrations / Cap</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredEvents.map((event) => {
                  const clubName = typeof event.club === 'object' ? event.club.name : 'Club';
                  const percent = Math.min(
                    100,
                    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
                  );

                  return (
                    <tr key={event._id} className="hover:bg-cream/50 transition-colors">
                      {/* Event Banner & Title */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-xs text-ink line-clamp-1">
                              {event.title}
                            </span>
                            <span className="text-[11px] text-ink-light block truncate max-w-xs">
                              {event.venue}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Club */}
                      <td className="py-4 px-4 text-ink-light font-medium">{clubName}</td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <Badge label={event.category} />
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-ink-light">
                        <div className="font-medium text-ink">{formatEventDate(event.date)}</div>
                        <div className="text-[11px] text-ink-light">{event.startTime}</div>
                      </td>

                      {/* Registration Capacity Progress */}
                      <td className="py-4 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-ink-light">
                            <span>{event.registeredCount || 0}</span>
                            <span className="text-ink-faint">/ {event.capacity}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-cream overflow-hidden">
                            <div
                              className="h-full bg-green rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge label={event.status} variant="status" status={event.status as any} />
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/events/${event.slug || event._id}`}
                            target="_blank"
                            title="View public page"
                            className="p-2 rounded-pill bg-cream hover:bg-sand text-ink transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(event)}
                            title="Edit event"
                            className="p-2 rounded-pill bg-cream hover:bg-sand text-ink transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(event)}
                            title="Delete event"
                            className="p-2 rounded-pill bg-cream hover:bg-red-50 text-ink hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 rounded-card bg-white border border-border space-y-3">
          <Calendar className="w-8 h-8 text-ink-faint mx-auto" />
          <h3 className="text-sm font-semibold text-ink">No events match the search criteria</h3>
          <p className="text-xs text-ink-light">Try changing your filters or add a new event.</p>
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && (
        <EventFormModal
          isOpen={modalOpen}
          eventToEdit={eventToEdit}
          onClose={() => setModalOpen(false)}
          onSuccess={(saved) => {
            showToast(
              eventToEdit
                ? `Event "${saved.title}" updated successfully!`
                : `Event "${saved.title}" created successfully!`,
              'success'
            );
            fetchEvents();
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Event"
        message={`Are you sure you want to permanently delete "${eventToDelete?.title}"? All student registrations linked to this event will also be removed.`}
        confirmLabel="Delete Event"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
