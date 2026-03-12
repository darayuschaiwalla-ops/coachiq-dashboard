/**
 * Seeds the in-memory store with sample transcript data on first server start.
 * Reads the bundled sample CSV so the dashboard is immediately usable
 * without requiring the manager to upload a file first.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { parseCSV } from "./csvParser";
import { scoreAgents } from "./scoringEngine";
import { setData, isSeeded } from "./store";

export function seedSampleData(): void {
  if (isSeeded()) return; // Already seeded — nothing to do

  const csvPath = join(process.cwd(), "src", "data", "sample-transcripts.csv");

  let csvText: string;
  try {
    csvText = readFileSync(csvPath, "utf-8");
  } catch {
    console.warn("[seedData] Could not read sample CSV at", csvPath);
    return;
  }

  const calls = parseCSV(csvText);
  if (calls.length === 0) {
    console.warn("[seedData] Sample CSV parsed 0 valid rows — store not seeded.");
    return;
  }

  const agentScores = scoreAgents(calls);
  setData(agentScores, calls);
  console.log(
    `[seedData] Seeded ${agentScores.length} agents from ${calls.length} sample calls.`
  );
}
