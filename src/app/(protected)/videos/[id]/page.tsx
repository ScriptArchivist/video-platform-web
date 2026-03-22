'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useVideoPlayback } from '@/features/videos/hooks/useVideoPlayback';
import { VideoDetailMeta } from '@/features/videos/ui/VideoDetailMeta';
import { VideoPlaybackPanel } from '@/features/videos/ui/VideoPlaybackPanel';
import { DeleteVideoButton } from '@/features/videos/ui/DeleteVideoButton';
import { parseApiError } from '@/shared/api/client';

export default function VideoDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const videoId = Number(rawId);

  const detailQuery = useVideoDetail(videoId);
  const playbackQuery = useVideoPlayback(videoId, Boolean(detailQuery.data?.hls_ready));

  if (!Number.isFinite(videoId)) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid video id.
        </div>
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">
          Loading video...
        </div>
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Failed to load video: {parseApiError(detailQuery.error).message}
        </div>
      </div>
    );
  }

  const video = detailQuery.data;

  if (!video) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">
          Video not found.
        </div>
      </div>
    );
  }

  const playbackUrl = playbackQuery.data?.hls_url ?? video.hls_url;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{video.title}</h1>
          <p className="mt-1 text-sm text-slate-500">Video #{video.id}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/videos/${video.id}/edit`}
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <DeleteVideoButton videoId={video.id} />
        </div>
      </div>

      {video.status === 'failed' && video.error_message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {video.error_message}
        </div>
      ) : null}

      {video.status === 'ready' && playbackUrl ? (
        <VideoPlaybackPanel src={playbackUrl} />
      ) : (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
          {video.status === 'failed'
            ? 'Playback unavailable because processing failed.'
            : 'Playback is not available yet.'}
        </div>
      )}

      <VideoDetailMeta video={video} />
    </div>
  );
}