export type VideoVisibility = 'public' | 'private' | 'unlisted';

export type VideoStatus =
  | 'uploading'
  | 'uploaded'
  | 'processing'
  | 'ready'
  | 'failed';

export interface VideoOwnerDTO {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  storage_limit: number;
  used_storage: number;
}

export interface VideoListItemDTO {
  id: number;
  owner_id: number;
  title: string;
  description: string | null;
  visibility: VideoVisibility;
  status: VideoStatus;
  is_blocked: boolean;
  duration: number | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  uploaded_at: string;
  processed_at: string | null;
  error_message: string | null;
  hls_ready: boolean;
  hls_url: string | null;
  watch_url: string;
  file_url: string | null;
  thumbnail_url: string | null;
  is_shared: boolean;
  share_url: string | null;
}

export interface VideoDetailDTO extends VideoListItemDTO {
  owner?: VideoOwnerDTO;
  formats: unknown[];
  processing_tasks: unknown[];
}

export interface VideoPlaybackDTO {
  video_id: number;
  hls_ready: boolean;
  hls_url: string | null;
}

export interface VideoListResponseDTO {
  items: VideoListItemDTO[];
  page: number;
  per_page: number;
  total: number;
}

export interface GetVideosParams {
  status?: VideoStatus;
  visibility?: VideoVisibility;
  owner_id?: number;
  min_duration?: number;
  max_duration?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  visibility: VideoVisibility;
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  visibility?: VideoVisibility;
}