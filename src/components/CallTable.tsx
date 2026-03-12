import type { Call } from "@/lib/types";

const RESOLUTION_STYLES: Record<string, string> = {
  resolved: "bg-green-100 text-green-700",
  unresolved: "bg-red-100 text-red-700",
  escalated: "bg-amber-100 text-amber-700",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function CallTable({ calls }: { calls: Call[] }) {
  if (calls.length === 0) {
    return <p className="text-sm text-gray-400 italic">No calls found for this agent.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["Call ID", "Date", "Topic", "Duration", "Resolution"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {calls.map((call) => (
            <tr key={call.callId} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-mono text-gray-500 text-xs">{call.callId}</td>
              <td className="px-4 py-3 text-gray-700">{call.callDate}</td>
              <td className="px-4 py-3 capitalize text-gray-700">{call.topic}</td>
              <td className="px-4 py-3 text-gray-700 tabular-nums">
                {formatDuration(call.durationSeconds)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    RESOLUTION_STYLES[call.resolution] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {call.resolution}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
