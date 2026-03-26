interface PageStateProps {
  title: string;
  description?: string;
}

export function PageLoadingState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-lg bg-slate-100" />
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PageEmptyState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PageNotFoundState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PageErrorState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-red-700">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-red-700">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}