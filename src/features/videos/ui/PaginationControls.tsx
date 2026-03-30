'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({
  page,
  perPage,
  total,
  onPageChange,
}: {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-300">
        Showing <span className="font-medium text-white">{from}</span>–
        <span className="font-medium text-white">{to}</span> of{' '}
        <span className="font-medium text-white">{total}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-200 backdrop-blur-xl">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="app-btn-secondary h-10 gap-2 px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="app-btn-secondary h-10 gap-2 px-3"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}