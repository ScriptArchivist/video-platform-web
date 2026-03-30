'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { parseApiError } from '@/shared/api/client';
import { resolveLiveHlsUrl } from '@/features/live/utils';
import {
  PageErrorState,
  PageNotFoundState,
} from '@/shared/ui/PageState';
import { ArrowLeft, Radio } from 'lucide-react';

export default function WatchLivePage() {
  const params = useParams();
  const rawStreamKey = params?.streamKey;
  const streamKey = typeof rawStreamKey === 'string' ? rawStreamKey : '';

  const sessionQuery = useLiveSession(streamKey || null);

  if (!streamKey) {
    return (
      <div className="space-y-6">
        <PageErrorState
          title="Invalid live stream link"
          description="The requested stream key is not valid."
        />
      </div>
    );
  }

  const session = sessionQuery.data ?? null;
  const hlsUrl = resolveLiveHlsUrl(session, streamKey);

  if (!sessionQuery.isLoading && !session && sessionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageErrorState
          title="Failed to load live stream"
          description={parseApiError(sessionQuery.error)}
        />
      </div>
    );
  }

  if (!sessionQuery.isLoading && !session && !hlsUrl) {
    return (
      <div className="space-y-6">
        <PageNotFoundState
          title="Live stream not found"
          description="This live stream is no longer available."
        />
      </div>
    );
  }

  const title = session?.title ?? 'Live stream';
  const displayStreamKey = session?.stream_key ?? streamKey;
  const status = session?.status;
  const isLive = status === 'started';
  const isOffline = status === 'stopped' || status === 'expired';

  return (
    <div className="flex min-h-[calc(100dvh-124px)] flex-col gap-5">
      <div className="app-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-500/14 px-3 py-1 text-xs font-medium text-red-100">
              <Radio className="h-3.5 w-3.5" />
              Live playback
            </div>

            <div>
              <h1 className="app-page-title">{title}</h1>
              <p className="mt-2 text-sm text-slate-300">
                Stream key: {displayStreamKey}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {status ? <LiveStatusBadge status={status} /> : null}

            <Link href="/live/active" className="app-btn-secondary gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to active sessions
            </Link>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="app-card min-h-0 p-4 sm:p-5">
          <div className="flex h-full min-h-[320px] items-center justify-center">
            {hlsUrl ? (
              <div className="w-full">
                <LivePlayerPanel src={hlsUrl} />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/8 text-sm text-slate-200 backdrop-blur-xl">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/16 bg-[#0f1a2f]/78 text-white shadow-sm backdrop-blur-xl">
                    <span className="text-lg">▶</span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {isLive
                        ? 'Stream is starting'
                        : isOffline
                        ? 'Stream is offline'
                        : 'Waiting for stream'}
                    </h3>

                    <p className="mx-auto max-w-xl text-sm leading-6 text-slate-300">
                      {isLive
                        ? 'The stream is live, but playback is still starting. This usually takes a few seconds.'
                        : isOffline
                        ? 'This live stream has ended.'
                        : 'The streamer has not started broadcasting yet.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="app-card p-5 sm:p-6">
          <h2 className="app-section-title">Session</h2>

          <div className="app-inset mt-4 p-4">
            <div className="text-sm font-medium text-white">Status</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {status === 'started'
                ? 'The stream is currently live.'
                : isOffline
                ? 'The stream is currently offline.'
                : sessionQuery.isLoading
                ? 'Loading live session details from the backend.'
                : 'The system is waiting for the stream to start.'}
            </p>
          </div>

          {sessionQuery.isError && session ? (
            <div className="app-alert-error mt-4">
              <p className="font-medium text-red-100">Session update error</p>
              <p className="mt-2 leading-6">{parseApiError(sessionQuery.error)}</p>
            </div>
          ) : null}

          {session?.error ? (
            <div className="app-alert-error mt-4">
              <p className="font-medium text-red-100">Stream error</p>
              <p className="mt-2 leading-6">{session.error}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}