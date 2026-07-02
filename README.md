# 🩺 MediScan — AI-Powered Health Report Analyzer

**MediScan** helps people understand their medical reports in plain language. Upload a
photo of a lab report or paste the values as text, and MediScan uses **OCR** +
**Google Gemini** to extract each test, flag high/low results, explain them simply, and
suggest general diet & lifestyle tips — with report history and trend tracking over time.

> ⚕️ **Not medical advice.** MediScan explains reports; it does not diagnose or replace a
> doctor. This disclaimer is shown throughout the app.

---

## 🚀 Features

- 📤 **Upload report images** (PNG/JPG/WEBP) with drag-and-drop and client-side validation
- ✍️ **Paste report text** manually
- 🧠 **OCR + AI pipeline** — Tesseract reads the image, Gemini parses/normalizes tests
- 🎯 **Deterministic status** — high/low/normal computed in code (not the AI) for reliability
- 🎨 **Color-coded results** — red (high), blue (low), green (normal) with status chips
- 💡 **Plain-language summary**, per-finding explanations, and diet/lifestyle tips
- 🕘 **History** — past scans saved locally (localStorage)
- 📈 **Trends** — chart any repeated test's values over time against its reference range
- 🖨️ **Save as PDF** via print-optimized styles
- 🔒 **Hardened backend** — upload limits, rate limiting, CORS, structured errors, fail-fast config

---

## 🏗️ Architecture

```text
React + Vite (MUI)  ──HTTP/JSON──▶  Express API
   │                                   │
   ├─ localStorage (history)           ├─ Tesseract.js (OCR)
   └─ recharts (trends)                └─ Google Gemini (parse → normalize → summarize)
                                              status computed deterministically in code
```

### API

| Method | Route                       | Description                                   |
| ------ | --------------------------- | --------------------------------------------- |
| `GET`  | `/health`                   | Liveness/uptime check                         |
| `POST` | `/api/reports/simplify`     | Analyze a report (`reportImage` file or `{ text }`) |

Errors return a consistent shape: `{ status, code, message }`.

---

## ⚙️ Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env        # then set AI_API_KEY (get one at https://aistudio.google.com/apikey)
npm run dev                 # http://localhost:3000
```

Env vars (see `backend/.env.example`): `AI_API_KEY` (required), `AI_MODEL`, `PORT`,
`NODE_ENV`, `CORS_ORIGINS`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # optional; defaults to http://localhost:3000
npm run dev                 # http://localhost:5173
```

---

## 🗂️ Project structure

```text
backend/
  index.js                  # app bootstrap, CORS, health check, error handling
  src/
    config/env.js           # validated, fail-fast environment config
    middleware/             # upload limits, rate limiting, error handler
    routes/ controllers/    # request wiring
    services/               # ocrService, aiService (Gemini pipeline)
    utils/                  # AppError, logger
frontend/
  src/
    api/client.js           # axios instance + typed error messages
    components/             # Header, ReportInput, ResultsView, TrendChart, ...
    hooks/useHistory.js     # localStorage-backed report history
    utils/                  # status colors, print helper
    theme.js                # MUI "Plum" theme
```

---

## 🔭 Ideas for the future

- User accounts + cloud persistence (e.g. MongoDB) instead of localStorage
- Multi-language explanations (e.g. Hinglish)
- Automated tests for the status-calculation logic and API contract
- Dockerfile + one-click deploy config
