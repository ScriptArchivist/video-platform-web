import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar />

        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* subtle background layer */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.04),transparent_60%)]" />

          <Topbar />

          <main className="relative flex-1">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 xl:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}