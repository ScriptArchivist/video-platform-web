'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import type { ActiveLiveItemDTO } from '../types';
import { LiveStatusBadge } from './LiveStatusBadge';
import { Radio } from 'lucide-react';

interface LiveSessionCardProps {
  session: ActiveLiveItemDTO;
}

function formatStartedAt(value?: string | null) {
  if (!value) {
    return 'Start time is not available';
  }

  return new Date(value).toLocaleString();
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const href = `/watch/live/${session.stream_key}`;

  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    if (!session.hls_url) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        `live:hls:${session.stream_key}`,
        session.hls_url,
      );
    } catch {}
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="block h-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
    >
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/14 hover:shadow-xl">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/8">
          {session.thumbnail_url ? (
            <img
              src={session.thumbnail_url}
              alt={session.title || 'Live stream'}
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/16 bg-[#0f1a2f]/78 shadow-sm backdrop-blur-xl">
                <Radio className="h-6 w-6 text-white" />
              </div>
              No preview
            </div>
          )}

          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            LIVE
          </div>

          <div className="absolute right-3 top-3">
            <LiveStatusBadge status={session.status as any} />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                {session.title || 'Live stream'}
              </div>

              <div className="truncate text-xs text-slate-200">
                {session.owner_name || 'Unknown streamer'}
              </div>

              <div className="truncate text-xs text-slate-400">
                {formatStartedAt(session.started_at)}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}