import type { VideoDetailDTO } from '../types';
import { VisibilityBadge } from './VisibilityBadge';

interface VideoDetailMetaProps {
  video: VideoDetailDTO;
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function formatDuration(seconds?: number | null) {
  if (seconds === null || seconds === undefined) return '—';

  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return `${m}:${String(s).padStart(2, '0')}`;
}

export function VideoDetailMeta({ video }: VideoDetailMetaProps) {
  return (
    <div className="app-card p-5 sm:p-6">
      <h3 className="app-section-title">About this video</h3>
      <p className="mt-1 text-sm text-slate-500">
        Basic information about the video and its availability.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="app-inset p-4">
          <div className="text-sm text-slate-500">Length</div>
          <div className="mt-1 font-medium text-slate-900">
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className="app-inset p-4">
          <div className="text-sm text-slate-500">Uploaded</div>
          <div className="mt-1 font-medium text-slate-900">
            {formatDate(video.uploaded_at)}
          </div>
        </div>

        <div className="app-inset p-4 sm:col-span-2">
          <div className="text-sm text-slate-500">Uploaded by</div>
          <div className="mt-1 font-medium text-slate-900">
            {video.owner?.username ?? 'Unknown user'}
          </div>
        </div>

        <div className="app-inset p-4 sm:col-span-2">
          <div className="text-sm text-slate-500">Who can watch this video</div>
          <div className="mt-2">
            <VisibilityBadge visibility={video.visibility} />
          </div>
        </div>
      </div>
    </div>
  );
}