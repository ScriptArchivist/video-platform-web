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
      <div className="max-w-6xl space-y-6 p-6">
        <PageErrorState
          title="This live stream link is not valid"
          description="The requested stream key could not be recognized."
        />
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageLoadingState
          title="Opening live stream"
          description="We are loading stream details and checking playback availability."
        />
      </div>
    );
  }

  if (sessionQuery.isError) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageErrorState
          title="Unable to load this live stream"
          description={parseApiError(sessionQuery.error)}
        />
      </div>
    );
  }

  const session = sessionQuery.data;

  if (!session) {
    return (
      <div className="max-w-6xl space-y-6 p-6">
        <PageNotFoundState
          title="Live session not found"
          description="This live session does not exist anymore or is no longer available."
        />
      </div>
    );
  }

  const hlsUrl = resolveLiveHlsUrl(session);
  const isLive = session.status === 'started';

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {session.title ?? 'Live stream'}
          </h1>
          <p className="text-sm text-slate-500">
            Stream key: {session.stream_key}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LiveStatusBadge status={session.status} />

          <Link
            href="/live/active"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to active sessions
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Playback
          </h2>

          <span className="text-sm text-slate-500">
            {session.status === 'started' ? 'Live now' : 'Waiting for stream'}
          </span>
        </div>

        {hlsUrl ? (
          <LivePlayerPanel src={hlsUrl} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <span className="text-lg">▶</span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {isLive ? 'Stream is starting' : 'Stream is offline'}
                </h3>
                <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
                  {isLive
                    ? 'The live session is active, but playback has not appeared yet. Please wait a moment.'
                    : 'Playback is not available because the stream is not currently broadcasting.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {session.error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-6 text-sm text-slate-700 shadow-sm">
          <p className="font-medium text-slate-900">Stream warning</p>
          <p className="mt-2 leading-6">{session.error}</p>
        </div>
      ) : null}
    </div>
  );
}