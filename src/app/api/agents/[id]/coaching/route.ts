/**
 * GET  /api/agents/[id]/coaching  — list coaching sessions for an agent
 * POST /api/agents/[id]/coaching  — log a new coaching session
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCoachingSessions, addCoachingSession, isSeeded } from "@/lib/store";
import { seedSampleData } from "@/lib/seedData";
import type { CoachingSession } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSeeded()) seedSampleData();
  return NextResponse.json(getCoachingSessions(params.id));
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSeeded()) seedSampleData();

  let body: { date?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const session: CoachingSession = {
    id: randomUUID(),
    agentId: params.id,
    date: body.date ?? new Date().toISOString().split("T")[0],
    notes: body.notes ?? "",
    completedAt: new Date().toISOString(),
  };

  addCoachingSession(session);
  return NextResponse.json(session, { status: 201 });
}
