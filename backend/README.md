# LogLens — Backend

LogLens backend — an Express + MongoDB app that ingests logs (CSV/JSON), runs
an explainable anomaly detector, persists logs, and exposes APIs for listing,
querying, anomaly inspection and AI explanation (Gemini). The AI only explains — it
does not decide anomalies.

Tech stack
- Node.js (ES Modules — `import`/`export`), Express.js
- MongoDB via Mongoose
- Multer for file uploads (in-memory storage)
- Google Gemini via the official `@google/genai` SDK for AI explanations

Quick start
1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `GEMINI_API_KEY` (optionally `GEMINI_MODEL`).
2. `npm install`
3. `npm run dev` (or `npm start` for production)

Project structure

```
loglens-backend/
├─ package.json          # "type": "module" — ESM throughout
├─ .env.example
└─ src/
   ├─ app.js             # Express app + middleware + routes
   ├─ server.js           # Entry point, connects DB and starts the Express server
   ├─ config/db.js         # Mongoose connection
   ├─ controllers/         # Request handlers
   ├─ models/log.model.js  # Mongoose schema
   ├─ routes/              # Express routers
   ├─ services/            # Business logic (log parsing, anomaly scoring, Gemini)
   ├─ middleware/           # Multer upload config + centralized error handler
   └─ utils/                # Parsing + validation helpers
```

API highlights
- `POST /api/logs/upload` — multipart `file` (CSV or JSON)
- `GET /api/logs` — filters, pagination, search
- `GET /api/logs/:id` — single log details
- `DELETE /api/logs` — delete all logs
- `GET /api/anomalies` — list anomalies
- `GET /api/anomalies/:id` — anomaly details
- `POST /api/anomalies/:id/analyze` — call Gemini to explain an anomaly
- `GET /api/dashboard/stats`, `/api/dashboard/activity`, `/api/dashboard/top-sources`
- `GET /health` — health check

Anomaly detection
- Deterministic, explainable hybrid scoring (0-100)
- Signals: HTTP status severity, repeated failures from same source, request-rate deviation, source behavior change
- Stores `isAnomaly`, `anomalyScore`, `anomalyLevel`, and `detectionReasons` for each log

Why AI is separate
- The anomaly detector is deterministic and data-driven so the system can reliably
  reproduce and explain why an event was flagged.
- Gemini is used only to generate a human-friendly, structured (JSON) explanation and
  suggested next steps based on already-detected anomalies. This keeps AI usage efficient,
  auditable, and cheap during ingestion.

Limitations
- Simple rule-based detector for assessment simplicity — no ML model included.
- Gemini integration requires a valid `GEMINI_API_KEY` (get one from Google AI Studio).
