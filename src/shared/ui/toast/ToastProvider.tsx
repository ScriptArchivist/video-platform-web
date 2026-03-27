'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType) => {
      const id = ++idCounter;

      setToasts((prev) => [...prev, { id, message, type }]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3200);
    },
    [removeToast],
  );

  const value: ToastContextValue = {
    showSuccess: (message) => show(message, 'success'),
    showError: (message) => show(message, 'error'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-3xl border bg-white/95 shadow-2xl backdrop-blur transition-all ${
                isSuccess
                  ? 'border-emerald-200/80'
                  : 'border-red-200/80'
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                    isSuccess
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-red-200 bg-red-50 text-red-600'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : (
                    <AlertCircle className="h-4.5 w-4.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {isSuccess ? 'Success' : 'Error'}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    {toast.message}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      isSuccess ? 'bg-emerald-500/80' : 'bg-red-500/80'
                    }`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return ctx;
}