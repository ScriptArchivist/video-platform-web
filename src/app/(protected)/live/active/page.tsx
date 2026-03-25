'use client';

import Link from 'next/link';
import { useActiveLiveSessions } from '@/features/live/hooks/useActiveLiveSessions';
import { LiveSessionCard } from '@/features/live/ui/LiveSessionCard';
import { parseApiError } from '@/shared/api/client';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
} from '@/shared/ui/PageState';

export default function ActiveLiveSessionsPage() {
  const activeQuery = useActiveLiveSessions();

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-white p-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Active live sessions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View currently active live streams and open a watch page when playback is ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/live"
            className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open live studio
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Sessions</h2>

        {activeQuery.isLoading && (
          <PageLoadingState
            title="Loading active live sessions"
            description="Fetching live sessions from backend."
          />
        )}

        {activeQuery.isError && (
          <PageErrorState
            title="Failed to load active live sessions"
            description={parseApiError(activeQuery.error)}
          />
        )}

        {!activeQuery.isLoading &&
        !activeQuery.isError &&
        (!activeQuery.data || activeQuery.data.length === 0) ? (
          <PageEmptyState
            title="No active live sessions"
            description="Start a new live session in Live Studio."
          />
        ) : null}

        {activeQuery.data && activeQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activeQuery.data.map((session) => (
              <LiveSessionCard
                key={`${session.stream_key}-${session.id ?? 'no-id'}`}
                session={session}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}