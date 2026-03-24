'use client';

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

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // URL sync
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Просмотр загруженных видео.
        </p>
      </div>

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

      {videosQuery.isLoading && !videosQuery.data && (
        <PageLoadingState title="Загрузка видео" />
      )}

      {videosQuery.isError && (
        <PageErrorState
          title="Ошибка загрузки"
          description={parseApiError(videosQuery.error)}
        />
      )}

      {videosQuery.data && videosQuery.data.items.length === 0 && (
        <PageEmptyState
          title={hasFilters ? 'Ничего не найдено' : 'Видео отсутствуют'}
        />
      )}

      {videosQuery.data && videosQuery.data.items.length > 0 && (
        <div className={videosQuery.isFetching ? 'opacity-60' : ''}>
          <VideosTable items={videosQuery.data.items} />

          <PaginationControls
            page={videosQuery.data.page}
            perPage={videosQuery.data.per_page}
            total={videosQuery.data.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}