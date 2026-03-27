import type { VideoDetailDTO } from '../types';
import { VideoStatusBadge } from './VideoStatusBadge';
import { VisibilityBadge } from './VisibilityBadge';

interface VideoDetailMetaProps {
  video: VideoDetailDTO;
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
}

function formatValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}

export function VideoDetailMeta({ video }: VideoDetailMetaProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="app-card p-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <VideoStatusBadge status={video.status} />
          <VisibilityBadge visibility={video.visibility} />
        </div>

        <div className="mt-5">
          <h3 className="app-section-title">Video details</h3>
          <p className="mt-1 text-sm text-slate-500">
            Main information and processing details for this video.
          </p>
        </div>

        <dl className="mt-5 space-y-4 text-sm">
          <div className="app-inset p-4">
            <dt className="mb-1 text-slate-500">Title</dt>
            <dd className="font-medium text-slate-900">{formatValue(video.title)}</dd>
          </div>

          <div className="app-inset p-4">
            <dt className="mb-1 text-slate-500">Description</dt>
            <dd className="leading-6 text-slate-800">
              {formatValue(video.description)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Duration</dt>
              <dd className="text-slate-800">{formatValue(video.duration)}</dd>
            </div>

            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Size</dt>
              <dd className="text-slate-800">{formatValue(video.size_bytes)}</dd>
            </div>

            <div className="app-inset p-4 sm:col-span-2">
              <dt className="mb-1 text-slate-500">MIME type</dt>
              <dd className="text-slate-800">{formatValue(video.mime_type)}</dd>
            </div>

            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Uploaded at</dt>
              <dd className="text-slate-800">{formatDate(video.uploaded_at)}</dd>
            </div>

            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Processed at</dt>
              <dd className="text-slate-800">{formatDate(video.processed_at)}</dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="app-card p-6">
        <div>
          <h3 className="app-section-title">Owner</h3>
          <p className="mt-1 text-sm text-slate-500">
            Information about the user who uploaded this video.
          </p>
        </div>

        {video.owner ? (
          <dl className="mt-5 space-y-4 text-sm">
            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Username</dt>
              <dd className="text-slate-900">
                {formatValue(video.owner.username)}
              </dd>
            </div>

            <div className="app-inset p-4">
              <dt className="mb-1 text-slate-500">Email</dt>
              <dd className="text-slate-900">{formatValue(video.owner.email)}</dd>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="app-inset p-4">
                <dt className="mb-1 text-slate-500">Active</dt>
                <dd className="text-slate-900">
                  {video.owner.is_active ? 'Yes' : 'No'}
                </dd>
              </div>

              <div className="app-inset p-4">
                <dt className="mb-1 text-slate-500">Storage limit</dt>
                <dd className="text-slate-900">
                  {formatValue(video.owner.storage_limit)}
                </dd>
              </div>

              <div className="app-inset p-4 sm:col-span-2">
                <dt className="mb-1 text-slate-500">Used storage</dt>
                <dd className="text-slate-900">
                  {formatValue(video.owner.used_storage)}
                </dd>
              </div>
            </div>
          </dl>
        ) : (
          <div className="app-inset mt-5 p-4 text-sm text-slate-500">
            Owner data not available.
          </div>
        )}
      </section>
    </div>
  );
}