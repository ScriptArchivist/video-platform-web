import { AlertCircle, CircleDashed, SearchX, Loader2 } from 'lucide-react';

interface PageStateProps {
  title: string;
  description?: string;
}

function StateCard({
  icon,
  title,
  description,
  tone = 'default',
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: 'default' | 'warning';
}) {
  return (
    <div
      className={`app-card p-8 ${
        tone === 'warning' ? 'border-red-300/30 bg-red-500/10' : ''
      }`}
    >
      <div className="mx-auto max-w-2xl text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-xl ${
            tone === 'warning'
              ? 'border-red-300/30 bg-red-500/14 text-red-100'
              : 'border-white/16 bg-[#0f1a2f]/78 text-white'
          }`}
        >
          {icon}
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm leading-6 text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function PageLoadingState({ title, description }: PageStateProps) {
  return (
    <StateCard
      icon={<Loader2 className="h-6 w-6 animate-spin" />}
      title={title}
      description={description ?? 'Loading data...'}
    />
  );
}

export function PageEmptyState({ title, description }: PageStateProps) {
  return (
    <StateCard
      icon={<CircleDashed className="h-6 w-6" />}
      title={title}
      description={description ?? 'Nothing to show yet.'}
    />
  );
}

export function PageNotFoundState({ title, description }: PageStateProps) {
  return (
    <StateCard
      icon={<SearchX className="h-6 w-6" />}
      title={title}
      description={description ?? 'Not found.'}
    />
  );
}

export function PageErrorState({ title, description }: PageStateProps) {
  return (
    <StateCard
      icon={<AlertCircle className="h-6 w-6" />}
      title={title}
      description={description ?? 'Something went wrong.'}
      tone="warning"
    />
  );
}