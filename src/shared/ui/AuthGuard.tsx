'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { PageLoadingState } from './PageState';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (!token && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isReady, token, pathname, router]);

  if (!isReady) {
    return (
      <div className="p-6">
        <PageLoadingState
          title="Проверка сессии"
          description="Инициализация авторизации."
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-6">
        <PageLoadingState
          title="Проверка сессии"
          description="Если авторизация отсутствует, будет выполнен переход на страницу входа."
        />
      </div>
    );
  }

  return <>{children}</>;
}