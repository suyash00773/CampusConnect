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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
    >
      <div className="relative w-full max-w-lg my-8 rounded-2xl bg-white border border-border shadow-modal overflow-hidden">
        {/* Header with Event Summary */}
        <div className="p-6 bg-cream border-b border-border relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-ink-light hover:text-ink bg-white hover:bg-sand transition-colors border border-border"
            aria-label="Close registration dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-bold text-green uppercase tracking-wider block mb-1">
            Student Event Registration
          </span>

          <h2 id="reg-modal-title" className="text-xl font-bold text-ink leading-snug pr-8 font-display">
            {event.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-light mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-ink-faint" />
              {formatEventDate(event.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-ink-faint" />
              {event.venue}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Duplicate or Server Error Banner */}
          {serverError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Registration Issue</strong>
                <p className="mt-0.5 leading-relaxed">{serverError}</p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border ${
                  errors.fullName ? 'border-red-500' : 'border-border'
                } text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors`}
              />
            </div>
            {errors.fullName && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-600">*</span>
              <span className="text-ink-light font-normal ml-1 normal-case tracking-normal">(One registration per event)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border ${
                  errors.email ? 'border-red-500' : 'border-border'
                } text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors`}
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          {/* College / Institution Name */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              College / University <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border ${
                  errors.college ? 'border-red-500' : 'border-border'
                } text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors`}
              />
            </div>
            {errors.college && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.college}</p>}
          </div>

          {/* Academic Year and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Academic Year <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green cursor-pointer transition-colors"
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
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Contact Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-ivory border ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  } text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors`}
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.phone}</p>}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Notes <span className="text-ink-light font-normal normal-case tracking-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Team Name or dietary specifications"
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-green focus:ring-1 focus:ring-green resize-none transition-colors"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-pill bg-cream hover:bg-sand text-sm font-semibold text-ink-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-sm font-semibold text-ink shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
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
