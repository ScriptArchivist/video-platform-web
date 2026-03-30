'use client';

import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClassName = 'app-btn-danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, isLoading, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="app-card w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent text-slate-400 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            {title}
          </h2>

          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="app-btn-secondary"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isLoading}
            className={`${confirmButtonClassName} gap-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}