/**
 * In-memory data store — a module-level singleton that persists for the
 * lifetime of the Next.js server process. Resets on server restart.
 * Acceptable for a local prototype; replace with a database for production.
 */

import type { AgentScore, Call, CoachingSession } from "./types";

interface StoreState {
  agentScores: AgentScore[];
  callsByAgent: Map<string, Call[]>;
  coachingSessions: Map<string, CoachingSession[]>; // agentId → sessions
  seeded: boolean;
}

const store: StoreState = {
  agentScores: [],
  callsByAgent: new Map(),
  coachingSessions: new Map(),
  seeded: false,
};

/** Replace all stored data with newly scored results (called after CSV upload) */
export function setData(agentScores: AgentScore[], calls: Call[]) {
  store.agentScores = agentScores;
  store.callsByAgent = new Map();
  for (const call of calls) {
    const existing = store.callsByAgent.get(call.agentId) ?? [];
    existing.push(call);
    store.callsByAgent.set(call.agentId, existing);
  }
  // Preserve coaching sessions across re-uploads
  store.seeded = true;
}

/** True once the sample data (or a user CSV) has been loaded */
export function isSeeded(): boolean {
  return store.seeded;
}

/** Returns lightweight summaries for the dashboard grid */
export function getAllAgentSummaries() {
  return store.agentScores.map(
    ({ agentId, agentName, overallScore, repeatCallRate, lastCoachedDate }) => ({
      agentId,
      agentName,
      overallScore,
      repeatCallRate,
      lastCoachedDate,
    })
  );
}

/** Returns full detail for one agent, or null if not found */
export function getAgentDetail(agentId: string) {
  const score = store.agentScores.find((a) => a.agentId === agentId);
  if (!score) return null;
  const calls = store.callsByAgent.get(agentId) ?? [];
  return { ...score, calls };
}

/** Returns coaching sessions for one agent, newest first */
export function getCoachingSessions(agentId: string): CoachingSession[] {
  return store.coachingSessions.get(agentId) ?? [];
}

/** Saves a new coaching session and updates the agent's lastCoachedDate */
export function addCoachingSession(session: CoachingSession) {
  const existing = store.coachingSessions.get(session.agentId) ?? [];
  existing.unshift(session); // newest first
  store.coachingSessions.set(session.agentId, existing);

  // Keep the agent summary's lastCoachedDate in sync
  const agent = store.agentScores.find((a) => a.agentId === session.agentId);
  if (agent) {
    agent.lastCoachedDate = session.date;
  }
}
