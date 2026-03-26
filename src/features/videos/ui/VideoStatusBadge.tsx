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

export function VideoStatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassMap[status]}`}
    >
      {statusLabelMap[status]}
    </span>
  );
}