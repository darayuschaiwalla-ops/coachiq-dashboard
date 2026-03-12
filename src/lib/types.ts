// ─── Core domain types ────────────────────────────────────────────────────────

/** A single call transcript row parsed from the uploaded CSV */
export interface Call {
  callId: string;
  agentId: string;
  agentName: string;
  callDate: string; // ISO date string (YYYY-MM-DD)
  durationSeconds: number;
  topic: "billing" | "technical" | "cancellation" | "account" | "general";
  resolution: "resolved" | "unresolved" | "escalated";
  customerUtterances: string;
  agentUtterances: string;
}

/** A single scored performance dimension (0–100) */
export interface DimensionScore {
  name: string; // machine-readable key matching coaching suggestion map
  label: string; // display label
  score: number; // 0–100
  description: string; // one-line explanation of the score
}

/** Full scoring result for one agent */
export interface AgentScore {
  agentId: string;
  agentName: string;
  overallScore: number; // weighted average of dimensions
  repeatCallRate: number; // % of calls that were unresolved or escalated
  dimensions: DimensionScore[];
  strengths: string[]; // top 2 dimension descriptions
  areasOfFocus: string[]; // bottom 2 dimension descriptions
  coachingSuggestions: string[]; // actionable tips for the lowest dimensions
  lastCoachedDate: string | null; // updated when a coaching session is logged
}

/** Lightweight summary used on the dashboard grid */
export interface AgentSummary {
  agentId: string;
  agentName: string;
  overallScore: number;
  repeatCallRate: number;
  lastCoachedDate: string | null;
}

/** Full agent detail — summary + dimension breakdown + call list */
export interface AgentDetail extends AgentSummary {
  dimensions: DimensionScore[];
  strengths: string[];
  areasOfFocus: string[];
  coachingSuggestions: string[];
  calls: Call[];
}

/** A logged coaching session */
export interface CoachingSession {
  id: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  notes: string;
  completedAt: string; // ISO timestamp
}
