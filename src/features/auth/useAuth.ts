'use client';

import { useRouter } from 'next/navigation';
import { login, type LoginRequest } from './api';

const ACCESS_TOKEN_KEY = 'access_token';

export function useAuth() {
  const router = useRouter();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  async function signIn(payload: LoginRequest) {
    const response = await login(payload);

    localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);

    router.push('/dashboard');
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  return {
    token,
    signIn,
    logout,
  };
}