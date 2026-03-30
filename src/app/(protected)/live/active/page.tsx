'use client';

import Link from 'next/link';
import { Radio, PlaySquare, Video, Upload } from 'lucide-react';
import { useActiveLiveSessions } from '@/features/live/hooks/useActiveLiveSessions';
import { LiveSessionCard } from '@/features/live/ui/LiveSessionCard';

export default function ActiveLivePage() {
  const activeQuery = useActiveLiveSessions();

  return (
    <div className="flex flex-col gap-4">
      <div className="app-card p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-500/14 px-3 py-1 text-xs text-red-100">
              <Radio className="h-3.5 w-3.5" />
              Active live streams
            </div>

            <div>
              <h1 className="app-page-title">Live now</h1>
              <p className="app-page-description">
                Watch currently active live streams.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/videos" className="app-btn-secondary gap-2">
              <Video className="h-4 w-4" />
              Videos
            </Link>

            <Link href="/videos/new" className="app-btn-secondary gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </Link>

            <Link href="/live" className="app-btn-secondary gap-2">
              <Radio className="h-4 w-4" />
              Live Studio
            </Link>

            <Link href="/live/active" className="app-btn-primary gap-2">
              <PlaySquare className="h-4 w-4" />
              Active Live
            </Link>
          </div>
        </div>
      </div>

      {activeQuery.isLoading ? (
        <div className="text-sm text-slate-300">Loading live streams...</div>
      ) : activeQuery.isError ? (
        <div className="app-alert-error">Failed to load live streams</div>
      ) : !activeQuery.data || activeQuery.data.length === 0 ? (
        <div className="text-sm text-slate-300">No active streams right now</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {activeQuery.data.map((session) => (
            <LiveSessionCard
              key={`${session.stream_key}-${session.id ?? 'no-id'}`}
              session={session}
            />
          ))}
        </div>
      )}
    </div>
  );
}