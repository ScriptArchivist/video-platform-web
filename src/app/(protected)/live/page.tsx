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
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

const schema = z.object({
  title: z.string().optional(),
  stream_key: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LiveStudioPage() {
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
      setSessionMeta({
        rtmp_url: response.rtmp_url,
        hls_url: response.hls_url,
        thumbnail_url: response.thumbnail_url,
      });
    } catch (error) {
      setSubmitError(parseApiError(error));
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
    <div className="max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-white p-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Live studio
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a live session, get RTMP and HLS endpoints, and monitor the stream status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/live/active"
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Active sessions
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        After the stream starts, HLS may appear with a short delay while the live output is initializing.
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Create session</h2>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-xl border bg-white p-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Title (optional)
            </label>
            <input
              {...form.register('title')}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Stream key (optional)
            </label>
            <input
              {...form.register('stream_key')}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {submitError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create live session'}
            </button>
          </div>
        </form>
      </section>

      {currentSession && sessionMeta ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Session info</h2>
            <LiveStatusBadge status={currentSession.status} />
          </div>

          <div className="rounded-xl border bg-white p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="mb-1 text-slate-500">Stream key</dt>
                <dd className="break-all text-slate-900">
                  {currentSession.stream_key}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">RTMP URL</dt>
                <dd className="break-all text-slate-900">{sessionMeta.rtmp_url}</dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">HLS URL</dt>
                <dd className="break-all text-slate-900">
                  {effectiveHlsUrl ?? '—'}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={stopMutation.isPending}
                onClick={() => {
                  setSubmitError(null);
                  setIsStopDialogOpen(true);
                }}
                className="inline-flex h-10 items-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                {stopMutation.isPending ? 'Stopping...' : 'Stop live'}
              </button>

              <Link
                href={`/watch/live/${currentSession.stream_key}`}
                className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Open watch page
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
            setIsStopDialogOpen(false);
          } catch (error) {
            setSubmitError(parseApiError(error));
          }
        }}
      />
    </div>
  );
}