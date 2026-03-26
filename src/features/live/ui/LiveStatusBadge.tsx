import type { LiveStatus } from '../types';

const statusLabelMap: Record<LiveStatus, string> = {
  created: 'Ready to start',
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

const dotClassMap: Record<LiveStatus, string> = {
  created: 'bg-blue-500',
  started: 'bg-red-500',
  stopped: 'bg-slate-400',
  expired: 'bg-amber-500',
  error: 'bg-red-500',
};

export function LiveStatusBadge({ status }: { status: LiveStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClassMap[status]}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${dotClassMap[status]} ${
          status === 'started' ? 'animate-pulse' : ''
        }`}
      />
      {statusLabelMap[status]}
    </span>
  );
}