'use client';

import { useParams } from 'next/navigation';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { parseApiError } from '@/shared/api/client';

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
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid stream key.
        </div>
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">
          Loading live session...
        </div>
      </div>
    );
  }

  if (sessionQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Failed to load live session:{' '}
          {parseApiError(sessionQuery.error)}
        </div>
      </div>
    );
  }

  const session = sessionQuery.data;

  if (!session) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">
          Live session not found.
        </div>
      </div>
    );
  }

  const hlsUrl = resolveLiveHlsUrl(session);
  const isLive = session.status === 'started';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.title ?? 'Live stream'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stream key: {session.stream_key}
          </p>
        </div>

        <LiveStatusBadge status={session.status} />
      </div>

      {hlsUrl ? (
        <LivePlayerPanel src={hlsUrl} />
      ) : (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
          {isLive
            ? 'Stream is starting... HLS will appear in a few seconds.'
            : 'Stream is not live.'}
        </div>
      )}

      {session.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {session.error}
        </div>
      ) : null}
    </div>
  );
}