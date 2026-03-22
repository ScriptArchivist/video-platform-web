'use client';

import { useQuery } from '@tanstack/react-query';
import { getLiveSession } from '../api';
import { liveQueryKeys } from '../queryKeys';

const TERMINAL_STATUSES = new Set(['stopped', 'expired', 'error']);

export function useLiveSession(streamKey: string | null) {
  return useQuery({
    queryKey: liveQueryKeys.session(streamKey ?? ''),
    queryFn: () => getLiveSession(streamKey as string),
    enabled: Boolean(streamKey),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 5000;
      return TERMINAL_STATUSES.has(status) ? false : 5000;
    },
  });
}