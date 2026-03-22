'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVideo } from '../api';
import { videoQueryKeys } from '../queryKeys';

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: videoQueryKeys.all,
      });
    },
  });
}