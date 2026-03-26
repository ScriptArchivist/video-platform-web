import { PageEmptyState } from '@/shared/ui/PageState';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl space-y-6 p-6">
      <div className="rounded-xl border bg-white p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Profile
          </h1>
          <p className="text-sm text-slate-500">
            User profile settings will appear here when backend endpoints are
            available.
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>

        <PageEmptyState
          title="Profile is not available yet"
          description="Profile endpoints are not defined in the current backend contract."
        />
      </section>
    </div>
  );
}