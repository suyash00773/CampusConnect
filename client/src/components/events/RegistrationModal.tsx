import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, User, Mail, GraduationCap, Phone, Building2, Calendar, MapPin } from 'lucide-react';
import { Event, AcademicYear } from '../../types/index.js';
import { registrationService, RegistrationSuccessResponse } from '../../services/registrationService.js';
import { formatEventDate } from '../../utils/formatters.js';

interface RegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: RegistrationSuccessResponse['data']) => void;
}

const ACADEMIC_YEARS: AcademicYear[] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Post Graduate',
  'Other',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [academicYear, setAcademicYear] = useState<AcademicYear>('3rd Year');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Valid student or institutional email address required.';
    }

    if (!college.trim() || college.trim().length < 2) {
      newErrors.college = 'College or University name is required.';
    }

    const phoneClean = phone.replace(/[\s-]/g, '');
    if (!phone.trim() || phoneClean.length < 10) {
      newErrors.phone = 'Valid phone number required (minimum 10 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await registrationService.register({
        eventId: event._id,
        fullName,
        email,
        college,
        academicYear,
        phone,
        notes,
      });

      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setServerError(
        err.message || 'An unexpected error occurred while processing registration.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
    >
      <div className="relative w-full max-w-lg my-8 rounded-xl bg-tech-surface border border-slate-800 shadow-modal overflow-hidden">
        {/* Header with Event Summary */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Close registration dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Student Event Registration
          </span>

          <h2 id="reg-modal-title" className="text-lg font-bold text-white leading-snug pr-8">
            {event.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatEventDate(event.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {event.venue}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Duplicate or Server Error Banner */}
          {serverError && (
            <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Registration Issue</strong>
                <p className="mt-0.5 leading-relaxed">{serverError}</p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className={`w-full pl-9 pr-3 py-2 rounded-lg bg-tech-card border ${
                  errors.fullName ? 'border-rose-500' : 'border-slate-700'
                } text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500`}
              />
            </div>
            {errors.fullName && <p className="text-rose-400 text-[11px] mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-rose-400">*</span>
              <span className="text-slate-500 font-normal ml-1">(One registration per event)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className={`w-full pl-9 pr-3 py-2 rounded-lg bg-tech-card border ${
                  errors.email ? 'border-rose-500' : 'border-slate-700'
                } text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500`}
              />
            </div>
            {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
          </div>

          {/* College / Institution Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              College / University <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className={`w-full pl-9 pr-3 py-2 rounded-lg bg-tech-card border ${
                  errors.college ? 'border-rose-500' : 'border-slate-700'
                } text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500`}
              />
            </div>
            {errors.college && <p className="text-rose-400 text-[11px] mt-1">{errors.college}</p>}
          </div>

          {/* Academic Year and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Academic Year <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-tech-card border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {ACADEMIC_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Phone <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg bg-tech-card border ${
                    errors.phone ? 'border-rose-500' : 'border-slate-700'
                  } text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500`}
                />
              </div>
              {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes / Team Affiliation <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Team Name or dietary specifications"
              className="w-full px-3 py-2 rounded-lg bg-tech-card border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
