/**
 * Agent Detail View — server component.
 * Shows score breakdown, strengths/focus areas, and a per-call table.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentDetail, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";
import { ScoreBar } from "@/components/ScoreBar";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { CallTable } from "@/components/CallTable";

function scoreLabel(score: number) {
  if (score >= 80) return { text: "High Performer", color: "text-green-600" };
  if (score >= 60) return { text: "Developing", color: "text-amber-600" };
  return { text: "Needs Support", color: "text-red-600" };
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  if (!isSeeded()) seedSampleData();

  const agent = getAgentDetail(params.id);
  if (!agent) notFound();

  const label = scoreLabel(agent.overallScore);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <span>›</span>
        <span className="text-gray-900">{agent.agentName}</span>
      </nav>

      {/* Agent header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {agent.agentName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{agent.agentName}</h1>
            <p className="text-sm text-gray-500">{agent.agentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{agent.overallScore}</p>
            <p className={`text-xs font-medium mt-0.5 ${label.color}`}>{label.text}</p>
          </div>
          <Link
            href={`/agents/${params.id}/coaching`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Coaching Session
          </Link>
        </div>
      </div>

      {/* Score breakdown */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Performance Breakdown</h2>
        <div className="space-y-5">
          {agent.dimensions.map((d) => (
            <ScoreBar key={d.name} dimension={d} />
          ))}
        </div>
      </section>

      {/* Strengths & Areas of Focus */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Feedback Summary</h2>
        <FeedbackPanel strengths={agent.strengths} areasOfFocus={agent.areasOfFocus} />
      </section>

      {/* Call history */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Call History ({agent.calls.length} calls)
        </h2>
        <CallTable calls={agent.calls} />
      </section>
    </div>
  );
}
