/**
 * CSV Parser
 * Converts raw CSV text (uploaded or from sample file) into typed Call objects.
 * Uses PapaParse for robust RFC 4180 parsing.
 */

import Papa from "papaparse";
import type { Call } from "./types";

// Raw row shape before type coercion
interface CsvRow {
  call_id: string;
  agent_id: string;
  agent_name: string;
  call_date: string;
  duration_seconds: string;
  topic: string;
  resolution: string;
  customer_utterances: string;
  agent_utterances: string;
}

const VALID_TOPICS = new Set(["billing", "technical", "cancellation", "account", "general"]);
const VALID_RESOLUTIONS = new Set(["resolved", "unresolved", "escalated"]);

export function parseCSV(csvText: string): Call[] {
  const result = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    // Normalise headers: trim whitespace, lowercase, replace spaces with underscores
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  return result.data
    .map((row) => {
      const topic = row.topic?.trim().toLowerCase();
      const resolution = row.resolution?.trim().toLowerCase();

      return {
        callId: row.call_id?.trim() ?? "",
        agentId: row.agent_id?.trim() ?? "",
        agentName: row.agent_name?.trim() ?? "",
        callDate: row.call_date?.trim() ?? "",
        durationSeconds: Math.max(0, parseInt(row.duration_seconds, 10) || 0),
        topic: (VALID_TOPICS.has(topic) ? topic : "general") as Call["topic"],
        resolution: (VALID_RESOLUTIONS.has(resolution)
          ? resolution
          : "unresolved") as Call["resolution"],
        customerUtterances: row.customer_utterances?.trim() ?? "",
        agentUtterances: row.agent_utterances?.trim() ?? "",
      } satisfies Call;
    })
    // Filter out rows missing required fields
    .filter((c) => c.callId && c.agentId && c.agentName);
}
