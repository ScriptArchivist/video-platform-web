'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVideo } from '../api';
import { videoQueryKeys } from '../queryKeys';
import type { UpdateVideoPayload } from '../types';

interface UpdateVideoMutationArgs {
  videoId: number;
  payload: UpdateVideoPayload;
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, payload }: UpdateVideoMutationArgs) =>
      updateVideo(videoId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: videoQueryKeys.detail(variables.videoId),
        }),
        queryClient.invalidateQueries({
          queryKey: videoQueryKeys.all,
        }),
      ]);
    },
  });
}