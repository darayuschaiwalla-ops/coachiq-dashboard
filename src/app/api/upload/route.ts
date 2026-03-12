/**
 * POST /api/upload
 * Accepts a multipart form-data request containing a CSV file,
 * parses it, scores the agents, and stores the results in memory.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseCSV } from "@/lib/csvParser";
import { scoreAgents } from "@/lib/scoringEngine";
import { setData } from "@/lib/store";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided. Send a CSV as 'file'." }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json({ error: "Only .csv files are accepted." }, { status: 400 });
  }

  let csvText: string;
  try {
    csvText = await file.text();
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded file." }, { status: 400 });
  }

  const calls = parseCSV(csvText);
  if (calls.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found. Check that your CSV has the required columns." },
      { status: 422 }
    );
  }

  const agentScores = scoreAgents(calls);
  setData(agentScores, calls);

  return NextResponse.json({
    success: true,
    agentCount: agentScores.length,
    callCount: calls.length,
  });
}
