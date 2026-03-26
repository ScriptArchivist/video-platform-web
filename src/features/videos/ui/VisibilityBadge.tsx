import type { VideoVisibility } from '../types';

export function VisibilityBadge({
  visibility,
}: {
  visibility: VideoVisibility;
}) {
  return (
    <span className="inline-flex shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
      {visibility}
    </span>
  );
}