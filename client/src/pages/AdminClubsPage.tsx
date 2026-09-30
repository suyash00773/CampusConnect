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
    <div className="space-y-6 animate-fade-in bg-ivory min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-green">
            Societies & Organizations
          </span>
          <h1 className="font-display text-3xl text-ink tracking-tight mt-0.5">
            Manage Campus Clubs
          </h1>
          <p className="text-xs sm:text-sm text-ink-light mt-1">
            Register new clubs, update coordinators, and oversee student society activity.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Club</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-card bg-white border border-border shadow-subtle flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name, category, or lead coordinator..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
          />
        </div>

        <div className="hidden sm:block text-xs text-ink-light">
          Total: <span className="text-green font-semibold">{clubs.length}</span> clubs registered
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
              className="rounded-card bg-white border border-border p-5 flex flex-col justify-between hover:border-border-light transition-colors shadow-subtle"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-12 h-12 rounded-xl object-cover border border-border bg-ivory"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(club)}
                      title="Edit Club"
                      className="p-2 rounded-pill bg-cream hover:bg-sand text-ink transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(club)}
                      title="Delete Club"
                      className="p-2 rounded-pill bg-cream hover:bg-red-50 text-ink hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-semibold text-ink-light tracking-wider bg-cream px-2 py-1 rounded-pill border border-border-light">
                  {club.category}
                </span>
                <h3 className="text-base font-semibold text-ink leading-snug mt-2">
                  {club.name}
                </h3>
                <p className="text-xs text-ink-light mt-1.5 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>

                <div className="mt-4 pt-3 border-t border-border-light space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink-light">
                    <span className="flex items-center gap-1.5 text-ink-light">
                      <Users className="w-3.5 h-3.5 text-green" />
                      Members:
                    </span>
                    <span className="font-semibold text-ink">{club.memberCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-ink-light">
                    <span className="flex items-center gap-1.5 text-ink-light">
                      <Calendar className="w-3.5 h-3.5 text-green" />
                      Events Organized:
                    </span>
                    <span className="font-semibold text-ink">{club.eventCount || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-ink-light">
                    <span className="flex items-center gap-1.5 text-ink-light">
                      <Mail className="w-3.5 h-3.5 text-green" />
                      Coordinator:
                    </span>
                    <span className="font-medium text-ink truncate max-w-[150px]">
                      {club.leadName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-card bg-white border border-border shadow-subtle space-y-3">
          <Building className="w-8 h-8 text-ink-faint mx-auto" />
          <h3 className="text-sm font-semibold text-ink">No clubs match your search</h3>
          <p className="text-xs text-ink-light">Try searching with a different term.</p>
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
