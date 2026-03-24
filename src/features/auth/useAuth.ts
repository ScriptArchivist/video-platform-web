'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, type LoginRequest } from './api';

const ACCESS_TOKEN_KEY = 'access_token';

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    setToken(storedToken);
    setIsReady(true);
  }, []);

  const signIn = useCallback(
    async (payload: LoginRequest) => {
      const response = await login(payload);

      localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      setToken(response.access_token);

      router.push('/videos');
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
    router.push('/login');
  }, [router]);

  return {
    token,
    isReady,
    signIn,
    logout,
  };
}