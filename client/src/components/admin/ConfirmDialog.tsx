import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  isDestructive = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white border border-border p-6 shadow-modal space-y-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              isDestructive
                ? 'bg-red-50 border-red-100 text-red-600'
                : 'bg-green-light border-green/20 text-green'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 mt-0.5">
            <h3 className="text-base font-bold text-ink leading-snug">{title}</h3>
            <p className="text-sm text-ink-light mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-pill text-sm font-semibold bg-cream hover:bg-sand text-ink-light transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-pill text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green hover:bg-green-hover text-ink'
            }`}
          >
            {isLoading ? (
              <>
                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isDestructive ? 'border-white/50' : 'border-ink/20'}`} />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
