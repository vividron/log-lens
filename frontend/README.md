# LogLens — Smart Log Analyzer & Anomaly Detector

A high-performance, developer-grade observability interface built with **React**, **Tailwind CSS**, and **Lucide Icons** to monitor application telemetry, investigate unusual server behavior, and view automated AI root-cause analysis.

---

## ⚡ Core Philosophy & Architecture

1. **Clear Detection Engine vs AI Separation**:
   - **Detection Engine**: Identifies anomalies deterministically, calculates numerical anomaly scores ($0-100$), and outputs exact mathematical detection reasons.
   - **AI Analysis**: Asynchronously explains the flagged anomaly, predicts likely root causes, and proposes remediation steps. AI never decides whether a log is anomalous.
2. **Quiet vs Loud Observability UI**:
   - Baseline normal telemetry is visually quiet to reduce cognitive load.
   - Anomalies demand immediate attention through semantic indicators, score badges, and contextual highlights.
3. **Resilient Network Layer**:
   - Built to communicate with REST backend services via Axios (`/logs`, `/anomalies`, `/dashboard/stats`, `/ai/explain`).
   - Seamless built-in telemetry simulation and fallback engine when running standalone or when the backend server is offline.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
Frontend/
├── public/
│   ├── favicon.svg
│   └── sample-logs.json             # Sample dataset for upload testing
├── src/
│   ├── components/
│   │   ├── layout/                  # Sidebar, Header, AppLayout
│   │   ├── dashboard/               # StatCard, ActivityTimeline, AnomalyBreakdown, RecentAnomalies
│   │   ├── logs/                    # LogTable, LogRow, LogFilterBar, LogDetailDrawer, AnomalyScore
│   │   ├── anomalies/               # AnomalyList, SeverityBadge
│   │   ├── ai/                      # AIAnalysis
│   │   ├── upload/                  # UploadLogsModal
│   │   └── common/                  # Button, Skeleton, EmptyState, ErrorState, Toast
│   ├── context/
│   │   ├── AppContext.jsx           # Global drawer, upload modal, toasts, refresh triggers
│   │   └── FilterContext.jsx        # Cross-page filter synchronization
│   ├── hooks/
│   │   ├── useLogs.js               # Debounced search, pagination, filter queries
│   │   ├── useAnomalies.js          # Anomaly queries and score filtering
│   │   ├── useDashboardStats.js     # Metrics and timeline series
│   │   └── useDebounce.js           # Search input debouncer
│   ├── services/
│   │   ├── api.js                   # Configurable Axios client
│   │   ├── logService.js            # getLogs, getLogById, uploadLogs
│   │   ├── anomalyService.js        # getAnomalies, getTopSources, getSeverityBreakdown
│   │   ├── dashboardService.js      # getDashboardStats, getActivityTimeline
│   │   └── aiService.js             # getAIAnalysis, retryAIAnalysis
│   ├── utils/
│   │   ├── formatters.js            # Timestamps, bytes, severity styling, clipboard
│   │   ├── mockData.js              # Initial realistic telemetry store
│   │   └── parser.js                # Multi-format log parser (.log, .json, .csv, .txt)
│   ├── pages/
│   │   ├── Dashboard.jsx            # Monitoring overview & timeline
│   │   ├── Logs.jsx                 # Full telemetry explorer & table
│   │   ├── Anomalies.jsx            # Flagged anomaly investigation feed
│   │   └── Settings.jsx             # Engine threshold tuning & API config
│   ├── App.jsx                      # Router and provider setup
│   ├── index.css                    # Tailwind CSS directives and custom scrollbars
│   └── main.jsx                     # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.js
```
