import React, { useEffect, useState } from 'react';
import {
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { Registration, Event, AcademicYear } from '../types/index.js';
import { registrationService } from '../services/registrationService.js';
import { eventService } from '../services/eventService.js';
import { Badge } from '../components/common/Badge.js';
import { Loader } from '../components/common/Loader.js';
import { ConfirmDialog } from '../components/admin/ConfirmDialog.js';
import { useToast } from '../context/ToastContext.js';
import { formatEventDate } from '../utils/formatters.js';

export const AdminRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('All');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // View details modal
  const [activeRegDetail, setActiveRegDetail] = useState<Registration | null>(null);

  // Delete modal
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [regToDelete, setRegToDelete] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const [regRes, evRes] = await Promise.all([
        registrationService.getRegistrations({
          eventId: selectedEventId !== 'All' ? selectedEventId : undefined,
          search: search.trim() || undefined,
          academicYear: academicYearFilter !== 'All' ? academicYearFilter : undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
          limit: 100,
        }),
        eventService.getEvents({ limit: 100 }),
      ]);

      setRegistrations(regRes.data);
      setEvents(evRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedEventId, academicYearFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await registrationService.downloadCsv(
        selectedEventId !== 'All' ? selectedEventId : undefined
      );
      showToast('Registration roster exported to CSV successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenDelete = (reg: Registration) => {
    setRegToDelete(reg);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!regToDelete) return;
    setIsDeleting(true);
    try {
      await registrationService.deleteRegistration(regToDelete._id);
      showToast(`Registration for ${regToDelete.fullName} has been cancelled.`, 'success');
      setRegistrations((prev) => prev.filter((r) => r._id !== regToDelete._id));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel registration', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in bg-ivory min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-green">
            Attendee Management
          </span>
          <h1 className="font-display text-3xl text-ink tracking-tight mt-0.5">
            Student Registrations
          </h1>
          <p className="text-xs sm:text-sm text-ink-light mt-1">
            Search, verify student registrations, filter by event, and download CSV rosters for check-in.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating CSV...' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-card bg-white border border-border shadow-subtle space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, college, phone, or ID (e.g. CC-2026)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-light">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-ink-light">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green cursor-pointer max-w-xs"
            >
              <option value="All">All Events ({events.length})</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-ink-light">Year:</span>
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-ink-light">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Waitlisted">Waitlisted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <Loader label="Loading registrations..." size="lg" />
      ) : registrations.length > 0 ? (
        <div className="rounded-card bg-white border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead>
                <tr className="bg-cream border-b border-border-light text-ink-light font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-4 pl-6">Registration ID</th>
                  <th className="py-4 px-4">Attendee Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Event</th>
                  <th className="py-4 px-4">College</th>
                  <th className="py-4 px-4">Year</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {registrations.map((reg) => {
                  const eventTitle =
                    typeof reg.event === 'object' ? reg.event.title : 'Campus Event';

                  return (
                    <tr key={reg._id} className="hover:bg-cream/50 transition-colors">
                      {/* ID */}
                      <td className="py-4 pl-6 font-mono font-medium text-green">
                        {reg.registrationId}
                      </td>

                      {/* Name */}
                      <td className="py-4 px-4 font-medium text-ink">
                        {reg.fullName}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-ink-light font-mono text-[11px]">
                        {reg.email}
                      </td>

                      {/* Event */}
                      <td className="py-4 px-4 text-ink-light max-w-[200px] truncate">
                        {eventTitle}
                      </td>

                      {/* College */}
                      <td className="py-4 px-4 text-ink-light max-w-[150px] truncate">
                        {reg.college}
                      </td>

                      {/* Academic Year */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-cream text-[10px] text-ink font-medium border border-border-light">
                          {reg.academicYear}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge label={reg.status} variant="status" status={reg.status as any} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveRegDetail(reg)}
                            title="View full registration details"
                            className="p-2 rounded-pill bg-cream hover:bg-sand text-ink transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(reg)}
                            title="Cancel registration"
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
        <div className="text-center py-16 rounded-card bg-white border border-border shadow-subtle space-y-3">
          <ClipboardList className="w-8 h-8 text-ink-faint mx-auto" />
          <h3 className="text-sm font-semibold text-ink">No registrations found</h3>
          <p className="text-xs text-ink-light">
            Try adjusting your search query, selecting another event, or clearing filters.
          </p>
        </div>
      )}

      {/* Details View Modal */}
      {activeRegDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-border p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-green">
                  Registration Record
                </span>
                <h3 className="text-base font-bold text-ink font-mono">
                  {activeRegDetail.registrationId}
                </h3>
              </div>
              <button
                onClick={() => setActiveRegDetail(null)}
                className="p-2 rounded-pill text-ink-light hover:text-ink bg-cream hover:bg-sand transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-ivory border border-border-light">
                <div>
                  <span className="text-ink-light font-medium">Full Name</span>
                  <div className="text-ink font-semibold text-sm mt-0.5">
                    {activeRegDetail.fullName}
                  </div>
                </div>
                <div>
                  <span className="text-ink-light font-medium">Status</span>
                  <div className="mt-0.5">
                    <Badge
                      label={activeRegDetail.status}
                      variant="status"
                      status={activeRegDetail.status as any}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-ivory border border-border-light">
                <div className="flex items-center gap-2 text-ink-light">
                  <Mail className="w-3.5 h-3.5 text-ink-light shrink-0" />
                  <span>{activeRegDetail.email}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-light">
                  <Phone className="w-3.5 h-3.5 text-ink-light shrink-0" />
                  <span>{activeRegDetail.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-light">
                  <Building2 className="w-3.5 h-3.5 text-ink-light shrink-0" />
                  <span>{activeRegDetail.college}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-light">
                  <Calendar className="w-3.5 h-3.5 text-ink-light shrink-0" />
                  <span>Academic Year: {activeRegDetail.academicYear}</span>
                </div>
              </div>

              {activeRegDetail.notes && (
                <div className="p-4 rounded-xl bg-cream border border-border-light">
                  <span className="text-ink-light font-medium block mb-1">Student Notes:</span>
                  <p className="text-ink">{activeRegDetail.notes}</p>
                </div>
              )}

              <div className="text-[11px] text-ink-faint">
                Registered On: {new Date(activeRegDetail.registeredAt).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveRegDetail(null)}
                className="px-6 py-2 rounded-pill bg-cream hover:bg-sand text-xs font-medium text-ink border border-border cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Cancel Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Cancel Registration"
        message={`Are you sure you want to cancel the registration for "${regToDelete?.fullName}" (${regToDelete?.registrationId})? This will release their reserved capacity spot.`}
        confirmLabel="Cancel Registration"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
