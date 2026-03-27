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
      <div className="space-y-6">
        <PageErrorState
          title="This video link is not valid"
          description="The requested video identifier could not be recognized."
        />
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageLoadingState
          title="Opening video page"
          description="We are loading video details, playback status, and related metadata."
        />
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="space-y-6">
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
      <div className="space-y-6">
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
    <div className="flex min-h-[calc(100dvh-124px)] flex-col gap-4 xl:overflow-hidden">
      <header className="app-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to videos
            </Link>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Video #{video.id}</p>
              <h1 className="app-page-title">{video.title}</h1>
              <p className="app-page-description">
                Review playback, processing state, and video metadata in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/videos/${video.id}/edit`}
              className="app-btn-secondary gap-2"
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Link>

            <DeleteVideoButton videoId={video.id} />
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <section className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="app-section-title">Playback</h2>
            <span className="text-sm text-slate-500">
              {video.status === 'ready'
                ? 'Playback is ready.'
                : 'Playback will appear when processing finishes.'}
            </span>
          </div>

          <div className="app-card flex min-h-0 flex-1 p-4 sm:p-5">
            <div className="flex min-h-[260px] w-full flex-1 items-center justify-center xl:min-h-0">
              {isPlayable ? (
                <div className="w-full">
                  <VideoPlaybackPanel src={playbackUrl!} />
                </div>
              ) : showProcessingPanel ? (
                <div className="w-full">
                  <ProcessingStatePanel
                    status={video.status}
                    errorMessage={video.error_message}
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                  Playback is not available yet
                </div>
              )}
            </div>
          </div>

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

        <section className="min-h-0 space-y-3 xl:overflow-auto">
          <h2 className="app-section-title">Details</h2>
          <VideoDetailMeta video={video} />
        </section>
      </div>
    </div>
  );
}