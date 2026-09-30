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
  ArrowRight,
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
        colors: ['#30D565', '#28C05A', '#E8F9EE', '#20201D'],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div className="relative w-full max-w-md my-8 rounded-2xl bg-white border border-border shadow-modal overflow-hidden">
        {/* Top Success Banner */}
        <div className="p-6 bg-cream border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-light border border-border-light text-green flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 id="success-modal-title" className="text-lg font-bold text-ink leading-tight font-display">
                Registration Confirmed
              </h2>
              <p className="text-sm text-ink-light">Your admission credential has been issued.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-ink-light hover:text-ink bg-white hover:bg-sand border border-border transition-colors"
            aria-label="Close confirmation dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Collegiate Ticket Card Body */}
        <div className="p-6 space-y-5 bg-white">
          <div className="rounded-xl bg-ivory border border-border overflow-hidden shadow-subtle">
            {/* Ticket Top Half */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <img
                  src="/abes-logo.png"
                  alt="ABES Engineering College"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-[10px] font-semibold text-green bg-green-light border border-border px-2 py-0.5 rounded-pill">
                  Confirmed Pass
                </span>
              </div>

              <div>
                <span className="text-xs text-ink-light uppercase tracking-wider block font-semibold mb-1">
                  Registration Code
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-mono font-bold text-ink tracking-wider">
                    {data.registrationId}
                  </span>
                  <button
                    onClick={copyId}
                    className="px-2.5 py-1 rounded-pill bg-cream hover:bg-sand text-xs font-semibold text-ink flex items-center gap-1.5 border border-border transition-colors"
                    aria-label="Copy registration ID"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green" />
                        <span className="text-green">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-ink-light" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Event Title & Schedule */}
              <div className="pt-3 border-t border-border-light">
                <h3 className="font-bold text-ink text-base leading-snug line-clamp-2">
                  {data.event.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-ink-light mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ink-faint" />
                    <span className="text-ink">{formatEventDate(data.event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink-faint" />
                    <span className="text-ink truncate">{data.event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative border-t border-dashed border-border my-1">
              <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-white border-r border-border" />
              <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-white border-l border-border" />
            </div>

            {/* Ticket Bottom Half: Attendee & QR */}
            <div className="p-5 flex items-center justify-between gap-4 bg-cream">
              <div className="space-y-1.5 text-sm">
                <div>
                  <span className="text-ink-light text-xs block font-semibold uppercase tracking-wider">Attendee:</span>
                  <span className="font-semibold text-ink">{data.studentName}</span>
                </div>
                <div>
                  <span className="text-ink-light text-xs block font-semibold uppercase tracking-wider">Institution:</span>
                  <span className="text-ink truncate max-w-[170px] block">{data.college}</span>
                </div>
                <div>
                  <span className="text-ink-light text-xs block font-semibold uppercase tracking-wider">Year:</span>
                  <span className="text-ink">{data.academicYear}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-2 rounded-xl bg-white border border-border shrink-0 flex flex-col items-center">
                <QrCode className="w-16 h-16 text-ink" />
                <span className="text-[8px] font-mono font-bold text-ink tracking-widest mt-1">
                  GATE SCAN
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-pill bg-cream hover:bg-sand text-sm font-semibold text-ink border border-border flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-ink-light" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-pill bg-green hover:bg-green-hover text-sm font-semibold text-ink shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Done</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
