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
import { Radio } from 'lucide-react';

export default function ActiveLiveSessionsPage() {
  const activeQuery = useActiveLiveSessions();

  return (
    <div className="flex min-h-[calc(100dvh-124px)] flex-col gap-5">
      <header className="app-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              <Radio className="h-3.5 w-3.5" />
              Live monitoring
            </div>

            <div>
              <h1 className="app-page-title">Active live sessions</h1>
              <p className="app-page-description mt-2">
                View currently active live streams and open a watch page when
                playback is ready.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/live" className="app-btn-primary">
              Open live studio
            </Link>
          </div>
        </div>
      </header>

      <section className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="app-section-title">Sessions</h2>
          {activeQuery.data ? (
            <div className="text-sm text-slate-500">
              {activeQuery.data.length} session
              {activeQuery.data.length === 1 ? '' : 's'}
            </div>
          ) : null}
        </div>

        {activeQuery.isLoading ? (
          <PageLoadingState
            title="Looking for active live sessions"
            description="We are checking the backend for currently available streams."
          />
        ) : null}

        {activeQuery.isError ? (
          <PageErrorState
            title="Unable to load live sessions"
            description={parseApiError(activeQuery.error)}
          />
        ) : null}

        {!activeQuery.isLoading &&
        !activeQuery.isError &&
        (!activeQuery.data || activeQuery.data.length === 0) ? (
          <PageEmptyState
            title="No active live sessions right now"
            description="Start a new live session in Live Studio and it will appear here."
          />
        ) : null}

        {activeQuery.data && activeQuery.data.length > 0 ? (
          <div className="min-h-0 overflow-auto pr-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeQuery.data.map((session) => (
                <LiveSessionCard
                  key={`${session.stream_key}-${session.id ?? 'no-id'}`}
                  session={session}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}