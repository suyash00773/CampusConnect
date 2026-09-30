import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Mail,
  ExternalLink,
  Calendar,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Club } from '../types/index.js';
import { clubService } from '../services/clubService.js';
import { Loader } from '../components/common/Loader.js';
import { ClubFormModal } from '../components/admin/ClubFormModal.js';
import { ConfirmDialog } from '../components/admin/ConfirmDialog.js';
import { useToast } from '../context/ToastContext.js';

export const AdminClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState<Club | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await clubService.getClubs();
      setClubs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleOpenAdd = () => {
    setClubToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (club: Club) => {
    setClubToEdit(club);
    setModalOpen(true);
  };

  const handleOpenDelete = (club: Club) => {
    setClubToDelete(club);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clubToDelete) return;
    setIsDeleting(true);
    try {
      await clubService.deleteClub(clubToDelete._id);
      showToast(`Club "${clubToDelete.name}" was removed.`, 'success');
      setClubs((prev) => prev.filter((c) => c._id !== clubToDelete._id));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete club', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.leadName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Societies & Organizations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Manage Campus Clubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register new clubs, update coordinators, and oversee student society activity.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Club</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 rounded-xl bg-tech-surface border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name, category, or lead coordinator..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-tech-card border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div className="hidden sm:block text-xs text-slate-400">
          Total: <span className="text-indigo-300 font-semibold">{clubs.length}</span> clubs registered
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <Loader label="Loading clubs..." size="lg" />
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club) => (
            <div
              key={club._id}
              className="rounded-xl bg-tech-surface border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-700 bg-slate-900"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(club)}
                      title="Edit Club"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-900/60 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(club)}
                      title="Delete Club"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                  {club.category}
                </span>
                <h3 className="text-sm font-semibold text-white leading-snug mt-0.5">
                  {club.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      Members:
                    </span>
                    <span className="font-semibold text-white">{club.memberCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Events Organized:
                    </span>
                    <span className="font-semibold text-white">{club.eventCount || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      Coordinator:
                    </span>
                    <span className="font-medium text-slate-300 truncate max-w-[150px]">
                      {club.leadName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl bg-tech-surface border border-slate-800 space-y-3">
          <Building className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No clubs match your search</h3>
          <p className="text-xs text-slate-400">Try searching with a different term.</p>
        </div>
      )}

      {/* Club Modal */}
      {modalOpen && (
        <ClubFormModal
          isOpen={modalOpen}
          clubToEdit={clubToEdit}
          onClose={() => setModalOpen(false)}
          onSuccess={(saved) => {
            showToast(
              clubToEdit
                ? `Club "${saved.name}" updated successfully!`
                : `Club "${saved.name}" registered successfully!`,
              'success'
            );
            fetchClubs();
          }}
        />
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Campus Club"
        message={`Are you sure you want to delete "${clubToDelete?.name}"?`}
        confirmLabel="Delete Club"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
