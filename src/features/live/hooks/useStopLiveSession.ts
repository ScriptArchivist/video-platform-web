'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stopLiveSession } from '../api';
import { liveQueryKeys } from '../queryKeys';

export function useStopLiveSession(streamKey?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => stopLiveSession(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: liveQueryKeys.active,
      });

      if (streamKey) {
        await queryClient.invalidateQueries({
          queryKey: liveQueryKeys.session(streamKey),
        });

        queryClient.removeQueries({
          queryKey: liveQueryKeys.session(streamKey),
        });
      }
    },
  });
}