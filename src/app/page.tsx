/**
 * Dashboard Home — server component.
 * Reads agent summaries directly from the in-memory store
 * (auto-seeded with sample data on first load).
 */

import { getAllAgentSummaries, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";
import { AgentCard } from "@/components/AgentCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import type { AgentSummary } from "@/lib/types";

export default function DashboardPage() {
  // Seed sample data on first load if the store is empty
  if (!isSeeded()) {
    seedSampleData();
  }

  const agents: AgentSummary[] = getAllAgentSummaries();

  return (
    <div>
      <DashboardHeader />

      {agents.length === 0 ? (
        <div className="mt-16 text-center text-gray-400">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-lg font-medium">No agent data loaded</p>
          <p className="text-sm mt-1">
            Click <strong>Upload Transcripts</strong> above to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span>
              <strong className="text-gray-900">{agents.length}</strong> agents
            </span>
            <span>
              Avg score:{" "}
              <strong className="text-gray-900">
                {Math.round(agents.reduce((s, a) => s + a.overallScore, 0) / agents.length)}
              </strong>
            </span>
            <span>
              Needing coaching:{" "}
              <strong className="text-gray-900">
                {agents.filter((a) => !a.lastCoachedDate).length}
              </strong>
            </span>
          </div>

          {/* Agent grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.agentId} agent={agent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
