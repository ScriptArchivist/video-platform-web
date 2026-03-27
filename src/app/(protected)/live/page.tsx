'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, Radio, Square } from 'lucide-react';

import { useCreateLiveSession } from '@/features/live/hooks/useCreateLiveSession';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { useStopLiveSession } from '@/features/live/hooks/useStopLiveSession';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { parseApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToast } from '@/shared/ui/toast/ToastProvider';

const schema = z.object({
  title: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const LIVE_STREAM_KEY_STORAGE_KEY = 'live-studio-current-stream-key';
const LIVE_SESSION_META_STORAGE_KEY = 'live-studio-current-session-meta';

export default function LiveStudioPage() {
  const { showSuccess, showError } = useToast();

  const [createdStreamKey, setCreatedStreamKey] = useState<string | null>(null);
  const [sessionMeta, setSessionMeta] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const createMutation = useCreateLiveSession();
  const sessionQuery = useLiveSession(createdStreamKey);
  const stopMutation = useStopLiveSession(createdStreamKey ?? undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedStreamKey = window.localStorage.getItem(
      LIVE_STREAM_KEY_STORAGE_KEY,
    );
    const storedSessionMeta = window.localStorage.getItem(
      LIVE_SESSION_META_STORAGE_KEY,
    );

    if (storedStreamKey) {
      setCreatedStreamKey(storedStreamKey);
    }

    if (storedSessionMeta) {
      try {
        setSessionMeta(JSON.parse(storedSessionMeta));
      } catch {
        window.localStorage.removeItem(LIVE_SESSION_META_STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    if (createdStreamKey) {
      window.localStorage.setItem(
        LIVE_STREAM_KEY_STORAGE_KEY,
        createdStreamKey,
      );
    } else {
      window.localStorage.removeItem(LIVE_STREAM_KEY_STORAGE_KEY);
    }
  }, [createdStreamKey, isHydrated]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    if (sessionMeta) {
      window.localStorage.setItem(
        LIVE_SESSION_META_STORAGE_KEY,
        JSON.stringify(sessionMeta),
      );
    } else {
      window.localStorage.removeItem(LIVE_SESSION_META_STORAGE_KEY);
    }
  }, [sessionMeta, isHydrated]);

  const currentSession = sessionQuery.data;

  useEffect(() => {
    if (!currentSession) return;

    const terminalStatuses = new Set(['stopped', 'expired', 'error']);

    if (terminalStatuses.has(currentSession.status)) {
      setCreatedStreamKey(null);
      setSessionMeta(null);
      setIsStopDialogOpen(false);
    }
  }, [currentSession]);

  const hlsUrl = currentSession?.hls_url ?? sessionMeta?.hls_url ?? null;
  const canShowPlayer = Boolean(hlsUrl);

  const streamSetup = useMemo(() => {
    if (!currentSession && !sessionMeta) {
      return null;
    }

    return {
      rtmp_url: sessionMeta?.rtmp_url ?? '',
      stream_key: currentSession?.stream_key ?? createdStreamKey ?? '',
    };
  }, [currentSession, sessionMeta, createdStreamKey]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const response = await createMutation.mutateAsync({
        title: values.title?.trim() || undefined,
        ttl_seconds: 1800,
        stream_key: null,
      });

      setCreatedStreamKey(response.session.stream_key);
      setSessionMeta(response);
      showSuccess('Live session created');
    } catch (error) {
      const msg = parseApiError(error).message;
      setSubmitError(msg);
      showError(msg);
    }
  });

  async function handleCopy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(key);
      showSuccess('Copied');

      window.setTimeout(() => {
        setCopiedValue(null);
      }, 1500);
    } catch {
      showError('Failed to copy');
    }
  }

  function CopyButton({ value, id }: { value: string; id: string }) {
    return (
      <button
        type="button"
        onClick={() => handleCopy(value, id)}
        className="app-btn-secondary h-9 px-3"
      >
        {copiedValue === id ? (
          <>
            <Check className="h-4 w-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
    );
  }

  const showCreateForm = isHydrated && !currentSession && !createdStreamKey;

  return (
    <div className="flex min-h-[calc(100dvh-124px)] flex-col gap-4">
      <div className="app-card p-5 sm:p-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
            <Radio className="h-3.5 w-3.5" />
            Live Studio
          </div>

          <h1 className="app-page-title">Go live</h1>
          <p className="app-page-description">
            Create a session, connect OBS, and monitor your stream in real time.
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <div className="app-card min-h-0 p-4 sm:p-5">
          <div className="flex h-full min-h-[360px] items-center justify-center">
            {canShowPlayer ? (
              <div className="w-full">
                <LivePlayerPanel src={hlsUrl!} />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                Waiting for live stream...
              </div>
            )}
          </div>
        </div>

        <div className="grid min-h-0 gap-4">
          {showCreateForm ? (
            <>
              <div className="app-card p-5 sm:p-6">
                <h2 className="app-section-title">Create session</h2>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="app-label">Title</label>
                    <input
                      {...form.register('title')}
                      placeholder="Stream title"
                      className="app-input"
                    />
                  </div>

                  {submitError ? (
                    <div className="app-alert-error">{submitError}</div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="app-btn-primary h-11 w-full"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create session'}
                  </button>
                </form>
              </div>

              <div className="app-card p-5 sm:p-6">
                <h2 className="app-section-title">How it works</h2>

                <div className="mt-4 space-y-3">
                  <div className="app-inset p-4 text-sm text-slate-700">
                    1. Create a live session.
                  </div>
                  <div className="app-inset p-4 text-sm text-slate-700">
                    2. Paste RTMP credentials into OBS.
                  </div>
                  <div className="app-inset p-4 text-sm text-slate-700">
                    3. Start streaming and monitor playback here.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="app-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="app-section-title">Session</h2>
                  <LiveStatusBadge status={currentSession?.status ?? 'created'} />
                </div>

                <div className="mt-4 space-y-3">
                  {streamSetup?.stream_key ? (
                    <Link
                      href={`/watch/live/${streamSetup.stream_key}`}
                      className="app-btn-secondary w-full"
                    >
                      Open player
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setIsStopDialogOpen(true)}
                    disabled={!currentSession || stopMutation.isPending}
                    className="app-btn-danger w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Square className="h-4 w-4" />
                    {stopMutation.isPending ? 'Stopping...' : 'Stop live'}
                  </button>
                </div>
              </div>

              <div className="app-card p-5 sm:p-6">
                <h2 className="app-section-title">Streaming setup</h2>

                <div className="mt-4 space-y-3">
                  {streamSetup?.rtmp_url ? (
                    <div className="app-inset p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium text-slate-700">
                          RTMP URL
                        </span>
                        <CopyButton value={streamSetup.rtmp_url} id="rtmp" />
                      </div>
                      <div className="mt-3 break-all font-mono text-sm text-slate-800">
                        {streamSetup.rtmp_url}
                      </div>
                    </div>
                  ) : null}

                  {streamSetup?.stream_key ? (
                    <div className="app-inset p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium text-slate-700">
                          Stream key
                        </span>
                        <CopyButton value={streamSetup.stream_key} id="key" />
                      </div>
                      <div className="mt-3 break-all font-mono text-sm text-slate-800">
                        {streamSetup.stream_key}
                      </div>
                    </div>
                  ) : null}
                </div>

                {submitError ? (
                  <div className="app-alert-error mt-4">{submitError}</div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={isStopDialogOpen}
        title="Stop live?"
        description="The stream will be stopped."
        confirmText="Stop"
        cancelText="Cancel"
        isLoading={stopMutation.isPending}
        onClose={() => {
          if (!stopMutation.isPending) {
            setIsStopDialogOpen(false);
          }
        }}
        onConfirm={async () => {
          if (!currentSession) return;

          try {
            await stopMutation.mutateAsync(currentSession.id);
            setIsStopDialogOpen(false);
            setCreatedStreamKey(null);
            setSessionMeta(null);
            setSubmitError(null);
            showSuccess('Stopped');
          } catch (error) {
            const msg = parseApiError(error).message;
            setSubmitError(msg);
            showError(msg);
          }
        }}
      />
    </div>
  );
}