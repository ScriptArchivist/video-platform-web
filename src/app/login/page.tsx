'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { parseApiErrorResponse } from '@/shared/api/client';
import { useToast } from '@/shared/ui/toast/ToastProvider';

type LoginFieldErrors = {
  username?: string;
  password?: string;
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const { showSuccess, showError } = useToast();

  const [username, setUsername] = useState('Vadim');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsPending(true);

    try {
      await signIn({ username, password });
      showSuccess('Logged in successfully');
    } catch (err) {
      const parsed = parseApiErrorResponse(err);

      setError(parsed.message);

      if (parsed.status === 422) {
        setFieldErrors({
          username: parsed.fieldErrors.username,
          password: parsed.fieldErrors.password,
        });
      }

      showError(parsed.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Вход в видеоплатформу</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={`h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-slate-400 ${
                fieldErrors.username ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {fieldErrors.username ? (
              <p className="text-sm text-red-600">{fieldErrors.username}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-slate-400 ${
                fieldErrors.password ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {fieldErrors.password ? (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}