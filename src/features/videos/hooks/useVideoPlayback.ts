'use client';

import { useQuery } from '@tanstack/react-query';
import { getVideoPlayback } from '../api';
import { videoQueryKeys } from '../queryKeys';

export function useVideoPlayback(videoId: number, enabled = true) {
  return useQuery({
    queryKey: videoQueryKeys.playback(videoId),
    queryFn: () => getVideoPlayback(videoId, { consistent: true }),
    enabled: enabled && Number.isFinite(videoId),
  });
}