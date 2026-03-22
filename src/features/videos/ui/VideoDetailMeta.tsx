import type { VideoDetailDTO } from '../types';
import { VideoStatusBadge } from './VideoStatusBadge';
import { VisibilityBadge } from './VisibilityBadge';

interface VideoDetailMetaProps {
  video: VideoDetailDTO;
}

export function VideoDetailMeta({ video }: VideoDetailMetaProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <VideoStatusBadge status={video.status} />
          <VisibilityBadge visibility={video.visibility} />
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="mb-1 text-slate-500">Title</dt>
            <dd className="font-medium text-slate-900">{video.title}</dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">Description</dt>
            <dd className="text-slate-800">{video.description ?? '—'}</dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">Duration</dt>
            <dd className="text-slate-800">{video.duration ?? '—'}</dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">Size</dt>
            <dd className="text-slate-800">{video.size_bytes ?? '—'}</dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">MIME type</dt>
            <dd className="text-slate-800">{video.mime_type ?? '—'}</dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">Uploaded at</dt>
            <dd className="text-slate-800">
              {new Date(video.uploaded_at).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-slate-500">Processed at</dt>
            <dd className="text-slate-800">
              {video.processed_at
                ? new Date(video.processed_at).toLocaleString()
                : '—'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Owner</h2>

        {video.owner ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="mb-1 text-slate-500">Username</dt>
              <dd className="text-slate-900">{video.owner.username}</dd>
            </div>

            <div>
              <dt className="mb-1 text-slate-500">Email</dt>
              <dd className="text-slate-900">{video.owner.email}</dd>
            </div>

            <div>
              <dt className="mb-1 text-slate-500">Active</dt>
              <dd className="text-slate-900">
                {video.owner.is_active ? 'Yes' : 'No'}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-slate-500">Storage limit</dt>
              <dd className="text-slate-900">{video.owner.storage_limit}</dd>
            </div>

            <div>
              <dt className="mb-1 text-slate-500">Used storage</dt>
              <dd className="text-slate-900">{video.owner.used_storage}</dd>
            </div>
          </dl>
        ) : (
          <div className="text-sm text-slate-500">Owner data not provided.</div>
        )}
      </section>
    </div>
  );
}