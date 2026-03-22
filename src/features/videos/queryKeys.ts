export const videoQueryKeys = {
  all: ['videos'] as const,
  list: (params: unknown) => ['videos', 'list', params] as const,
  detail: (videoId: number) => ['videos', 'detail', videoId] as const,
  playback: (videoId: number) => ['videos', 'playback', videoId] as const,
};