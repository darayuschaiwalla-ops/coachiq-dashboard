/**
 * Coaching Panel — server component.
 * Displays AI-generated coaching suggestions and a form to log sessions.
 * Past sessions are listed below the form.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentDetail, getCoachingSessions, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";
import { CoachingForm } from "@/components/CoachingForm";

export default function CoachingPage({ params }: { params: { id: string } }) {
  if (!isSeeded()) seedSampleData();

  const agent = getAgentDetail(params.id);
  if (!agent) notFound();

  const sessions = getCoachingSessions(params.id);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <span>›</span>
        <Link
          href={`/agents/${params.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          {agent.agentName}
        </Link>
        <span>›</span>
        <span className="text-gray-900">Coaching Session</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Coaching Session — {agent.agentName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overall score: <strong>{agent.overallScore}/100</strong> · Repeat call rate:{" "}
          <strong>{agent.repeatCallRate}%</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: coaching suggestions */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <span>💡</span> Coaching Suggestions
            </h2>
            <p className="text-xs text-blue-700 mb-3">
              Based on this agent&apos;s lowest-scoring performance dimensions:
            </p>
            <ul className="space-y-3">
              {agent.coachingSuggestions.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-blue-800">
                  <span className="shrink-0 font-bold text-blue-400">{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas of focus reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-800 mb-3">Areas of Focus</h2>
            <ul className="space-y-2">
              {agent.areasOfFocus.map((area, i) => (
                <li key={i} className="text-sm text-amber-700 flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: session form */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Log Coaching Session</h2>
          <CoachingForm agentId={params.id} />
        </div>
      </div>

      {/* Session history */}
      {sessions.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Session History ({sessions.length})
          </h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{session.date}</span>
                  <span className="text-xs text-gray-400">
                    Logged {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                </div>
                {session.notes ? (
                  <p className="text-sm text-gray-600">{session.notes}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No notes recorded.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
