'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLiveSession } from '@/features/live/hooks/useCreateLiveSession';
import { useLiveSession } from '@/features/live/hooks/useLiveSession';
import { useStopLiveSession } from '@/features/live/hooks/useStopLiveSession';
import { LiveStatusBadge } from '@/features/live/ui/LiveStatusBadge';
import { parseApiError } from '@/shared/api/client';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { PageErrorState } from '@/shared/ui/PageState';

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
      showSuccess('Live session created');
      setSessionMeta({
        rtmp_url: response.rtmp_url,
        hls_url: response.hls_url,
        thumbnail_url: response.thumbnail_url,
      });
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

  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Live studio
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Create a live session, get RTMP and HLS endpoints, and monitor the
            stream status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/live/active"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Active sessions
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-800 shadow-sm">
        After the stream starts, HLS may appear with a short delay while the
        live output is initializing.
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Create session
        </h2>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Title (optional)
            </label>
            <input
              {...form.register('title')}
              disabled={createMutation.isPending}
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Stream key (optional)
            </label>
            <input
              {...form.register('stream_key')}
              disabled={createMutation.isPending}
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {submitError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex h-10 items-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create live session'}
            </button>

            <span className="text-sm text-slate-500">
              After creation, session details and next actions will appear
              below.
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

      {currentSession && sessionMeta ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Live session
            </h2>
            <LiveStatusBadge status={currentSession.status} />
          </div>

          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">
              {currentSession.status === 'created' &&
                'Waiting for stream to start'}
              {currentSession.status === 'started' && 'Stream is live'}
              {currentSession.status === 'stopped' && 'Stream has been stopped'}
              {currentSession.status === 'expired' && 'Stream expired'}
              {currentSession.status === 'error' && 'Stream failed'}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {currentSession.status === 'created' && (
                <p>Stream is created. Start sending RTMP to begin live.</p>
              )}
              {currentSession.status === 'started' && (
                <p>Stream is live. Viewers can watch it now.</p>
              )}
              {currentSession.status === 'stopped' && (
                <p>Stream has been stopped.</p>
              )}
              {currentSession.status === 'expired' && <p>Stream expired.</p>}
              {currentSession.status === 'error' && (
                <p>Stream failed. Please check your encoder or settings.</p>
              )}
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="mb-1 text-slate-500">RTMP URL</dt>
                <dd className="break-all text-slate-900">
                  {sessionMeta.rtmp_url}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">HLS URL</dt>
                <dd className="break-all text-slate-900">
                  {effectiveHlsUrl ?? 'Not ready yet'}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={stopMutation.isPending}
                onClick={() => {
                  setSubmitError(null);
                  setIsStopDialogOpen(true);
                }}
                className="inline-flex h-10 items-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                {stopMutation.isPending ? 'Stopping...' : 'Stop'}
              </button>

              <Link
                href={`/watch/live/${currentSession.stream_key}`}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Open player
              </Link>

              <Link
                href="/live/active"
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Active sessions
              </Link>
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