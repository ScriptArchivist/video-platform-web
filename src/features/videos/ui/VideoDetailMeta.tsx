import type { VideoDetailDTO } from '../types';
import { VideoStatusBadge } from './VideoStatusBadge';
import { VisibilityBadge } from './VisibilityBadge';

interface VideoDetailMetaProps {
  video: VideoDetailDTO;
}

export function VideoDetailMeta({ video }: VideoDetailMetaProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <VideoStatusBadge status={video.status} />
          <VisibilityBadge visibility={video.visibility} />
        </div>

        <div className="mt-5">
          <h3 className="text-base font-semibold text-slate-900">
            Video metadata
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Main information and processing details for this video.
          </p>
        </div>

        <dl className="mt-5 space-y-4 text-sm">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="mb-1 text-slate-500">Title</dt>
            <dd className="font-medium text-slate-900">{video.title}</dd>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="mb-1 text-slate-500">Description</dt>
            <dd className="leading-6 text-slate-800">
              {video.description ?? '—'}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Duration</dt>
              <dd className="text-slate-800">{video.duration ?? '—'}</dd>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Size</dt>
              <dd className="text-slate-800">{video.size_bytes ?? '—'}</dd>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
              <dt className="mb-1 text-slate-500">MIME type</dt>
              <dd className="text-slate-800">{video.mime_type ?? '—'}</dd>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Uploaded at</dt>
              <dd className="text-slate-800">
                {new Date(video.uploaded_at).toLocaleString()}
              </dd>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Processed at</dt>
              <dd className="text-slate-800">
                {video.processed_at
                  ? new Date(video.processed_at).toLocaleString()
                  : '—'}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Owner</h3>
          <p className="mt-1 text-sm text-slate-500">
            Information about the user who uploaded this video.
          </p>
        </div>

        {video.owner ? (
          <dl className="mt-5 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Username</dt>
              <dd className="text-slate-900">{video.owner.username}</dd>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <dt className="mb-1 text-slate-500">Email</dt>
              <dd className="text-slate-900">{video.owner.email}</dd>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <dt className="mb-1 text-slate-500">Active</dt>
                <dd className="text-slate-900">
                  {video.owner.is_active ? 'Yes' : 'No'}
                </dd>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <dt className="mb-1 text-slate-500">Storage limit</dt>
                <dd className="text-slate-900">
                  {video.owner.storage_limit}
                </dd>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                <dt className="mb-1 text-slate-500">Used storage</dt>
                <dd className="text-slate-900">
                  {video.owner.used_storage}
                </dd>
              </div>
            </div>
          </dl>
        ) : (
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
            Owner data not provided.
          </div>
        )}
      </section>
    </div>
  );
}