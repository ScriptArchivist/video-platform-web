interface PageStateProps {
  title: string;
  description?: string;
}

export function PageLoadingState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
            {description ?? 'Please wait while data is being prepared.'}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function PageEmptyState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <span className="text-lg">○</span>
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
            {description ?? 'There is nothing to show here yet.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PageNotFoundState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <span className="text-lg">?</span>
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500">
            {description ?? 'The requested item could not be found.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PageErrorState({ title, description }: PageStateProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-8 shadow-sm">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <span className="text-lg">!</span>
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
            {description ?? 'Something went wrong while loading this section.'}
          </p>
        </div>
      </div>
    </div>
  );
}