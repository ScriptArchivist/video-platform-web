'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadVideoFlow } from '@/features/upload/hooks/useUploadVideoFlow';
import { UploadProgress } from '@/features/upload/ui/UploadProgress';
import { ProcessingStatePanel } from '@/features/upload/ui/ProcessingStatePanel';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { parseApiError } from '@/shared/api/client';
import { useToast } from '@/shared/ui/toast/ToastProvider';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

type FormValues = z.infer<typeof schema>;

export default function NewVideoPage() {
  const { showSuccess, showError } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [createdVideoId, setCreatedVideoId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const readyToastShownRef = useRef(false);

  const uploadMutation = useUploadVideoFlow();

  const detailQuery = useVideoDetail(
    createdVideoId !== null ? createdVideoId : Number.NaN,
  );

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

    if (detailQuery.data.status === 'ready') {
      setSubmitError(null);

      if (!readyToastShownRef.current) {
        showSuccess('Video is ready');
        readyToastShownRef.current = true;
      }
    }

    if (detailQuery.data.status === 'failed' && detailQuery.data.error_message) {
      setSubmitError(detailQuery.data.error_message);
    }
  }, [detailQuery.data, showSuccess]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    readyToastShownRef.current = false;

    if (!file) {
      form.setError('root', {
        message: 'Video file is required',
      });
      return;
    }

    try {
      const createdVideo = await uploadMutation.mutateAsync({
        title: values.title,
        description: values.description,
        visibility: values.visibility,
        file,
        onProgress: setUploadProgress,
      });

      setCreatedVideoId(createdVideo.id);
      showSuccess('Upload started');
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

  const isProcessingVisible = Boolean(createdVideoId && detailQuery.data);

  return (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upload video</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create metadata, upload file, and wait for processing.
        </p>
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
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
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
          <label className="text-sm font-medium text-slate-700">
            Visibility
          </label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Video file</label>
          <input
            type="file"
            accept="video/*"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
            }}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
          />
        </div>

        {form.formState.errors.root ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {form.formState.errors.root.message}
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Start upload'}
          </button>

          <Link
            href="/videos"
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to videos
          </Link>
        </div>
      </form>

      {(uploadMutation.isPending || uploadProgress > 0) && createdVideoId === null ? (
        <UploadProgress progress={uploadProgress} />
      ) : null}

      {isProcessingVisible && detailQuery.data ? (
        <div className="space-y-4">
          <ProcessingStatePanel
            status={detailQuery.data.status}
            errorMessage={detailQuery.data.error_message}
          />

          <div className="flex items-center gap-3">
            <Link
              href={`/videos/${detailQuery.data.id}`}
              className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Open video detail
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}