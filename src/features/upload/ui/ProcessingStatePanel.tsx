import type { VideoStatus } from '@/features/videos/types';
import { VideoStatusBadge } from '@/features/videos/ui/VideoStatusBadge';

interface ProcessingStatePanelProps {
  status: VideoStatus;
  errorMessage?: string | null;
}

export function ProcessingStatePanel({
  status,
  errorMessage,
}: ProcessingStatePanelProps) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Processing state
        </h2>
        <VideoStatusBadge status={status} />
      </div>

      {status === 'failed' ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage ?? 'Processing failed.'}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Upload is complete. Waiting for backend processing to finish.
        </p>
      )}
    </div>
  );
}