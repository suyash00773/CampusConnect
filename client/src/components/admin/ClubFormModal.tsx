import React, { useState, useEffect } from 'react';
import { X, Users, AlertCircle, Save } from 'lucide-react';
import { Club } from '../../types/index.js';
import { clubService } from '../../services/clubService.js';

interface ClubFormModalProps {
  isOpen: boolean;
  clubToEdit?: Club | null;
  onClose: () => void;
  onSuccess: (savedClub: Club) => void;
}

const CLUB_CATEGORIES = [
  'Technology & Coding',
  'Robotics & AI',
  'Entrepreneurship & Business',
  'Arts & Culture',
  'Sports & Fitness',
  'Literature & Debate',
  'Social & Environmental',
];

export const ClubFormModal: React.FC<ClubFormModalProps> = ({
  isOpen,
  clubToEdit,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CLUB_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [memberCount, setMemberCount] = useState<number>(50);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (clubToEdit) {
      setName(clubToEdit.name);
      setCategory(clubToEdit.category);
      setDescription(clubToEdit.description);
      setLeadName(clubToEdit.leadName);
      setLeadEmail(clubToEdit.leadEmail);
      setMemberCount(clubToEdit.memberCount || 0);
      setLogoUrl(clubToEdit.logoUrl);
      setBannerUrl(clubToEdit.bannerUrl);
      setIsFeatured(!!clubToEdit.isFeatured);
    } else {
      setName('');
      setCategory(CLUB_CATEGORIES[0]);
      setDescription('');
      setLeadName('');
      setLeadEmail('');
      setMemberCount(100);
      setLogoUrl('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80');
      setBannerUrl('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80');
      setIsFeatured(false);
    }
    setError(null);
  }, [clubToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim() || !leadName.trim() || !leadEmail.trim()) {
      setError('Please fill in all mandatory fields (Name, Description, Lead Contact).');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      leadName: leadName.trim(),
      leadEmail: leadEmail.trim(),
      memberCount: Number(memberCount) || 0,
      logoUrl: logoUrl.trim(),
      bannerUrl: bannerUrl.trim(),
      isFeatured,
    };

    setIsSubmitting(true);
    try {
      let saved: Club;
      if (clubToEdit) {
        saved = await clubService.updateClub(clubToEdit._id, payload);
      } else {
        saved = await clubService.createClub(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save club.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-white border border-border shadow-modal overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-cream border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-light border border-green/20 flex items-center justify-center text-green">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink leading-tight font-display">
                {clubToEdit ? 'Edit Club Profile' : 'Register New Campus Club'}
              </h3>
              <p className="text-sm text-ink-light">
                Manage student societies, clubs, and interest guilds.
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

          {/* Club Name */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Club / Society Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence Research Guild"
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer transition-colors"
            >
              {CLUB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mission, typical activities, target members..."
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green resize-none transition-colors"
              required
            />
          </div>

          {/* Lead Coordinator Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Lead Coordinator <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Devika Nair"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Lead Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="lead@campusconnect.edu"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                required
              />
            </div>
          </div>

          {/* Member Count & Media */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Active Members
              </label>
              <input
                type="number"
                min={0}
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Banner Image URL
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="p-4 rounded-xl bg-cream border border-border flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-ink">
              Feature on Homepage & Spotlight
            </span>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded text-green focus:ring-green bg-white border-border cursor-pointer"
            />
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
              <span>{isSubmitting ? 'Saving...' : clubToEdit ? 'Update Club' : 'Create Club'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
