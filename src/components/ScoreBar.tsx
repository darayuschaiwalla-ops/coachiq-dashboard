import type { DimensionScore } from "@/lib/types";

function barColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-500";
}

export function ScoreBar({ dimension }: { dimension: DimensionScore }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline text-sm">
        <span className="font-medium text-gray-700">{dimension.label}</span>
        <span className="font-semibold text-gray-900 tabular-nums">{dimension.score}/100</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(dimension.score)}`}
          style={{ width: `${dimension.score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{dimension.description}</p>
    </div>
  );
}
