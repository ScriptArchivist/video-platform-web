'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVideo } from '@/features/videos/api';
import { videoQueryKeys } from '@/features/videos/queryKeys';
import { completeUpload, initUpload, uploadBinaryFile } from '../api';
import type { UploadVideoFlowInput } from '../types';

export function useUploadVideoFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UploadVideoFlowInput) => {
      const createdVideo = await createVideo({
        title: input.title,
        description: input.description,
        visibility: input.visibility,
      });

      const initResult = await initUpload(createdVideo.id, input.file.name);

      await uploadBinaryFile(initResult.upload_id, input.file, input.onProgress);

      await completeUpload(
        initResult.upload_id,
        input.file.size,
        input.file.type || 'application/octet-stream',
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: videoQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: videoQueryKeys.detail(createdVideo.id),
        }),
      ]);

      return createdVideo;
    },
  });
}