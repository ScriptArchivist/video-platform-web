'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
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
      router.refresh();
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
          className="app-btn-danger gap-2"
        >
          <Trash2 className="h-4 w-4" />
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