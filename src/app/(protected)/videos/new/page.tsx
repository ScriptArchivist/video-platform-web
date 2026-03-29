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
import {
  CloudUpload,
  FileVideo,
  Upload,
  Radio,
  PlaySquare,
  Video,
} from 'lucide-react';

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

  const isFlowStarted = uploadMutation.isPending || createdVideoId !== null;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    setUploadProgress(0);
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
    <div className="space-y-5">
      <div className="app-card p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <CloudUpload className="h-3.5 w-3.5" />
              Upload workflow
            </div>

            <div>
              <h1 className="app-page-title">Upload video</h1>
              <p className="app-page-description mt-2">
                Create metadata, upload a file, and monitor processing until
                playback is ready.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/videos" className="app-btn-secondary gap-2">
              <Video className="h-4 w-4" />
              Videos
            </Link>

            <Link href="/videos/new" className="app-btn-primary gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </Link>

            <Link href="/live" className="app-btn-secondary gap-2">
              <Radio className="h-4 w-4" />
              Live Studio
            </Link>

            <Link href="/live/active" className="app-btn-secondary gap-2">
              <PlaySquare className="h-4 w-4" />
              Active Live
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="app-card p-6">
          <VideoDetailSectionTitle title="Upload form" />
          <form onSubmit={onSubmit} className="mt-5 space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <label className="app-label">Title</label>
                <input
                  {...form.register('title')}
                  disabled={isFlowStarted}
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
                  disabled={isFlowStarted}
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
                  disabled={isFlowStarted}
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

              <div className="space-y-2">
                <label className="app-label">Video file</label>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <input
                    type="file"
                    accept="video/*"
                    disabled={isFlowStarted}
                    onChange={(event) => {
                      setFile(event.target.files?.[0] ?? null);
                      form.clearErrors('root');
                    }}
                    className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-slate-800 disabled:cursor-not-allowed"
                  />

                  {file ? (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">
                      <FileVideo className="h-4 w-4 text-slate-500" />
                      <span>
                        Selected file:{' '}
                        <span className="font-medium text-slate-800">{file.name}</span>
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {form.formState.errors.root ? (
              <div className="app-alert-error">{form.formState.errors.root.message}</div>
            ) : null}

            {submitError ? <div className="app-alert-error">{submitError}</div> : null}

            <div className="app-subtle-divider flex flex-wrap items-center gap-3">
              <button type="submit" disabled={isFlowStarted} className="app-btn-primary">
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </button>

              <Link href="/videos" className="app-btn-secondary">
                Cancel
              </Link>

              <span className="text-sm text-slate-500">
                Upload will start immediately. Processing status will appear below.
              </span>
            </div>
          </form>
        </div>
      </section>

      {(uploadMutation.isPending || uploadProgress > 0) &&
      createdVideoId === null ? (
        <section className="space-y-3">
          <div className="app-card p-6">
            <VideoDetailSectionTitle title="Upload progress" />
            <div className="mt-5">
              <UploadProgress progress={uploadProgress} />
            </div>
          </div>
        </section>
      ) : null}

      {isProcessingVisible && detailQuery.data ? (
        <section className="space-y-3">
          <div className="app-card p-6">
            <VideoDetailSectionTitle title="Processing" />

            <div className="mt-5 space-y-5">
              <ProcessingStatePanel
                status={detailQuery.data.status}
                errorMessage={detailQuery.data.error_message}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/videos/${detailQuery.data.id}`} className="app-btn-primary">
                  Open video
                </Link>

                <Link href="/videos" className="app-btn-secondary">
                  Back to list
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function VideoDetailSectionTitle({ title }: { title: string }) {
  return <h2 className="app-section-title">{title}</h2>;
}