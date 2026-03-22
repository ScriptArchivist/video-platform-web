export type LiveStatus = 'created' | 'started' | 'stopped' | 'expired' | 'error';

export interface LiveSessionDTO {
  id: number;
  owner_id: number;
  stream_key: string;
  title?: string;
  status: LiveStatus;
  created_at: string;
  started_at: string | null;
  stopped_at: string | null;
  expires_at: string | null;
  error: string | null;
  thumbnail_url?: string | null;
}

export interface ActiveLiveItemDTO {
  id?: number;
  stream_key: string;
  title: string;
  description?: string | null;
  status: string;
  hls_url?: string | null;
  hls_ready: boolean;
  owner_name?: string | null;
  started_at?: string | null;
  thumbnail_url?: string | null;
}

export interface CreateLiveSessionPayload {
  stream_key: string | null;
  ttl_seconds: number;
  title?: string;
}

export interface CreateLiveSessionResponse {
  session: LiveSessionDTO;
  rtmp_url: string;
  hls_url: string;
  thumbnail_url?: string | null;
}