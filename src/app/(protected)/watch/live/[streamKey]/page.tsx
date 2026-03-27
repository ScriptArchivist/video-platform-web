'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { parseApiError } from '@/shared/api/client';
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/PageState';
import { ArrowLeft, Radio } from 'lucide-react';

function resolveLiveHlsUrl(session: {
  hls_url?: string | null;
  thumbnail_url?: string | null;
}): string | null {
  if (session.hls_url) {
    return session.hls_url;
  }

  if (session.thumbnail_url && session.thumbnail_url.endsWith('/thumb.jpg')) {
    return session.thumbnail_url.replace(/\/thumb\.jpg$/, '/master.m3u8');
  }

  return null;
}

export default function WatchLivePage() {
  const params = useParams();
  const rawStreamKey = params?.streamKey;
  const streamKey = typeof rawStreamKey === 'string' ? rawStreamKey : '';

  const sessionQuery = useLiveSession(streamKey || null);

  if (!streamKey) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageErrorState
          title="Invalid live stream link"
          description="The requested stream key is not valid."
        />
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageLoadingState
          title="Opening live stream"
          description="Connecting to the stream and preparing playback..."
        />
      </div>
    );
  }

  if (sessionQuery.isError) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageErrorState
          title="Failed to load live stream"
          description={parseApiError(sessionQuery.error)}
        />
      </div>
    );
  }

  const session = sessionQuery.data;

  if (!session) {
    return (
      <div className="max-w-6xl space-y-6">
        <PageNotFoundState
          title="Live stream not found"
          description="This live stream is no longer available."
        />
      </div>
    );
  }

  const hlsUrl = resolveLiveHlsUrl(session);
  const isLive = session.status === 'started';
  const isOffline =
    session.status === 'stopped' || session.status === 'expired';

  return (
    <div className="space-y-6">
      <div className="app-card flex flex-wrap items-start justify-between gap-4 p-6 sm:p-7">
        <div className="min-w-0 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            <Radio className="h-3.5 w-3.5" />
            Live playback
          </div>

          <div>
            <h1 className="app-page-title">{session.title ?? 'Live stream'}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Stream key: {session.stream_key}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LiveStatusBadge status={session.status} />

          <Link href="/live/active" className="app-btn-secondary gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to active sessions
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="app-section-title">Playback</h2>

          <span className="text-sm text-slate-500">
            {isLive ? 'Live now' : isOffline ? 'Offline' : 'Waiting for stream'}
          </span>
        </div>

        {hlsUrl ? (
          <LivePlayerPanel src={hlsUrl} />
        ) : (
          <div className="app-card p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <span className="text-lg">▶</span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {isLive
                    ? 'Stream is starting'
                    : isOffline
                      ? 'Stream is offline'
                      : 'Waiting for stream'}
                </h3>

                <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
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
      </section>

      {session.error ? (
        <div className="app-alert-error p-6 shadow-sm">
          <p className="font-medium text-red-800">Stream error</p>
          <p className="mt-2 leading-6">{session.error}</p>
        </div>
      ) : null}
    </div>
  );
}