import type { LiveStatus } from '../types';

const statusLabelMap: Record<LiveStatus, string> = {
  created: 'Preparing',
  started: 'Live',
  stopped: 'Stopped',
  expired: 'Expired',
  error: 'Error',
};

const statusClassMap: Record<LiveStatus, string> = {
  created: 'border-blue-200 bg-blue-50 text-blue-700',
  started: 'border-red-200 bg-red-50 text-red-700',
  stopped: 'border-slate-200 bg-slate-50 text-slate-700',
  expired: 'border-amber-200 bg-amber-50 text-amber-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

export function LiveStatusBadge({ status }: { status: LiveStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassMap[status]}`}
    >
      {statusLabelMap[status]}
    </span>
  );
}