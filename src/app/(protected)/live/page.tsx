'use client';

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
  ttl_seconds: z.coerce
    .number()
    .int()
    .min(60, 'TTL должен быть не меньше 60 секунд')
    .max(86400, 'TTL должен быть не больше 86400 секунд'),
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
      ttl_seconds: 1800,
      stream_key: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const response = await createMutation.mutateAsync({
        title: values.title?.trim() ? values.title.trim() : undefined,
        ttl_seconds: values.ttl_seconds,
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

  return (
    <div className="max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Live studio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Создание live session и мониторинг её статуса.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-xl border bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Title (optional)
            </label>
            <input
              {...form.register('title')}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
            {form.formState.errors.title ? (
              <p className="text-sm text-red-700">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              TTL seconds
            </label>
            <input
              type="number"
              {...form.register('ttl_seconds')}
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
            {form.formState.errors.ttl_seconds ? (
              <p className="text-sm text-red-700">
                {form.formState.errors.ttl_seconds.message}
              </p>
            ) : null}
          </div>
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

        <div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create live session'}
          </button>
        </div>
      </form>

      {currentSession && sessionMeta ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Session info
              </h2>
              <LiveStatusBadge status={currentSession.status} />
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="mb-1 text-slate-500">Stream key</dt>
                <dd className="break-all text-slate-900">
                  {currentSession.stream_key}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">RTMP URL</dt>
                <dd className="break-all text-slate-900">
                  {sessionMeta.rtmp_url}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">HLS URL</dt>
                <dd className="break-all text-slate-900">
                  {sessionMeta.hls_url}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">Created at</dt>
                <dd className="text-slate-900">
                  {new Date(currentSession.created_at).toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">Started at</dt>
                <dd className="text-slate-900">
                  {currentSession.started_at
                    ? new Date(currentSession.started_at).toLocaleString()
                    : '—'}
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-slate-500">Expires at</dt>
                <dd className="text-slate-900">
                  {currentSession.expires_at
                    ? new Date(currentSession.expires_at).toLocaleString()
                    : '—'}
                </dd>
              </div>

              {currentSession.error ? (
                <div>
                  <dt className="mb-1 text-slate-500">Error</dt>
                  <dd className="text-red-700">{currentSession.error}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6">
              <button
                type="button"
                disabled={stopMutation.isPending}
                onClick={() => {
                  setSubmitError(null);
                  setIsStopDialogOpen(true);
                }}
                className="inline-flex h-10 items-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {stopMutation.isPending ? 'Stopping...' : 'Stop live'}
              </button>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Thumbnail
            </h2>

            <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
              {sessionMeta.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sessionMeta.thumbnail_url}
                  alt={currentSession.title ?? 'Live session'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No thumbnail
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      <ConfirmDialog
        open={isStopDialogOpen}
        title="Stop live session?"
        description="The live stream will be stopped. Viewers will no longer be able to watch it."
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
            setSubmitError(parseApiError(error).message);
          }
        }}
      />
    </div>
  );
}