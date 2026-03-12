import Link from "next/link";
import type { AgentSummary } from "@/lib/types";

function scoreColors(score: number) {
  if (score >= 80) return { badge: "bg-green-100 text-green-700 ring-green-200", dot: "bg-green-500" };
  if (score >= 60) return { badge: "bg-amber-100 text-amber-700 ring-amber-200", dot: "bg-amber-400" };
  return { badge: "bg-red-100 text-red-700 ring-red-200", dot: "bg-red-500" };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AgentCard({ agent }: { agent: AgentSummary }) {
  const colors = scoreColors(agent.overallScore);

  return (
    <Link href={`/agents/${agent.agentId}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {initials(agent.agentName)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {agent.agentName}
            </p>
            <p className="text-xs text-gray-400">{agent.agentId}</p>
          </div>
        </div>

        {/* Score badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold ring-1 mb-4 ${colors.badge}`}
        >
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          Score: {agent.overallScore}
        </div>

        {/* Stats */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Repeat call rate</span>
            <span className="font-medium text-gray-900">{agent.repeatCallRate}%</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Last coached</span>
            <span className="font-medium text-gray-900">
              {agent.lastCoachedDate ?? "Not yet coached"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
