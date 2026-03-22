'use client';

import { useQuery } from '@tanstack/react-query';
import { getVideos } from '../api';
import { videoQueryKeys } from '../queryKeys';
import type { GetVideosParams } from '../types';

export function useVideosList(params: GetVideosParams) {
  return useQuery({
    queryKey: videoQueryKeys.list(params),
    queryFn: () => getVideos(params),
    placeholderData: (previousData) => previousData,
  });
}