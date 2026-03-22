'use client';

import { useMemo, useState } from 'react';
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

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VideoStatus | undefined>(undefined);
  const [visibility, setVisibility] = useState<VideoVisibility | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

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

  if (videosQuery.isLoading) {
    return (
      <div className="p-6">
        <PageLoadingState
          title="Загрузка видео"
          description="Получаем список видео с backend."
        />
      </div>
    );
  }

  if (videosQuery.isError) {
    return (
      <div className="p-6">
        <PageErrorState
          title="Не удалось загрузить видео"
          description={parseApiError(videosQuery.error).message}
        />
      </div>
    );
  }

  if (!videosQuery.data || videosQuery.data.items.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Просмотр загруженных видео и их статусов обработки.
          </p>
        </div>

        <VideoFilters
          search={search}
          status={status}
          visibility={visibility}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onVisibilityChange={(value) => {
            setVisibility(value);
            setPage(1);
          }}
        />

        <PageEmptyState
          title="Видео не найдены"
          description="Попробуй изменить фильтры или загрузить новое видео."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Просмотр загруженных видео и их статусов обработки.
        </p>
      </div>

      <VideoFilters
        search={search}
        status={status}
        visibility={visibility}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onVisibilityChange={(value) => {
          setVisibility(value);
          setPage(1);
        }}
      />

      <VideosTable items={videosQuery.data.items} />

      <PaginationControls
        page={videosQuery.data.page}
        perPage={videosQuery.data.per_page}
        total={videosQuery.data.total}
        onPageChange={setPage}
      />
    </div>
  );
}