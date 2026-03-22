import { apiClient } from '@/shared/api/client';
import type {
  ActiveLiveItemDTO,
  CreateLiveSessionPayload,
  CreateLiveSessionResponse,
  LiveSessionDTO,
} from './types';

const LIVE_API_BASE_URL = process.env.NEXT_PUBLIC_LIVE_API_URL;

function getLiveApiBaseUrl(): string {
  if (!LIVE_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_LIVE_API_URL is not configured');
  }

  return LIVE_API_BASE_URL;
}

export async function createLiveSession(
  payload: CreateLiveSessionPayload,
  idempotencyKey?: string,
): Promise<CreateLiveSessionResponse> {
  const { data } = await apiClient.post<CreateLiveSessionResponse>(
    '/live/sessions',
    payload,
    {
      baseURL: getLiveApiBaseUrl(),
      headers: idempotencyKey
        ? {
            'Idempotency-Key': idempotencyKey,
          }
        : undefined,
    },
  );

  return data;
}

export async function getLiveSession(
  streamKey: string,
): Promise<LiveSessionDTO> {
  const { data } = await apiClient.get<LiveSessionDTO>(
    `/live/sessions/${streamKey}`,
    {
      baseURL: getLiveApiBaseUrl(),
    },
  );

  return data;
}

export async function getActiveLiveSessions(): Promise<ActiveLiveItemDTO[]> {
  const { data } = await apiClient.get<ActiveLiveItemDTO[]>(
    '/live/sessions/active',
    {
      baseURL: getLiveApiBaseUrl(),
    },
  );

  return data;
}

export async function stopLiveSession(sessionId: number): Promise<void> {
  await apiClient.delete(`/live/sessions/${sessionId}`, {
    baseURL: getLiveApiBaseUrl(),
  });
}