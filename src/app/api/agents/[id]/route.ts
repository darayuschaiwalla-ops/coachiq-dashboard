/**
 * GET /api/agents/[id]
 * Returns full detail for one agent: score breakdown, feedback, and call list.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgentDetail, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSeeded()) {
    seedSampleData();
  }

  const detail = getAgentDetail(params.id);
  if (!detail) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
