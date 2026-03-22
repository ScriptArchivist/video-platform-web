'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useUpdateVideo } from '@/features/videos/hooks/useUpdateVideo';
import { parseApiError } from '@/shared/api/client';
import type { VideoVisibility } from '@/features/videos/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

type FormValues = z.infer<typeof schema>;

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const videoId = Number(rawId);

  const detailQuery = useVideoDetail(videoId);
  const updateMutation = useUpdateVideo();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo<FormValues | undefined>(() => {
    if (!detailQuery.data) return undefined;

    return {
      title: detailQuery.data.title,
      description: detailQuery.data.description ?? '',
      visibility: detailQuery.data.visibility,
    };
  }, [detailQuery.data]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  if (!Number.isFinite(videoId)) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid video id.
        </div>
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-sm text-slate-500">
          Loading video...
        </div>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Failed to load video: {detailQuery.isError ? parseApiError(detailQuery.error).message : 'Not found'}
        </div>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await updateMutation.mutateAsync({
        videoId,
        payload: {
          title: values.title,
          description: values.description,
          visibility: values.visibility as VideoVisibility,
        },
      });

      router.push(`/videos/${videoId}`);
    } catch (error) {
      const parsed = parseApiError(error);
      setSubmitError(parsed.message);

      if (parsed.fieldErrors) {
        Object.entries(parsed.fieldErrors).forEach(([key, messages]) => {
          const fieldName =
            key === 'title' || key === 'description' || key === 'visibility'
              ? key
              : null;

          if (fieldName) {
            form.setError(fieldName, {
              message: messages[0],
            });
          }
        });
      }
    }
  });

  return (
    <div className="max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit video</h1>
        <p className="mt-1 text-sm text-slate-500">Video #{videoId}</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-xl border bg-white p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
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
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            {...form.register('description')}
            className="min-h-[120px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
          {form.formState.errors.description ? (
            <p className="text-sm text-red-700">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Visibility</label>
          <select
            {...form.register('visibility')}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="private">private</option>
            <option value="public">public</option>
            <option value="unlisted">unlisted</option>
          </select>
          {form.formState.errors.visibility ? (
            <p className="text-sm text-red-700">
              {form.formState.errors.visibility.message}
            </p>
          ) : null}
        </div>

        {submitError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/videos/${videoId}`)}
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}