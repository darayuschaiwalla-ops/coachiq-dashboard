# CoachIQ — Call Center Coaching Dashboard

A prototype coaching dashboard for call center team managers. Upload call transcript CSVs, get automatic performance analysis for each agent, and log coaching sessions — all in one place.

---

## Prerequisites

**Node.js 18 or later** is required.

Download and install from: https://nodejs.org (choose the LTS version)

After installing, verify it works:
```bash
node --version   # should print v18.x.x or higher
npm --version
```

---

## Setup & Running

```bash
# 1. Open a terminal and navigate into the project folder
cd coaching-dashboard

# 2. Install dependencies (only needed once)
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to:
#    http://localhost:3000
```

The dashboard loads immediately with sample data — no upload needed to explore.

---

## Features

### Dashboard Home (`/`)
- Overview grid of all agents with overall score, repeat call rate, and last coached date
- Score badges are colour-coded: **green ≥ 80**, **amber 60–79**, **red < 60**
- Upload Transcripts button to replace sample data with your own CSV

### Agent Detail (`/agents/[id]`)
- Five scored performance dimensions with explanations
- Strengths panel (top 2 dimensions) and Areas of Focus panel (bottom 2)
- Full call history table with resolution status for each call

### Coaching Panel (`/agents/[id]/coaching`)
- Automatically generated coaching suggestions based on the agent's weakest dimensions
- Form to record session date and notes
- Chronological history of past coaching sessions

---

## CSV Format

When uploading your own transcript data, the CSV must include these columns (header row required):

| Column | Description |
|---|---|
| `call_id` | Unique call identifier |
| `agent_id` | Agent's unique ID |
| `agent_name` | Agent's full name |
| `call_date` | Date in YYYY-MM-DD format |
| `duration_seconds` | Call length in seconds |
| `topic` | One of: `billing`, `technical`, `cancellation`, `account`, `general` |
| `resolution` | One of: `resolved`, `unresolved`, `escalated` |
| `customer_utterances` | Customer's side of the conversation (plain text) |
| `agent_utterances` | Agent's side of the conversation (plain text) |

A sample file is included at `src/data/sample-transcripts.csv` with 6 agents and 30 calls.

---

## Scoring Model

Each agent is scored across five dimensions using rule-based heuristics:

| Dimension | Weight | How it's scored |
|---|---|---|
| Empathy | 25% | Keyword density in agent utterances (e.g., "I understand", "I apologize") |
| Resolution Rate | 30% | % of calls marked `resolved` |
| Communication Clarity | 20% | Avg sentence length + filler word detection |
| Professionalism | 15% | Positive vs. negative language markers |
| Call Efficiency | 10% | Actual duration vs. topic-specific benchmark |

The **Overall Score** is the weighted average of all five dimensions (0–100).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Dashboard Home
│   ├── agents/[id]/page.tsx          # Agent Detail
│   ├── agents/[id]/coaching/page.tsx # Coaching Panel
│   └── api/                          # REST API routes
├── components/                       # Reusable UI components
├── lib/
│   ├── types.ts                      # TypeScript interfaces
│   ├── store.ts                      # In-memory data store
│   ├── csvParser.ts                  # CSV → Call[] parser
│   ├── scoringEngine.ts              # Scoring rules
│   └── seedData.ts                   # Sample data loader
└── data/
    └── sample-transcripts.csv        # Sample data (30 calls)
```

---

## Notes

- **Data resets on server restart.** The store is in-memory only — re-upload your CSV after restarting `npm run dev`. A database (e.g., SQLite, Postgres) would be the next step for persistence.
- **No authentication.** This is an open prototype — add NextAuth or similar for production.
- **Scoring is heuristic.** The keyword-based engine is designed to demo the concept. Swap `src/lib/scoringEngine.ts` with a Claude API call for more nuanced analysis.
