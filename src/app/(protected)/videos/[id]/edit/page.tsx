'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, PencilLine } from 'lucide-react';

import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useUpdateVideo } from '@/features/videos/hooks/useUpdateVideo';
import { parseApiError } from '@/shared/api/client';
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/PageState';
import { useToast } from '@/shared/ui/toast/ToastProvider';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

type FormValues = z.infer<typeof schema>;

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const rawId = params?.id;
  const videoId = Number(rawId);

  const detailQuery = useVideoDetail(videoId);
  const updateMutation = useUpdateVideo();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      visibility: 'private',
    },
  });

  useEffect(() => {
    if (!detailQuery.data) return;

    form.reset({
      title: detailQuery.data.title ?? '',
      description: detailQuery.data.description ?? '',
      visibility: detailQuery.data.visibility,
    });
  }, [detailQuery.data, form]);

  if (!Number.isFinite(videoId)) {
    return (
      <div className="space-y-6">
        <PageErrorState
          title="This video link is not valid"
          description="The requested video identifier could not be recognized."
        />
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageLoadingState
          title="Opening video editor"
          description="We are loading the current video data so you can update its details."
        />
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="space-y-6">
        <PageErrorState
          title="Unable to load this video"
          description={parseApiError(detailQuery.error).message}
        />
      </div>
    );
  }

  const video = detailQuery.data;

  if (!video) {
    return (
      <div className="space-y-6">
        <PageNotFoundState
          title="Video not found"
          description="This video does not exist anymore or is not available in the current catalog."
        />
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync({
        videoId,
        payload: {
          title: values.title,
          description: values.description || '',
          visibility: values.visibility,
        },
      });

      showSuccess('Video updated');
      router.push(`/videos/${videoId}`);
      router.refresh();
    } catch (error) {
      const parsed = parseApiError(error);
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
    <div className="space-y-5">
      <header className="app-card p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="min-w-0 space-y-3">
            <Link
              href={`/videos/${video.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to detail
            </Link>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <PencilLine className="h-3.5 w-3.5" />
                Edit video
              </div>

              <h1 className="app-page-title">{video.title}</h1>
              <p className="app-page-description">
                Update the title, description, and visibility of this video.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="app-card p-6">
          <h2 className="app-section-title">Video details</h2>

          <form onSubmit={onSubmit} className="mt-5 space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
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

              <div className="space-y-2 lg:col-span-2">
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
            </div>

            <div className="app-subtle-divider flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="app-btn-primary"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save changes'}
              </button>

              <Link href={`/videos/${video.id}`} className="app-btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}