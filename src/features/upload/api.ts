import { apiClient } from '@/shared/api/client';
import type {
  CompleteUploadResponse,
  InitUploadResponse,
} from './types';

const UPLOAD_API_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

function getUploadApiBaseUrl(): string {
  if (!UPLOAD_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_UPLOAD_API_URL is not configured');
  }

  return UPLOAD_API_BASE_URL;
}

export async function initUpload(
  videoId: number,
  filename: string,
): Promise<InitUploadResponse> {
  const { data } = await apiClient.post<InitUploadResponse>('/uploads/init', null, {
    baseURL: getUploadApiBaseUrl(),
    params: {
      video_id: videoId,
      filename,
    },
  });

  return data;
}

export async function uploadBinaryFile(
  uploadId: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  await apiClient.post(`/uploads/${uploadId}/file`, formData, {
    baseURL: getUploadApiBaseUrl(),
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (!event.total) return;

      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress?.(progress);
    },
  });
}

export async function completeUpload(
  uploadId: string,
  size: number,
  contentType: string,
): Promise<CompleteUploadResponse> {
  const { data } = await apiClient.post<CompleteUploadResponse>(
    `/uploads/${uploadId}/complete`,
    null,
    {
      baseURL: getUploadApiBaseUrl(),
      params: {
        size,
        content_type: contentType,
      },
    },
  );

  return data;
}