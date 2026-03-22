export interface InitUploadResponse {
  upload_id: string;
  object_key: string;
}

export interface CompleteUploadResponse {
  status: 'completed';
}

export interface UploadVideoFlowInput {
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  file: File;
  onProgress?: (progress: number) => void;
}