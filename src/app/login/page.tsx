'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { parseApiErrorResponse } from '@/shared/api/client';
import { useToast } from '@/shared/ui/toast/ToastProvider';
import { PlayCircle, ShieldCheck } from 'lucide-react';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-slate-900 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/backgrounds/login.png)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[#081120]/78" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_32%)]" />

      <div className="relative w-full max-w-6xl">
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-slate-950 px-10 py-12 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
                    <PlayCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-lg font-semibold tracking-tight">
                      Pring Eye
                    </div>
                    <div className="text-sm text-slate-300">
                      Control panel for video and live workflows
                    </div>
                  </div>
                </div>

                <div className="mt-14">
                  <h1 className="text-4xl font-semibold tracking-tight">
                    Manage videos and live sessions from one place
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                    Upload content, monitor processing, create RTMP live
                    sessions, and preview HLS playback through a single internal
                    frontend.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold">Protected access</div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Authentication uses JWT and protected routes. Streaming is
                      controlled through backend-supported RTMP and HLS flows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight text-slate-950">
                      Pring Eye
                    </div>
                    <div className="text-sm text-slate-500">Sign in</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  Internal access
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Login
                </h1>
                <p className="text-sm leading-6 text-slate-500">
                  Вход в видеоплатформу
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="app-label">Username</label>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={`app-input ${
                      fieldErrors.username ? 'border-red-300 focus:ring-red-100' : ''
                    }`}
                  />
                  {fieldErrors.username ? (
                    <p className="app-error-text">{fieldErrors.username}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="app-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`app-input ${
                      fieldErrors.password ? 'border-red-300 focus:ring-red-100' : ''
                    }`}
                  />
                  {fieldErrors.password ? (
                    <p className="app-error-text">{fieldErrors.password}</p>
                  ) : null}
                </div>

                {error ? <div className="app-alert-error">{error}</div> : null}

                <button
                  type="submit"
                  disabled={isPending}
                  className="app-btn-primary w-full"
                >
                  {isPending ? 'Входим...' : 'Войти'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}