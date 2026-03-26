'use client';

import { useQuery } from '@tanstack/react-query';
import { getVideoById } from '../api';
import { videoQueryKeys } from '../queryKeys';

const POLLABLE_VIDEO_STATUSES = new Set([
  'uploading',
  'uploaded',
  'processing',
]);

export function useVideoDetail(videoId: number) {
  return useQuery({
    queryKey: videoQueryKeys.detail(videoId),
    queryFn: () => getVideoById(videoId, { consistent: true }),
    enabled: Number.isFinite(videoId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLABLE_VIDEO_STATUSES.has(status) ? 3000 : false;
    },
  });
}