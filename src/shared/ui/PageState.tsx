interface PageStateProps {
  title: string;
  description?: string;
}

export function PageLoadingState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border bg-white p-8">
      <div className="space-y-3">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
        {description ? (
          <div className="text-sm text-slate-500">{description}</div>
        ) : null}
      </div>
    </div>
  );
}

export function PageEmptyState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export function PageErrorState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8">
      <h2 className="text-lg font-semibold text-red-700">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-red-700">{description}</p>
      ) : null}
    </div>
  );
}