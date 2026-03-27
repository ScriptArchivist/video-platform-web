import { PageEmptyState } from '@/shared/ui/PageState';
import { User, Shield, Database } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-5xl space-y-6">
      <header className="app-card p-6 sm:p-7">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            <User className="h-3.5 w-3.5" />
            Account area
          </div>

          <div>
            <h1 className="app-page-title">Profile</h1>
            <p className="app-page-description mt-2">
              User profile settings will appear here when backend endpoints are
              available.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="app-card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <User className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">
            Profile data
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            User details will be shown here after profile endpoints are added.
          </p>
        </div>

        <div className="app-card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">
            Security
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Access and auth-related settings can be placed here later.
          </p>
        </div>

        <div className="app-card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-semibold text-slate-900">
            Usage summary
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Storage and content usage can be surfaced here later.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="app-section-title">Overview</h2>

        <PageEmptyState
          title="Profile is not available yet"
          description="Profile endpoints are not defined in the current backend contract."
        />
      </section>
    </div>
  );
}