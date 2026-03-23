'use client';

import { useActiveLiveSessions } from '@/features/live/hooks/useActiveLiveSessions';
import { LiveSessionCard } from '@/features/live/ui/LiveSessionCard';
import { parseApiError } from '@/shared/api/client';
import {
  PageEmptyState,
  PageErrorState,
  PageLoadingState,
} from '@/shared/ui/PageState';

export default function ActiveLiveSessionsPage() {
  const activeQuery = useActiveLiveSessions();

  if (activeQuery.isLoading) {
    return (
      <div className="p-6">
        <PageLoadingState
          title="Загрузка активных трансляций"
          description="Получаем список live-сессий с backend."
        />
      </div>
    );
  }

  if (activeQuery.isError) {
    return (
      <div className="p-6">
        <PageErrorState
          title="Не удалось загрузить активные трансляции"
          description={parseApiError(activeQuery.error)}
        />
      </div>
    );
  }

  if (!activeQuery.data || activeQuery.data.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Active live sessions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Список активных live-трансляций.
          </p>
        </div>

        <PageEmptyState
          title="Нет активных трансляций"
          description="Запусти новую трансляцию в Live Studio."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Active live sessions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Список активных live-трансляций.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {activeQuery.data.map((session) => (
          <LiveSessionCard
            key={`${session.stream_key}-${session.id ?? 'no-id'}`}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}