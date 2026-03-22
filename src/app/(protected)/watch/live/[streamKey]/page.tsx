'use client';

import { useParams } from 'next/navigation';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { useActiveLiveSessions } from '@/features/live/hooks/useActiveLiveSessions';
import { parseApiError } from '@/shared/api/client';

export default function WatchLivePage() {
  const params = useParams();
  const rawStreamKey = params?.streamKey;
  const streamKey = typeof rawStreamKey === 'string' ? rawStreamKey : '';

  const sessionQuery = useLiveSession(streamKey || null);
  const activeQuery = useActiveLiveSessions();

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
          Failed to load live session: {parseApiError(sessionQuery.error).message}
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

  const activeMatch = activeQuery.data?.find(
    (item) => item.stream_key === session.stream_key,
  );

  const hlsUrl = activeMatch?.hls_url ?? null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.title}
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
          HLS URL is not available for this route response.
          <br />
          TODO: backend contract for <code>GET /live/sessions/{"{stream_key}"}</code> does not include <code>hls_url</code>.
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