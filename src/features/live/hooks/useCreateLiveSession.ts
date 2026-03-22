'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLiveSession } from '../api';
import { liveQueryKeys } from '../queryKeys';
import { createIdempotencyKey } from '../utils';
import type { CreateLiveSessionPayload } from '../types';

export function useCreateLiveSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLiveSessionPayload) =>
      createLiveSession(payload, createIdempotencyKey()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: liveQueryKeys.active,
      });
    },
  });
}