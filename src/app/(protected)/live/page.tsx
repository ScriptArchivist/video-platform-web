'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  Copy,
  ExternalLink,
  Radio,
  Square,
  Video,
  Wifi,
  ArrowRight,
} from 'lucide-react';

import { useCreateLiveSession } from '@/features/live/hooks/useCreateLiveSession';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { useStopLiveSession } from '@/features/live/hooks/useStopLiveSession';
import { LivePlayerPanel } from '@/features/live/ui/LivePlayerPanel';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { parseApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { PageErrorState } from '@/shared/ui/PageState';
import { useToast } from '@/shared/ui/toast/ToastProvider';

const schema = z.object({
  title: z.string().optional(),
  stream_key: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LiveStudioPage() {
  const { showSuccess, showError } = useToast();

  const [createdStreamKey, setCreatedStreamKey] = useState<string | null>(null);
  const [sessionMeta, setSessionMeta] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const createMutation = useCreateLiveSession();
  const sessionQuery = useLiveSession(createdStreamKey);
  const stopMutation = useStopLiveSession(createdStreamKey ?? undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      stream_key: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const response = await createMutation.mutateAsync({
        title: values.title?.trim() || undefined,
        ttl_seconds: 1800,
        stream_key: values.stream_key?.trim() || null,
      });

      setCreatedStreamKey(response.session.stream_key);
      setSessionMeta(response);

      showSuccess('Live session created');
    } catch (error) {
      const msg = parseApiError(error);
      setSubmitError(msg);
      showError(msg);
    }
  });

  const currentSession = sessionQuery.data;

  const hlsUrl =
    currentSession?.hls_url ??
    sessionMeta?.hls_url ??
    null;

  const canShowPlayer =
    currentSession?.status === 'started' && Boolean(hlsUrl);

  async function handleCopy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopiedValue(key);
    showSuccess('Copied');

    setTimeout(() => {
      setCopiedValue(null);
    }, 1500);
  }

  function CopyButton({ value, id }: { value: string; id: string }) {
    return (
      <button
        onClick={() => handleCopy(value, id)}
        className="app-btn-secondary px-3 h-9"
      >
        {copiedValue === id ? 'Copied' : 'Copy'}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="app-card p-6 sm:p-7">
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

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* PLAYER */}
          <div className="app-card p-4 sm:p-6">
            {canShowPlayer ? (
              <LivePlayerPanel src={hlsUrl!} />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm text-slate-500">
                Waiting for live stream...
              </div>
            )}
          </div>

          {/* CREATE FORM */}
          {!currentSession && (
            <div className="app-card p-6">
              <h2 className="app-section-title">Create session</h2>

              <form onSubmit={onSubmit} className="mt-5 space-y-4">
                <input
                  {...form.register('title')}
                  placeholder="Stream title"
                  className="app-input"
                />

                <input
                  {...form.register('stream_key')}
                  placeholder="Custom stream key (optional)"
                  className="app-input"
                />

                {submitError && (
                  <div className="app-alert-error">{submitError}</div>
                )}

                <button className="app-btn-primary w-full h-11">
                  Create session
                </button>
              </form>
            </div>
          )}

          {/* STREAM DATA */}
          {currentSession && sessionMeta && (
            <div className="app-card p-6 space-y-4">
              <h2 className="app-section-title">Streaming setup</h2>

              <div className="space-y-3">
                <div className="app-inset p-4">
                  <div className="flex justify-between">
                    <span>RTMP URL</span>
                    <CopyButton value={sessionMeta.rtmp_url} id="rtmp" />
                  </div>
                  <div className="mt-2 font-mono text-sm break-all">
                    {sessionMeta.rtmp_url}
                  </div>
                </div>

                <div className="app-inset p-4">
                  <div className="flex justify-between">
                    <span>Stream key</span>
                    <CopyButton
                      value={currentSession.stream_key}
                      id="key"
                    />
                  </div>
                  <div className="mt-2 font-mono text-sm break-all">
                    {currentSession.stream_key}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {currentSession && (
            <div className="app-card p-6 space-y-4">
              <LiveStatusBadge status={currentSession.status} />

              <button
                onClick={() => setIsStopDialogOpen(true)}
                className="app-btn-danger w-full"
              >
                Stop live
              </button>

              <Link
                href={`/watch/live/${currentSession.stream_key}`}
                className="app-btn-secondary w-full"
              >
                Open player
              </Link>
            </div>
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
        onClose={() => setIsStopDialogOpen(false)}
        onConfirm={async () => {
          if (!currentSession) return;
          await stopMutation.mutateAsync(currentSession.id);
          showSuccess('Stopped');
        }}
      />
    </div>
  );
}