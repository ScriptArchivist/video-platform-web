'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '../hooks/useDeleteVideo';
import { parseApiError } from '@/shared/api/client';
import { useToast } from '@/shared/ui/toast/ToastProvider';

interface DeleteVideoButtonProps {
  videoId: number;
}

export function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
  const router = useRouter();
  const deleteMutation = useDeleteVideo();
  const { showSuccess, showError } = useToast();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    console.log('handleDelete called', { videoId });

    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(videoId);
      console.log('delete success');
      showSuccess('Video deleted');
      router.push('/videos');
    } catch (error) {
      const parsed = parseApiError(error).message;
      console.error('delete failed', error);
      setErrorMessage(parsed);
      showError(parsed);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="inline-flex h-10 items-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </button>

      {errorMessage ? (
        <div className="text-sm text-red-700">{errorMessage}</div>
      ) : null}
    </div>
  );
}