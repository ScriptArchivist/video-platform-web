import type { LiveStatus } from '../types';

const statusLabelMap: Record<LiveStatus, string> = {
  created: 'Preparing',
  started: 'Live',
  stopped: 'Stopped',
  expired: 'Expired',
  error: 'Error',
};

const statusClassMap: Record<LiveStatus, string> = {
  created: 'bg-blue-50 text-blue-700 border-blue-200',
  started: 'bg-red-50 text-red-700 border-red-200',
  stopped: 'bg-slate-50 text-slate-700 border-slate-200',
  expired: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
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