'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useVideosList } from '@/features/videos/hooks/useVideosList';
import { VideoFilters } from '@/features/videos/ui/VideoFilters';
import { VideosTable } from '@/features/videos/ui/VideosTable';
import { PaginationControls } from '@/features/videos/ui/PaginationControls';
import type { VideoVisibility } from '@/features/videos/types';
import { parseApiError } from '@/shared/api/client';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
} from '@/shared/ui/PageState';

const ALLOWED_VISIBILITY: VideoVisibility[] = [
  'public',
  'private',
  'unlisted',
];

function parseVisibility(value: string | null): VideoVisibility | undefined {
  if (!value) return undefined;
  return ALLOWED_VISIBILITY.includes(value as VideoVisibility)
    ? (value as VideoVisibility)
    : undefined;
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function VideosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') ?? '';
  const initialVisibility = parseVisibility(searchParams.get('visibility'));
  const initialPage = parsePage(searchParams.get('page'));

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [visibility, setVisibility] = useState<VideoVisibility | undefined>(
    initialVisibility,
  );
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (visibility) params.set('visibility', visibility);
    if (page > 1) params.set('page', String(page));

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [search, visibility, page, pathname, router]);

  const params = useMemo(
    () => ({
      search: search || undefined,
      visibility,
      page,
      per_page: 20,
    }),
    [search, visibility, page],
  );

  const videosQuery = useVideosList(params);
  const hasFilters = Boolean(search || visibility);

  useEffect(() => {
    if (!videosQuery.data) return;
    if (videosQuery.data.items.length === 0 && page > 1) {
      setPage(1);
    }
  }, [videosQuery.data, page]);

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Videos
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Browse uploaded videos, filter the catalog, and open a video for
            playback or editing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/videos/new"
            className="inline-flex h-10 items-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Upload video
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Filters
        </h2>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <VideoFilters
            search={searchInput}
            visibility={visibility}
            onSearchChange={setSearchInput}
            onVisibilityChange={(value) => {
              setVisibility(value);
              setPage(1);
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setVisibility(undefined);
              setPage(1);
            }}
            showReset={hasFilters}
            total={videosQuery.data?.total}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Results
        </h2>

        {videosQuery.isLoading && !videosQuery.data ? (
          <PageLoadingState
            title="Loading videos"
            description="Fetching the current video list."
          />
        ) : null}

        {videosQuery.isError ? (
          <PageErrorState
            title="Failed to load videos"
            description={parseApiError(videosQuery.error)}
          />
        ) : null}

        {videosQuery.data && videosQuery.data.items.length === 0 ? (
          <PageEmptyState
            title={hasFilters ? 'No videos found' : 'No videos yet'}
            description={
              hasFilters
                ? 'Try changing the search query or visibility filter.'
                : 'Upload the first video to start filling the catalog.'
            }
          />
        ) : null}

        {videosQuery.data && videosQuery.data.items.length > 0 ? (
          <div className={`space-y-4 ${videosQuery.isFetching ? 'opacity-60' : ''}`}>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <VideosTable items={videosQuery.data.items} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PaginationControls
                page={videosQuery.data.page}
                perPage={videosQuery.data.per_page}
                total={videosQuery.data.total}
                onPageChange={setPage}
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}