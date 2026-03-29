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
import { Upload, Radio, PlaySquare, Video } from 'lucide-react';

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
    <div className="space-y-5">
      <header className="app-card p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <h1 className="app-page-title">Videos</h1>
            <p className="app-page-description">
              Browse uploaded videos, filter the catalog, and open a video for
              playback or editing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/videos" className="app-btn-primary gap-2">
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

            <Link href="/live/active" className="app-btn-secondary gap-2">
              <PlaySquare className="h-4 w-4" />
              Active Live
            </Link>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="app-card p-6">
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
        {videosQuery.isLoading && !videosQuery.data ? (
          <PageLoadingState
            title="Preparing video catalog"
            description="We are loading the latest videos and current filters."
          />
        ) : null}

        {videosQuery.isError ? (
          <PageErrorState
            title="Unable to open the video catalog"
            description={parseApiError(videosQuery.error)}
          />
        ) : null}

        {videosQuery.data && videosQuery.data.items.length === 0 ? (
          <PageEmptyState
            title={hasFilters ? 'No videos match these filters' : 'No videos yet'}
            description={
              hasFilters
                ? 'Try changing the search text or visibility filter to broaden the results.'
                : 'Upload the first video to start building your catalog.'
            }
          />
        ) : null}

        {videosQuery.data && videosQuery.data.items.length > 0 ? (
          <div className={`space-y-4 ${videosQuery.isFetching ? 'opacity-60' : ''}`}>
            <div className="app-card p-6">
              <VideosTable items={videosQuery.data.items} />
            </div>

            <div className="app-card p-4">
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