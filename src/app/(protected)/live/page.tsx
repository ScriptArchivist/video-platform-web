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
  const [sessionMeta, setSessionMeta] = useState<{
    rtmp_url: string;
    hls_url: string;
    thumbnail_url?: string | null;
  } | null>(null);
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
        title: values.title?.trim() ? values.title.trim() : undefined,
        ttl_seconds: 1800,
        stream_key: values.stream_key?.trim() ? values.stream_key.trim() : null,
      });

      setCreatedStreamKey(response.session.stream_key);
      setSessionMeta({
        rtmp_url: response.rtmp_url,
        hls_url: response.hls_url,
        thumbnail_url: response.thumbnail_url,
      });

      showSuccess('Live session created');
    } catch (error) {
      const msg = parseApiError(error);
      setSubmitError(msg);
      showError(msg);
    }
  });

  const currentSession = sessionQuery.data;

  const effectiveHlsUrl =
    currentSession?.hls_url ??
    (currentSession?.thumbnail_url?.endsWith('/thumb.jpg')
      ? currentSession.thumbnail_url.replace(/\/thumb\.jpg$/, '/master.m3u8')
      : null) ??
    sessionMeta?.hls_url ??
    null;

  const sessionGuide = useMemo(() => {
    if (!currentSession) return null;

    if (currentSession.status === 'created') {
      return {
        title: 'Session created',
        description:
          'Your live session is ready. Copy the RTMP URL and stream key into OBS, then click Start Streaming in OBS.',
        nextStep: 'Next step: open OBS and start streaming.',
        toneClass: 'border-blue-200 bg-blue-50',
      };
    }

    if (currentSession.status === 'started') {
      return {
        title: 'Stream is live',
        description:
          'The platform is receiving your stream. You can preview playback below or open the public watch page.',
        nextStep: 'Next step: monitor playback or open the player page.',
        toneClass: 'border-red-200 bg-red-50',
      };
    }

    if (currentSession.status === 'stopped') {
      return {
        title: 'Stream stopped',
        description:
          'This live session has been stopped and is no longer broadcasting.',
        nextStep:
          'Next step: create a new session when you are ready to go live again.',
        toneClass: 'border-slate-200 bg-slate-50',
      };
    }

    if (currentSession.status === 'expired') {
      return {
        title: 'Session expired',
        description: 'The session expired before streaming was completed.',
        nextStep: 'Next step: create a new session and reconnect OBS.',
        toneClass: 'border-amber-200 bg-amber-50',
      };
    }

    return {
      title: 'Streaming error',
      description:
        'The live session failed. Check the encoder settings and connection details in OBS.',
      nextStep: 'Next step: verify RTMP settings and try again.',
      toneClass: 'border-red-200 bg-red-50',
    };
  }, [currentSession]);

  const steps = useMemo(() => {
    const hasSession = Boolean(currentSession);

    return [
      {
        title: 'Create session',
        description: 'Generate RTMP credentials for this live stream',
        icon: Radio,
        isActive: !hasSession,
        isDone: hasSession,
      },
      {
        title: 'Set up OBS',
        description: 'Paste RTMP URL and stream key into OBS',
        icon: Video,
        isActive: currentSession?.status === 'created',
        isDone:
          currentSession?.status === 'started' ||
          currentSession?.status === 'stopped' ||
          currentSession?.status === 'expired' ||
          currentSession?.status === 'error',
      },
      {
        title: 'Go live and monitor',
        description: 'Start streaming and verify playback here',
        icon: Wifi,
        isActive: currentSession?.status === 'started',
        isDone: currentSession?.status === 'stopped',
      },
    ];
  }, [currentSession]);

  const canShowPlayer =
    currentSession?.status === 'started' && Boolean(effectiveHlsUrl);

  async function handleCopy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(key);
      showSuccess('Copied to clipboard');

      window.setTimeout(() => {
        setCopiedValue((current) => (current === key ? null : current));
      }, 1500);
    } catch {
      showError('Failed to copy');
    }
  }

  function CopyButton({
    value,
    copyKey,
  }: {
    value: string;
    copyKey: string;
  }) {
    const copied = copiedValue === copyKey;

    return (
      <button
        type="button"
        onClick={() => handleCopy(value, copyKey)}
        className="app-btn-secondary h-9 gap-2 px-3"
      >
        {copied ? (
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

  return (
    <div className="space-y-6">
      <header className="app-card flex flex-wrap items-start justify-between gap-4 p-6 sm:p-7">
        <div className="min-w-0 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            <Radio className="h-3.5 w-3.5" />
            Live workflow
          </div>

          <div>
            <h1 className="app-page-title">Live Studio</h1>
            <p className="app-page-description mt-2">
              Create a session, copy the streaming credentials into OBS, start
              broadcasting, and monitor the stream from one screen.
            </p>
          </div>
        </div>

        <Link href="/live/active" className="app-btn-secondary gap-2">
          Active sessions
          <ExternalLink className="h-4 w-4" />
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className={`rounded-2xl border bg-white/90 p-5 shadow-sm transition ${
                step.isActive
                  ? 'border-slate-900 ring-1 ring-slate-900/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    step.isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : step.isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {step.isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {index + 1}. {step.title}
                  </div>
                  <div className="text-sm leading-6 text-slate-500">
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="app-card p-6">
        <div className="mb-5">
          <h2 className="app-section-title">Create session</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create a live session to receive RTMP credentials for OBS.
          </p>
        </div>

        <form onSubmit={onSubmit} autoComplete="off" className="space-y-5">
          <input
            type="text"
            name="prevent_autofill_username"
            autoComplete="username"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
          />
          <input
            type="password"
            name="prevent_autofill_password"
            autoComplete="new-password"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="app-label">Title (optional)</label>
              <input
                {...form.register('title')}
                autoComplete="off"
                disabled={createMutation.isPending}
                placeholder="My live stream"
                className="app-input"
              />
            </div>

            <div className="space-y-2">
              <label className="app-label">Stream key (optional)</label>
              <input
                {...form.register('stream_key')}
                autoComplete="off"
                spellCheck={false}
                disabled={createMutation.isPending}
                placeholder="Leave empty to generate automatically"
                className="app-input"
              />
            </div>
          </div>

          {submitError ? <div className="app-alert-error">{submitError}</div> : null}

          <div className="app-subtle-divider flex flex-wrap items-center gap-3">
            <button type="submit" disabled={createMutation.isPending} className="app-btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create live session'}
            </button>

            <span className="text-sm text-slate-500">
              Credentials and next steps will appear below after creation.
            </span>
          </div>
        </form>
      </section>

      {createdStreamKey && sessionQuery.isError ? (
        <PageErrorState
          title="Failed to load live session"
          description={parseApiError(sessionQuery.error)}
        />
      ) : null}

      {currentSession && sessionMeta && sessionGuide ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="app-section-title">Live session</h2>
              <p className="mt-1 text-sm text-slate-500">
                Session details, current status, and the next action.
              </p>
            </div>

            <LiveStatusBadge status={currentSession.status} />
          </div>

          <div className={`rounded-2xl border p-5 ${sessionGuide.toneClass}`}>
            <h3 className="text-sm font-semibold text-slate-900">
              What to do now
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {sessionGuide.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-900">
              <ArrowRight className="h-4 w-4" />
              {sessionGuide.nextStep}
            </div>
          </div>

          <div className="app-card p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      RTMP URL
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Paste into OBS as the Server value
                    </p>
                  </div>
                  <CopyButton value={sessionMeta.rtmp_url} copyKey="rtmp_url" />
                </div>

                <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 break-all">
                  {sessionMeta.rtmp_url}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Stream key
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Paste into OBS as the Stream Key
                    </p>
                  </div>
                  <CopyButton
                    value={currentSession.stream_key}
                    copyKey="stream_key"
                  />
                </div>

                <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 break-all">
                  {currentSession.stream_key}
                </div>
              </div>
            </div>

            {currentSession.status === 'created' && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  How to go live (OBS)
                </h3>

                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <div className="flex gap-3">
                    <span className="font-medium text-slate-900">1.</span>
                    <span>
                      Open OBS → <strong>Settings → Stream</strong>
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-medium text-slate-900">2.</span>
                    <span>
                      Set <strong>Server</strong> = RTMP URL
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-medium text-slate-900">3.</span>
                    <span>
                      Set <strong>Stream Key</strong> = stream key above
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-medium text-slate-900">4.</span>
                    <span>
                      Click <strong>Start Streaming</strong> in OBS
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-200 bg-white p-3 text-sm text-slate-600">
                  After starting, the stream will appear here within a few seconds.
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Stream preview
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Preview appears after the session starts and HLS becomes
                      available.
                    </p>
                  </div>

                  <div className="p-5">
                    {canShowPlayer && effectiveHlsUrl ? (
                      <LivePlayerPanel src={effectiveHlsUrl} />
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                        Waiting for live playback...
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        HLS URL
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Playback URL for monitoring or player integration
                      </p>
                    </div>
                    {effectiveHlsUrl ? (
                      <CopyButton value={effectiveHlsUrl} copyKey="hls_url" />
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 break-all">
                    {effectiveHlsUrl ?? 'Not ready yet'}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Actions</h3>

                <div className="mt-4 space-y-3">
                  <Link
                    href={`/watch/live/${currentSession.stream_key}`}
                    className="app-btn-secondary w-full gap-2"
                  >
                    Open player
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link href="/live/active" className="app-btn-secondary w-full">
                    View active sessions
                  </Link>

                  <button
                    type="button"
                    disabled={stopMutation.isPending}
                    onClick={() => {
                      setSubmitError(null);
                      setIsStopDialogOpen(true);
                    }}
                    className="app-btn-danger w-full gap-2"
                  >
                    <Square className="h-4 w-4" />
                    {stopMutation.isPending ? 'Stopping...' : 'Stop live'}
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Status updates refresh automatically while the session is
                  active.
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <ConfirmDialog
        open={isStopDialogOpen}
        title="Stop live session?"
        description="The live stream will be stopped."
        confirmText="Stop live"
        cancelText="Cancel"
        confirmButtonClassName="bg-red-600 text-white hover:bg-red-700"
        isLoading={stopMutation.isPending}
        onClose={() => setIsStopDialogOpen(false)}
        onConfirm={async () => {
          if (!currentSession) return;

          try {
            await stopMutation.mutateAsync(currentSession.id);
            showSuccess('Live stopped');
            setIsStopDialogOpen(false);
          } catch (error) {
            const msg = parseApiError(error);
            setSubmitError(msg);
            showError(msg);
          }
        }}
      />
    </div>
  );
}