'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useVideoPlayback } from '@/features/videos/hooks/useVideoPlayback';
import { VideoDetailMeta } from '@/features/videos/ui/VideoDetailMeta';
import { VideoPlaybackPanel } from '@/features/videos/ui/VideoPlaybackPanel';
import { DeleteVideoButton } from '@/features/videos/ui/DeleteVideoButton';
import { ProcessingStatePanel } from '@/features/upload/ui/ProcessingStatePanel';
import { parseApiError } from '@/shared/api/client';
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/PageState';

export default function VideoDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const videoId = Number(rawId);

  const detailQuery = useVideoDetail(videoId);
  const playbackQuery = useVideoPlayback(
    videoId,
    Boolean(detailQuery.data?.hls_ready),
  );

  if (!Number.isFinite(videoId)) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageErrorState
          title="Invalid video id"
          description="The requested video id is not valid."
        />
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageLoadingState
          title="Loading video"
          description="Fetching video details and current processing state."
        />
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageErrorState
          title="Failed to load video"
          description={parseApiError(detailQuery.error).message}
        />
      </div>
    );
  }

  const video = detailQuery.data;

  if (!video) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageNotFoundState
          title="Video not found"
          description="The requested video does not exist or is no longer available."
        />
      </div>
    );
  }

  const playbackUrl = playbackQuery.data?.hls_url ?? video.hls_url;
  const isPlayable = video.status === 'ready' && Boolean(playbackUrl);
  const showProcessingPanel = video.status !== 'ready';

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-white p-6">
        <div className="min-w-0 space-y-2">
          <p className="text-sm text-slate-500">Video #{video.id}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {video.title}
          </h1>
          <p className="text-sm text-slate-500">
            Review playback, current processing state, and all available
            metadata in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/videos"
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to videos
          </Link>

          <Link
            href={`/videos/${video.id}/edit`}
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <DeleteVideoButton videoId={video.id} />
        </div>
      </div>

      {video.status === 'failed' ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-medium">Processing failed</p>
          <p className="mt-1">
            {video.error_message ?? 'This video could not be processed for playback.'}
          </p>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Playback</h2>
          <span className="text-sm text-slate-500">
            {video.status === 'ready'
              ? 'Playback is ready.'
              : 'Playback will appear when processing finishes.'}
          </span>
        </div>

        {isPlayable ? (
          <VideoPlaybackPanel src={playbackUrl!} />
        ) : showProcessingPanel ? (
          <ProcessingStatePanel
            status={video.status}
            errorMessage={video.error_message}
          />
        ) : (
          <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
            Playback is not available yet.
          </div>
        )}

        {video.status === 'ready' && !playbackUrl ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
            Video is marked as ready, but the playback URL is not available.
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Details</h2>
        <VideoDetailMeta video={video} />
      </section>
    </div>
  );
}