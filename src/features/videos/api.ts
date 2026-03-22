import { apiClient } from '@/shared/api/client';
import type {
  CreateVideoPayload,
  GetVideosParams,
  UpdateVideoPayload,
  VideoDetailDTO,
  VideoListResponseDTO,
  VideoPlaybackDTO,
} from './types';

const VIDEO_API_BASE_URL = process.env.NEXT_PUBLIC_VIDEO_API_URL;

function getVideoApiBaseUrl(): string {
  if (!VIDEO_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_VIDEO_API_URL is not configured');
  }

  return VIDEO_API_BASE_URL;
}

export async function getVideos(
  params: GetVideosParams,
): Promise<VideoListResponseDTO> {
  const { data } = await apiClient.get<VideoListResponseDTO>('/videos', {
    baseURL: getVideoApiBaseUrl(),
    params,
  });

  return data;
}

export async function getVideoById(
  videoId: number,
  options?: { consistent?: boolean },
): Promise<VideoDetailDTO> {
  const { data } = await apiClient.get<VideoDetailDTO>(`/videos/${videoId}`, {
    baseURL: getVideoApiBaseUrl(),
    params: options?.consistent ? { consistent: 1 } : undefined,
  });

  return data;
}

export async function getVideoPlayback(
  videoId: number,
  options?: { consistent?: boolean },
): Promise<VideoPlaybackDTO> {
  const { data } = await apiClient.get<VideoPlaybackDTO>(
    `/videos/${videoId}/playback`,
    {
      baseURL: getVideoApiBaseUrl(),
      params: options?.consistent ? { consistent: 1 } : undefined,
    },
  );

  return data;
}

export async function createVideo(
  payload: CreateVideoPayload,
): Promise<VideoDetailDTO> {
  const { data } = await apiClient.post<VideoDetailDTO>('/videos', payload, {
    baseURL: getVideoApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data;
}

export async function updateVideo(
  videoId: number,
  payload: UpdateVideoPayload,
): Promise<VideoDetailDTO> {
  const { data } = await apiClient.patch<VideoDetailDTO>(
    `/videos/${videoId}`,
    payload,
    {
      baseURL: getVideoApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return data;
}

export async function deleteVideo(videoId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}`, {
    baseURL: getVideoApiBaseUrl(),
  });
}