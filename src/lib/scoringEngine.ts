/**
 * Mock Scoring Engine
 *
 * Scores each agent across five dimensions using keyword matching and
 * simple heuristics. Returns AgentScore objects with strengths, areas
 * of focus, and coaching suggestions derived from the scores.
 *
 * Weights:
 *   Empathy              25%
 *   Resolution Rate      30%
 *   Communication Clarity 20%
 *   Professionalism      15%
 *   Call Efficiency      10%
 */

import type { Call, AgentScore, DimensionScore } from "./types";

// ─── Scoring constants ────────────────────────────────────────────────────────

/** Expected call duration (seconds) per topic, used for efficiency scoring */
const DURATION_BENCHMARKS: Record<string, number> = {
  billing: 300, // 5 min
  technical: 480, // 8 min
  cancellation: 360, // 6 min
  account: 240, // 4 min
  general: 200, // ~3 min
};

const EMPATHY_KEYWORDS = [
  "completely understand",
  "i understand",
  "sincerely apologize",
  "i apologize",
  "i am sorry",
  "i'm sorry",
  "i hear you",
  "i appreciate",
  "happy to help",
  "i am here to help",
  "i'm here to help",
  "let me help",
  "i can imagine",
  "that must be",
  "i know how",
];

const POSITIVE_MARKERS = [
  "certainly",
  "absolutely",
  "of course",
  "definitely",
  "happy to",
  "glad to",
  "my pleasure",
  "right away",
  "i will",
  "i can",
];

const NEGATIVE_MARKERS = [
  "can't",
  "cannot",
  "won't",
  "unable to",
  "not possible",
  "we don't",
  "we can't",
  "we won't",
  "there's nothing",
  "nothing i can",
  "there is nothing",
  "nothing we can",
];

const FILLER_WORDS = ["um,", "um ", "uh,", "uh ", "like,", "you know,", "basically,"];

// ─── Dimension scorers ────────────────────────────────────────────────────────

function scoreEmpathy(calls: Call[]): number {
  if (calls.length === 0) return 0;
  const scores = calls.map((call) => {
    const text = call.agentUtterances.toLowerCase();
    const hits = EMPATHY_KEYWORDS.filter((kw) => text.includes(kw)).length;
    // Discrete scale: more hits = higher score
    if (hits === 0) return 20;
    if (hits === 1) return 50;
    if (hits === 2) return 70;
    if (hits === 3) return 85;
    return 100;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function scoreResolutionRate(calls: Call[]): number {
  if (calls.length === 0) return 0;
  const resolved = calls.filter((c) => c.resolution === "resolved").length;
  return Math.round((resolved / calls.length) * 100);
}

function scoreCommunicationClarity(calls: Call[]): number {
  if (calls.length === 0) return 0;
  const scores = calls.map((call) => {
    const text = call.agentUtterances.toLowerCase();
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
    const avgLen =
      sentences.length > 0
        ? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length
        : 15;
    // Ideal ≤ 15 words per sentence; each word over = −3 points
    const lenScore = Math.max(0, 100 - Math.max(0, avgLen - 15) * 3);
    // Each filler word found = −8 points
    const fillerHits = FILLER_WORDS.filter((f) => text.includes(f)).length;
    return Math.max(0, lenScore - fillerHits * 8);
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function scoreProfessionalism(calls: Call[]): number {
  if (calls.length === 0) return 0;
  const scores = calls.map((call) => {
    const text = call.agentUtterances.toLowerCase();
    const pos = POSITIVE_MARKERS.filter((m) => text.includes(m)).length;
    const neg = NEGATIVE_MARKERS.filter((m) => text.includes(m)).length;
    // Base 65; +5 per positive (max +30); −10 per negative (max −40)
    return Math.min(100, Math.max(0, 65 + pos * 5 - neg * 10));
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function scoreCallEfficiency(calls: Call[]): number {
  if (calls.length === 0) return 0;
  const scores = calls.map((call) => {
    const benchmark = DURATION_BENCHMARKS[call.topic] ?? 300;
    const ratio = call.durationSeconds / benchmark;
    if (ratio <= 1.0) return 100;
    if (ratio <= 1.25) return 80;
    if (ratio <= 1.5) return 60;
    if (ratio <= 2.0) return 40;
    return 20;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ─── Dimension configuration ──────────────────────────────────────────────────

const DIMENSION_CONFIGS = [
  {
    name: "empathy",
    label: "Empathy",
    weight: 0.25,
    scoreFn: scoreEmpathy,
    descriptionHigh: "Consistently uses empathetic language and acknowledges customer concerns.",
    descriptionLow: "Rarely uses empathetic language — customers may feel unheard.",
  },
  {
    name: "resolutionRate",
    label: "Resolution Rate",
    weight: 0.3,
    scoreFn: scoreResolutionRate,
    descriptionHigh: "Resolves the majority of issues on the first call.",
    descriptionLow: "High rate of unresolved or escalated calls — driving repeat contacts.",
  },
  {
    name: "clarity",
    label: "Communication Clarity",
    weight: 0.2,
    scoreFn: scoreCommunicationClarity,
    descriptionHigh: "Uses clear, concise language with minimal filler words.",
    descriptionLow: "Tends to use long sentences or filler words, reducing clarity.",
  },
  {
    name: "professionalism",
    label: "Professionalism",
    weight: 0.15,
    scoreFn: scoreProfessionalism,
    descriptionHigh: "Consistently professional, solution-focused tone.",
    descriptionLow: "Occasional negative language that can frustrate customers.",
  },
  {
    name: "efficiency",
    label: "Call Efficiency",
    weight: 0.1,
    scoreFn: scoreCallEfficiency,
    descriptionHigh: "Handles calls efficiently within expected timeframes.",
    descriptionLow: "Calls run significantly over expected duration.",
  },
] as const;

// ─── Coaching suggestions per dimension ───────────────────────────────────────

const COACHING_SUGGESTIONS: Record<string, string[]> = {
  empathy: [
    'Open every call with an empathy statement — e.g., "I completely understand how frustrating that must be."',
    "Listen for emotional cues and acknowledge the customer's feelings before jumping to solutions.",
    "Role-play difficult customer scenarios to practise empathetic responses under pressure.",
  ],
  resolutionRate: [
    "Review your last 10 unresolved calls — identify the most common root causes and knowledge gaps.",
    "Ask probing questions early to fully diagnose the issue before proposing a fix.",
    "Familiarise yourself with escalation protocols so edge cases are handled without leaving the issue open.",
  ],
  clarity: [
    "Aim for sentences under 15 words. Break complex ideas into two shorter sentences.",
    'Record a practice call and listen back for filler words (um, uh, "you know").',
    "Slow your delivery pace — clearer pacing naturally reduces filler words.",
  ],
  professionalism: [
    'Replace "I can\'t do that" with "What I can do is…" to keep the conversation solution-focused.',
    "Avoid starting sentences with negatives — reframe limitations as what IS possible.",
    "Review the customer interaction standards guide before your next shift.",
  ],
  efficiency: [
    "After diagnosing the issue, confirm your proposed fix before going into detail — reduces back-and-forth.",
    "Use call notes to track recurring issue types so you can resolve them faster on repeat contacts.",
    "At 80% of the expected call duration, assess where you are and steer toward a resolution.",
  ],
};

// ─── Main export ──────────────────────────────────────────────────────────────

/** Scores all agents from a flat list of calls, returning one AgentScore per agent */
export function scoreAgents(calls: Call[]): AgentScore[] {
  // Group calls by agentId
  const agentMap = new Map<string, { name: string; calls: Call[] }>();
  for (const call of calls) {
    if (!agentMap.has(call.agentId)) {
      agentMap.set(call.agentId, { name: call.agentName, calls: [] });
    }
    agentMap.get(call.agentId)!.calls.push(call);
  }

  const results: AgentScore[] = [];

  for (const [agentId, { name, calls: agentCalls }] of agentMap) {
    // Score each dimension
    const dimensions: DimensionScore[] = DIMENSION_CONFIGS.map((cfg) => {
      const score = cfg.scoreFn(agentCalls);
      return {
        name: cfg.name,
        label: cfg.label,
        score,
        description: score >= 65 ? cfg.descriptionHigh : cfg.descriptionLow,
      };
    });

    // Weighted overall score
    const overallScore = Math.round(
      DIMENSION_CONFIGS.reduce((sum, cfg, i) => sum + cfg.weight * dimensions[i].score, 0)
    );

    // Repeat call rate = % of calls not resolved on first contact
    const repeatCallRate = Math.round(
      (agentCalls.filter((c) => c.resolution !== "resolved").length / agentCalls.length) * 100
    );

    // Sort dimensions: top 2 = strengths, bottom 2 = areas of focus
    const sorted = [...dimensions].sort((a, b) => b.score - a.score);
    const strengths = sorted.slice(0, 2).map((d) => `${d.label}: ${d.description}`);
    const areasOfFocus = sorted.slice(-2).map((d) => `${d.label}: ${d.description}`);

    // Pull coaching suggestions from the two lowest-scoring dimensions
    const coachingSuggestions = sorted
      .slice(-2)
      .flatMap((d) => COACHING_SUGGESTIONS[d.name] ?? [])
      .slice(0, 5);

    results.push({
      agentId,
      agentName: name,
      overallScore,
      repeatCallRate,
      dimensions,
      strengths,
      areasOfFocus,
      coachingSuggestions,
      lastCoachedDate: null,
    });
  }

  // Return agents sorted alphabetically by name
  return results.sort((a, b) => a.agentName.localeCompare(b.agentName));
}
