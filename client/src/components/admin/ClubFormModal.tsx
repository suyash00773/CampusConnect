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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-xl bg-tech-surface border border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-tech-bg border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {clubToEdit ? 'Edit Club Profile' : 'Register New Campus Club'}
              </h3>
              <p className="text-xs text-slate-400">
                Manage student societies, clubs, and interest guilds.
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
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Club Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Club / Society Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence Research Guild"
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mission, typical activities, target members..."
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              required
            />
          </div>

          {/* Lead Coordinator Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lead Coordinator <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Devika Nair"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lead Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="lead@campusconnect.edu"
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Member Count & Media */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Active Members
              </label>
              <input
                type="number"
                min={0}
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-lg bg-tech-bg border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="p-3.5 rounded-lg bg-tech-bg border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Feature on Homepage & Spotlight
            </span>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
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
              <span>{isSubmitting ? 'Saving...' : clubToEdit ? 'Update Club' : 'Create Club'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
