'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useVideosList } from '@/features/videos/hooks/useVideosList';
import { VideoFilters } from '@/features/videos/ui/VideoFilters';
import { VideosTable } from '@/features/videos/ui/VideosTable';
import { PaginationControls } from '@/features/videos/ui/PaginationControls';
import type { VideoStatus, VideoVisibility } from '@/features/videos/types';
import { parseApiError } from '@/shared/api/client';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
} from '@/shared/ui/PageState';

const ALLOWED_STATUSES: VideoStatus[] = [
  'uploading',
  'uploaded',
  'processing',
  'ready',
  'failed',
];

const ALLOWED_VISIBILITY: VideoVisibility[] = [
  'public',
  'private',
  'unlisted',
];

function parseStatus(value: string | null): VideoStatus | undefined {
  if (!value) return undefined;
  return ALLOWED_STATUSES.includes(value as VideoStatus)
    ? (value as VideoStatus)
    : undefined;
}

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
  const initialStatus = parseStatus(searchParams.get('status'));
  const initialVisibility = parseVisibility(searchParams.get('visibility'));
  const initialPage = parsePage(searchParams.get('page'));

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<VideoStatus | undefined>(initialStatus);
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

    if (search) {
      params.set('search', search);
    }

    if (status) {
      params.set('status', status);
    }

    if (visibility) {
      params.set('visibility', visibility);
    }

    if (page > 1) {
      params.set('page', String(page));
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [search, status, visibility, page, pathname, router]);

  const params = useMemo(
    () => ({
      search: search || undefined,
      status,
      visibility,
      page,
      per_page: 20,
    }),
    [search, status, visibility, page],
  );

  const videosQuery = useVideosList(params);

  const hasFilters = Boolean(search || status || visibility);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Просмотр загруженных видео и их статусов обработки.
        </p>
      </div>

      <VideoFilters
        search={searchInput}
        status={status}
        visibility={visibility}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onVisibilityChange={(value) => {
          setVisibility(value);
          setPage(1);
        }}
      />

      {videosQuery.isLoading ? (
        <PageLoadingState
          title="Загрузка видео"
          description="Получаем список видео с backend."
        />
      ) : null}

      {videosQuery.isError ? (
        <PageErrorState
          title="Не удалось загрузить видео"
          description={parseApiError(videosQuery.error)}
        />
      ) : null}

      {videosQuery.data && videosQuery.data.items.length === 0 ? (
        <PageEmptyState
          title={hasFilters ? 'Ничего не найдено' : 'Видео отсутствуют'}
          description={
            hasFilters
              ? 'Попробуй изменить фильтры поиска.'
              : 'Загрузи первое видео, чтобы оно появилось здесь.'
          }
        />
      ) : null}

      {videosQuery.data && videosQuery.data.items.length > 0 ? (
        <>
          <VideosTable items={videosQuery.data.items} />

          <PaginationControls
            page={videosQuery.data.page}
            perPage={videosQuery.data.per_page}
            total={videosQuery.data.total}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  );
}