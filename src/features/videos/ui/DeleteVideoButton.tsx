'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '../hooks/useDeleteVideo';
import { parseApiError } from '@/shared/api/client';

interface DeleteVideoButtonProps {
  videoId: number;
}

export function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
  const router = useRouter();
  const deleteMutation = useDeleteVideo();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this video? This action cannot be undone.');
    if (!confirmed) return;

    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(videoId);
      router.push('/videos');
    } catch (error) {
      setErrorMessage(parseApiError(error).message);
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