'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  confirmButtonClassName = '',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-md rounded-[28px] border border-white/15 bg-[#0b1220]/96 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/12 text-red-200">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold tracking-tight text-white"
          >
            {title}
          </h2>

          <p className="text-sm leading-6 text-slate-300">{description}</p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="app-btn-secondary min-w-[120px]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isLoading}
            className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-2xl border border-red-400/35 bg-red-500/18 px-4 py-3 text-sm font-medium text-red-50 transition-all duration-150 hover:-translate-y-0.5 hover:border-red-300/45 hover:bg-red-500/24 disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonClassName}`}
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
    </div>,
    document.body,
  );
}