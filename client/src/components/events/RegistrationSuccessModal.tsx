import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MapPin,
  QrCode,
  Printer,
  X,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RegistrationSuccessResponse } from '../../services/registrationService.js';
import { formatEventDate } from '../../utils/formatters.js';

interface RegistrationSuccessModalProps {
  data: RegistrationSuccessResponse['data'] | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#4F46E5', '#2563EB', '#10B981', '#F59E0B'],
      });
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const copyId = () => {
    navigator.clipboard.writeText(data.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div className="relative w-full max-w-md my-8 rounded-xl bg-tech-surface border border-slate-800 shadow-modal overflow-hidden">
        {/* Top Success Banner */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="success-modal-title" className="text-base font-bold text-white leading-tight">
                Registration Confirmed
              </h2>
              <p className="text-[11px] text-slate-400">Your admission credential has been issued.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Close confirmation dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Collegiate Ticket Card Body */}
        <div className="p-6 space-y-5">
          <div className="rounded-lg bg-tech-card border border-slate-800 overflow-hidden shadow-sm">
            {/* Ticket Top Half */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <img
                  src="/abes-logo.png"
                  alt="ABES Engineering College"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                  Confirmed Pass
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                  Registration Code
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-mono font-bold text-indigo-300 tracking-wider">
                    {data.registrationId}
                  </span>
                  <button
                    onClick={copyId}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
                    aria-label="Copy registration ID"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Event Title & Schedule */}
              <div className="pt-2 border-t border-slate-800/80">
                <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                  {data.event.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">{formatEventDate(data.event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300 truncate">{data.event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative border-t border-dashed border-slate-700 my-1">
              <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-tech-surface border-r border-slate-700" />
              <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-tech-surface border-l border-slate-700" />
            </div>

            {/* Ticket Bottom Half: Attendee & QR */}
            <div className="p-4 flex items-center justify-between gap-4 bg-slate-900/40">
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Attendee:</span>
                  <span className="font-semibold text-white">{data.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Institution:</span>
                  <span className="text-slate-300 truncate max-w-[170px] block">{data.college}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Year:</span>
                  <span className="text-slate-300">{data.academicYear}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-1.5 rounded-lg bg-white shrink-0 flex flex-col items-center">
                <QrCode className="w-14 h-14 text-slate-950" />
                <span className="text-[7px] font-mono font-bold text-slate-800 tracking-wider -mt-0.5">
                  GATE SCAN
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Done</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
