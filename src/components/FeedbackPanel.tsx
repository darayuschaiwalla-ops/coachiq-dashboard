export function FeedbackPanel({
  strengths,
  areasOfFocus,
}: {
  strengths: string[];
  areasOfFocus: string[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
            ✓
          </span>
          Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <li key={i} className="text-sm text-green-800 flex gap-2">
              <span className="mt-0.5 shrink-0 text-green-400">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas of Focus */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs font-bold shrink-0">
            !
          </span>
          Areas of Focus
        </h3>
        <ul className="space-y-2">
          {areasOfFocus.map((a, i) => (
            <li key={i} className="text-sm text-amber-800 flex gap-2">
              <span className="mt-0.5 shrink-0 text-amber-400">•</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
