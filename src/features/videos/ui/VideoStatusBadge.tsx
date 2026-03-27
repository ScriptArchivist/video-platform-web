import type { VideoStatus } from '../types';

const statusLabelMap: Record<VideoStatus, string> = {
  uploading: 'Upload in progress',
  uploaded: 'Uploaded',
  processing: 'Processing',
  ready: 'Playable',
  failed: 'Processing failed',
};

const statusClassMap: Record<VideoStatus, string> = {
  uploading: 'border-blue-200 bg-blue-50 text-blue-700',
  uploaded: 'border-slate-200 bg-slate-50 text-slate-700',
  processing: 'border-amber-200 bg-amber-50 text-amber-700',
  ready: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  failed: 'border-red-200 bg-red-50 text-red-700',
};

const dotClassMap: Record<VideoStatus, string> = {
  uploading: 'bg-blue-500',
  uploaded: 'bg-slate-400',
  processing: 'bg-amber-500',
  ready: 'bg-emerald-500',
  failed: 'bg-red-500',
};

export function VideoStatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClassMap[status]}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${dotClassMap[status]} ${
          status === 'uploading' || status === 'processing' ? 'animate-pulse' : ''
        }`}
      />
      {statusLabelMap[status]}
    </span>
  );
}