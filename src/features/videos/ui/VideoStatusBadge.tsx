import type { VideoStatus } from '../types';

const statusLabelMap: Record<VideoStatus, string> = {
  uploading: 'Upload in progress',
  uploaded: 'Uploaded',
  processing: 'Processing',
  ready: 'Playable',
  failed: 'Processing failed',
};

const statusClassMap: Record<VideoStatus, string> = {
  uploading: 'bg-blue-50 text-blue-700 border-blue-200',
  uploaded: 'bg-slate-50 text-slate-700 border-slate-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
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