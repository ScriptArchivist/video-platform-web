export const liveQueryKeys = {
  all: ['live'] as const,
  active: ['live', 'active'] as const,
  session: (streamKey: string) => ['live', 'session', streamKey] as const,
};