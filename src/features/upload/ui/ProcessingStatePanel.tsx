import type { VideoStatus } from '@/features/videos/types';
import { VideoStatusBadge } from '@/features/videos/ui/VideoStatusBadge';

interface ProcessingStatePanelProps {
  status: VideoStatus;
  errorMessage?: string | null;
}

const statusDescriptionMap: Record<Exclude<VideoStatus, 'failed'>, string> = {
  uploading: 'The file upload is still in progress.',
  uploaded: 'Upload is complete. Waiting for backend processing to begin.',
  processing:
    'Backend processing is in progress. Playback will become available when it finishes.',
  ready: 'Processing is complete. Playback should now be available on the detail page.',
};

export function ProcessingStatePanel({
  status,
  errorMessage,
}: ProcessingStatePanelProps) {
  const isFailed = status === 'failed';

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Processing state
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Current backend status for this video.
          </p>
        </div>

        <VideoStatusBadge status={status} />
      </div>

      <div className="mt-5">
        {isFailed ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Processing failed</p>
            <p className="mt-1 leading-6">
              {errorMessage ?? 'Processing failed.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {statusDescriptionMap[status]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}