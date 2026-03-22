'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveLiveSessions } from '../api';
import { liveQueryKeys } from '../queryKeys';

export function useActiveLiveSessions() {
  return useQuery({
    queryKey: liveQueryKeys.active,
    queryFn: getActiveLiveSessions,
    refetchInterval: 5000,
  });
}