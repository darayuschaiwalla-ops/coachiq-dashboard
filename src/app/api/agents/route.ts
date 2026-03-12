/**
 * GET /api/agents
 * Returns lightweight summaries for all agents (used by the dashboard grid).
 * Auto-seeds sample data if the store has not been populated yet.
 */

import { NextResponse } from "next/server";
import { getAllAgentSummaries, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";

export async function GET() {
  if (!isSeeded()) {
    seedSampleData();
  }
  return NextResponse.json(getAllAgentSummaries());
}
