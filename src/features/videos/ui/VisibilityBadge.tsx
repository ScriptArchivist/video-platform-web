import type { VideoVisibility } from '../types';

const visibilityLabelMap: Record<VideoVisibility, string> = {
  private: 'Private',
  public: 'Public',
  unlisted: 'Unlisted',
};

const visibilityClassMap: Record<VideoVisibility, string> = {
  private: 'border-slate-200 bg-slate-100 text-slate-700',
  public: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  unlisted: 'border-amber-200 bg-amber-50 text-amber-700',
};

export function VisibilityBadge({
  visibility,
}: {
  visibility: VideoVisibility;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${visibilityClassMap[visibility]}`}
    >
      {visibilityLabelMap[visibility]}
    </span>
  );
}