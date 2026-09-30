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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Attendee Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Student Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, verify student registrations, filter by event, and download CSV rosters for check-in.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating CSV...' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-tech-surface border border-slate-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, college, phone, or ID (e.g. CC-2026)..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/80">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-xs"
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
            <span className="text-[11px] font-medium text-slate-400">Year:</span>
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
            <span className="text-[11px] font-medium text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
        <div className="rounded-xl bg-tech-surface border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-tech-card/80 border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 pl-6">Registration ID</th>
                  <th className="py-3 px-4">Attendee Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {registrations.map((reg) => {
                  const eventTitle =
                    typeof reg.event === 'object' ? reg.event.title : 'Campus Event';

                  return (
                    <tr key={reg._id} className="hover:bg-slate-800/30 transition-colors">
                      {/* ID */}
                      <td className="py-3 pl-6 font-mono font-medium text-indigo-300">
                        {reg.registrationId}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-medium text-white">
                        {reg.fullName}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                        {reg.email}
                      </td>

                      {/* Event */}
                      <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                        {eventTitle}
                      </td>

                      {/* College */}
                      <td className="py-3 px-4 text-slate-400 max-w-[150px] truncate">
                        {reg.college}
                      </td>

                      {/* Academic Year */}
                      <td className="py-3 px-4">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700">
                          {reg.academicYear}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Badge label={reg.status} variant="status" status={reg.status as any} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveRegDetail(reg)}
                            title="View full registration details"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(reg)}
                            title="Cancel registration"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
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
        <div className="text-center py-16 rounded-xl bg-tech-surface border border-slate-800 space-y-3">
          <ClipboardList className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No registrations found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query, selecting another event, or clearing filters.
          </p>
        </div>
      )}

      {/* Details View Modal */}
      {activeRegDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-xl bg-tech-surface border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-indigo-400">
                  Registration Record
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  {activeRegDetail.registrationId}
                </h3>
              </div>
              <button
                onClick={() => setActiveRegDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-tech-card border border-slate-800">
                <div>
                  <span className="text-slate-500 font-medium">Full Name</span>
                  <div className="text-white font-semibold text-sm mt-0.5">
                    {activeRegDetail.fullName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Status</span>
                  <div className="mt-0.5">
                    <Badge
                      label={activeRegDetail.status}
                      variant="status"
                      status={activeRegDetail.status as any}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-lg bg-tech-card border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeRegDetail.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeRegDetail.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeRegDetail.college}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Academic Year: {activeRegDetail.academicYear}</span>
                </div>
              </div>

              {activeRegDetail.notes && (
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 font-medium block mb-1">Student Notes:</span>
                  <p className="text-slate-200">{activeRegDetail.notes}</p>
                </div>
              )}

              <div className="text-[11px] text-slate-500">
                Registered On: {new Date(activeRegDetail.registeredAt).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveRegDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
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
