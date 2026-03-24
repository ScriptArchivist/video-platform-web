import type { VideoStatus } from '@/features/videos/types';
import { VideoStatusBadge } from '@/features/videos/ui/VideoStatusBadge';

interface ProcessingStatePanelProps {
  status: VideoStatus;
  errorMessage?: string | null;
}

const statusDescriptionMap: Record<Exclude<VideoStatus, 'failed'>, string> = {
  uploading: 'The file upload is still in progress.',
  uploaded: 'Upload is complete. Waiting for backend processing to begin.',
  processing: 'Backend processing is in progress. Playback will become available when it finishes.',
  ready: 'Processing is complete. Playback should now be available on the detail page.',
};

export function ProcessingStatePanel({
  status,
  errorMessage,
}: ProcessingStatePanelProps) {
  const isFailed = status === 'failed';

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Processing state
        </h2>
        <VideoStatusBadge status={status} />
      </div>

      {isFailed ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">Processing failed</p>
          <p className="mt-1">{errorMessage ?? 'Processing failed.'}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          {statusDescriptionMap[status]}
        </p>
      )}
    </div>
  );
}