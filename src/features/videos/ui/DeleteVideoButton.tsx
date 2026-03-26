'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '../hooks/useDeleteVideo';
import { parseApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToast } from '@/shared/ui/toast/ToastProvider';

interface DeleteVideoButtonProps {
  videoId: number;
}

export function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
  const router = useRouter();
  const deleteMutation = useDeleteVideo();
  const { showSuccess, showError } = useToast();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(videoId);
      showSuccess('Deleted successfully');
      setIsDialogOpen(false);
      router.push('/videos');
    } catch (error) {
      const parsed = parseApiError(error).message;
      setErrorMessage(parsed);
      showError(parsed);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setIsDialogOpen(true);
          }}
          disabled={deleteMutation.isPending}
          className="inline-flex h-10 items-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete video'}
        </button>

        {errorMessage ? (
          <div className="text-sm text-red-700">{errorMessage}</div>
        ) : null}
      </div>

      <ConfirmDialog
        open={isDialogOpen}
        title="Delete video?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClassName="bg-red-600 text-white hover:bg-red-700"
        isLoading={deleteMutation.isPending}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}