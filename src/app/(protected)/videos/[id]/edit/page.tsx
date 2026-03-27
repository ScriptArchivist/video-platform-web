'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useUpdateVideo } from '@/features/videos/hooks/useUpdateVideo';
import { parseApiError } from '@/shared/api/client';
import type { VideoVisibility } from '@/features/videos/types';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { PageErrorState, PageLoadingState } from '@/shared/ui/PageState';
import { ArrowLeft, Save } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

type FormValues = z.infer<typeof schema>;

export default function EditVideoPage() {
  const { showSuccess, showError } = useToast();

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
      <div className="max-w-4xl space-y-6">
        <PageErrorState
          title="Invalid video id"
          description="The requested video id is not valid."
        />
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        <PageLoadingState
          title="Loading video"
          description="Preparing current values for editing."
        />
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="max-w-4xl space-y-6">
        <PageErrorState
          title="Failed to load video"
          description={
            detailQuery.isError
              ? parseApiError(detailQuery.error).message
              : 'Video not found.'
          }
        />
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

      showSuccess('Saved successfully');
      router.push(`/videos/${videoId}`);
    } catch (error) {
      const parsed = parseApiError(error);
      setSubmitError(parsed.message);
      showError(parsed.message);

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
    <div className="max-w-5xl space-y-6">
      <div className="app-card flex flex-wrap items-start justify-between gap-4 p-6 sm:p-7">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">Video #{videoId}</p>
          <h1 className="app-page-title">Edit video</h1>
          <p className="app-page-description">
            Update video metadata and return to the detail page after saving.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/videos/${videoId}`} className="app-btn-secondary gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to detail
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="app-section-title">Video metadata</h2>

        <form onSubmit={onSubmit} className="app-card space-y-5 p-6">
          <div className="space-y-2">
            <label className="app-label">Title</label>
            <input
              {...form.register('title')}
              disabled={updateMutation.isPending}
              className="app-input"
            />
            {form.formState.errors.title ? (
              <p className="app-error-text">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="app-label">Description</label>
            <textarea
              {...form.register('description')}
              disabled={updateMutation.isPending}
              className="app-textarea"
            />
            {form.formState.errors.description ? (
              <p className="app-error-text">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="app-label">Visibility</label>
            <select
              {...form.register('visibility')}
              disabled={updateMutation.isPending}
              className="app-select"
            >
              <option value="private">private</option>
              <option value="public">public</option>
              <option value="unlisted">unlisted</option>
            </select>
            {form.formState.errors.visibility ? (
              <p className="app-error-text">
                {form.formState.errors.visibility.message}
              </p>
            ) : null}
          </div>

          {submitError ? <div className="app-alert-error">{submitError}</div> : null}

          <div className="app-subtle-divider flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="app-btn-primary gap-2"
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/videos/${videoId}`)}
              disabled={updateMutation.isPending}
              className="app-btn-secondary"
            >
              Cancel
            </button>

            <span className="text-sm text-slate-500">
              Changes will be saved and you will return to the video page.
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}