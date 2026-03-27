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
import { ArrowLeft, PencilLine } from 'lucide-react';

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
      <div className="max-w-6xl space-y-6">
        <PageErrorState
          title="This video link is not valid"
          description="The requested video identifier could not be recognized."
        />
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageLoadingState
          title="Opening video page"
          description="We are loading video details, playback status, and related metadata."
        />
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageErrorState
          title="Unable to load this video"
          description={parseApiError(detailQuery.error).message}
        />
      </div>
    );
  }

  const video = detailQuery.data;

  if (!video) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageNotFoundState
          title="Video not found"
          description="This video does not exist anymore or is not available in the current catalog."
        />
      </div>
    );
  }

  const playbackUrl = playbackQuery.data?.hls_url ?? video.hls_url;
  const isPlayable = video.status === 'ready' && Boolean(playbackUrl);
  const showProcessingPanel = video.status !== 'ready';

  return (
    <div className="space-y-6">
      <header className="app-card flex flex-wrap items-start justify-between gap-4 p-6 sm:p-7">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">Video #{video.id}</p>
          <h1 className="app-page-title">{video.title}</h1>
          <p className="app-page-description">
            Review playback, current processing state, and all available
            metadata in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/videos" className="app-btn-secondary gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to videos
          </Link>

          <Link href={`/videos/${video.id}/edit`} className="app-btn-secondary gap-2">
            <PencilLine className="h-4 w-4" />
            Edit
          </Link>

          <DeleteVideoButton videoId={video.id} />
        </div>
      </header>

      {video.status === 'failed' ? (
        <div className="app-alert-warning p-6 shadow-sm">
          <p className="font-medium text-slate-900">
            Processing did not finish successfully
          </p>
          <p className="mt-2 leading-6">
            {video.error_message ??
              'This video could not be prepared for playback. Please review the details below.'}
          </p>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="app-section-title">Playback</h2>
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
          <div className="app-card p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <span className="text-lg">▶</span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Playback is not available yet
                </h3>
                <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
                  The video page is available, but the playback source has not
                  appeared yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {video.status === 'ready' && !playbackUrl ? (
          <div className="app-alert-warning p-6 shadow-sm">
            <p className="font-medium text-slate-900">Playback link is missing</p>
            <p className="mt-2 leading-6">
              The video is marked as ready, but the playback URL is not
              available yet.
            </p>
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="app-section-title">Details</h2>
        <VideoDetailMeta video={video} />
      </section>
    </div>
  );
}