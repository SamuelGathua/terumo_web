# Adaptive Blood Infrastructure System (ABIS) — Executive Command Center

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.8-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Repository](https://img.shields.io/badge/GitHub-SamuelGathua%2Fterumo__web-rose)](https://github.com/SamuelGathua/terumo_web)

> High-performance regional operations dashboard for the **Terumo BCT Africa Hackathon 2026**. Designed to translate quantitative ARIMA demand forecasts, Random Forest donor behavioral scores, and IoT cold-chain telemetry into proactive clinical and logistical interventions across African healthcare networks.

---

## 1. Architectural Highlights

The dashboard serves as the central command node connecting regional hub blood banks with satellite facilities, mobile collection drives, and hospital surgical wards.

```
┌────────────────────────────────────────────────────────┐
│            ABIS Executive Command Center               │
│               (Next.js App Router)                     │
└──────────┬─────────────────┬─────────────────┬─────────┘
           │                 │                 │
           ▼                 ▼                 ▼
┌──────────────────┐ ┌────────────────┐ ┌────────────────┐
│ /forecasts       │ │ /donors        │ │ /traceability  │
│ ARIMA(1,1,1)     │ │ Random Forest  │ │ Offline Ledger │
│ Confidence Bands │ │ Behavioral RFM │ │ IoT Telemetry  │
│ Liquidity Matrix │ │ Recall Trigger │ │ Cold Breaches  │
└──────────────────┘ └────────────────┘ └────────────────┘
           │                 │                 │
           └──────────────┬──┴─────────────────┘
                          ▼
            REST API (FastAPI Backend :8000)
             - GET /predict/demand/{facility} (Redis 900s)
             - POST /predict/retention (RFM Classifier)
             - GET /inventory/units
             - POST /donation/events
```

---

## 2. Core Operational Modules

### 🏥 Module 1: Executive Command Center (`/`)
- **Real-Time Regional KPIs**: Tracks cumulative unit reserve levels (1,248 units), 24h collection throughput (+114 units), critical facility shortage alerts, and temperature telemetry compliance (99.1%).
- **Critical Deficit Alerts**: Immediate banner notifications warning when facilities (e.g. Coast General Hospital) fall below calculated 7-day reserve buffers.
- **Facility Capacity Fill**: Visual percentage fill meters across primary regional referral nodes with dynamic risk tiering.
- **Active Excursion Quarantine**: Direct triage of temperature-compromised transit boxes.

### 📈 Module 2: Demand & Liquidity Forecasts (`/forecasts`)
- **ARIMA(1,1,1) Engine Projections**: Quantitative 7-day lookahead line charts complete with shaded **95% Confidence Interval** areas rendered via Recharts.
- **Facility Dynamic Selector**: Seamless switching between referral hubs (`HOSP-NAIROBI-01`, `HOSP-KISUMU-02`, `CLINIC-MOMBASA-03`).
- **Mathematical Transparency**: Direct presentation of baseline historical mean ($\mu$) and stochastic volatility ($\sigma$) driven by weekend trauma surges.
- **Decentralized Rebalancing Matrix**: Algorithmic cross-facility transfer dispatch table to proactively avert stockouts.

### 🧬 Module 3: Donor Retention AI Operations (`/donors`)
- **Live Interactive Inference Simulator**: Real-time evaluation of donor retention probabilities using client-adjustable Recency, Frequency, and Tenure sliders feeding the trained Random Forest model.
- **Automated Clinical Recommendations**: Algorithmic protocols generating SMS recall triggers or assigning personal blood donor liaisons.
- **Regional Donor Cohort Table**: Filterable roster categorized into `LOW_RISK`, `MODERATE_RISK`, and `HIGH_RISK` attrition tiers with one-click liaison dispatch.

### ❄️ Module 4: Cold-Chain & Traceability Ledger (`/traceability`)
- **Offline-First Synchronization Feed**: Chronological event feed displaying batches ingested from mobile drives operated via the Flutter field app (`terumo_frontend`).
- **One-Click Mobile Sync Simulator**: Interactive trigger demonstrating offline-to-online batch synchronization.
- **Physical Barcode Ledger**: Unit-level tracking of blood products (Whole Blood, PRBC, Platelets), countdown expiry timers, and continuous IoT storage temperature readings.

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom dark clinical aesthetic
- **Data Visualization**: Recharts (ComposedChart with Areas, Lines, and ReferenceLines)
- **Data Fetching & State**: SWR & Native Fetch with graceful offline simulation fallback
- **Icons**: Lucide React
- **Date Formatting**: `date-fns`

---

## 4. Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation
```bash
# Navigate to the terumo_web directory
cd terumo_web

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server on port 3000
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build & Verification
```bash
# Compile and build production bundle
npm run build

# Start production server
npm run start
```

---

## 5. Backend Integration

The frontend automatically attempts to communicate with the FastAPI backend at `http://localhost:8000`:
- **Demand Forecasts**: `GET http://localhost:8000/predict/demand/{facility_id}?lookahead_days=7`
- **Donor Retention**: `POST http://localhost:8000/predict/retention`
- **Donors List**: `GET http://localhost:8000/donors?limit=30`

If the backend server is temporarily offline, the frontend's built-in resilient fallback layer seamlessly generates mathematically realistic clinical mock data so that demonstrations, UI tests, and judge evaluations are never interrupted.

---

## 6. Repository Organization

```
PUKKA SAM/TERUMO BCT HACKATHON/
├── terumo_backend/      # FastAPI, PostgreSQL models, KDE/OU seeders, ML models
├── terumo_frontend/     # Reserved for Flutter Mobile Field Application
└── terumo_web/          # Next.js Command Center Dashboard (This Repository)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          # Executive Command Center
    │   │   ├── forecasts/page.tsx # ARIMA Visualizer & Liquidity Matrix
    │   │   ├── donors/page.tsx    # Retention AI Simulator & Roster
    │   │   └── traceability/page.tsx # Cold-Chain & Barcode Ledger
    │   ├── components/
    │   │   ├── ARIMAChart.tsx     # Recharts 95% Confidence Interval Chart
    │   │   ├── LayoutWrapper.tsx  # Persistent Sidebar & Header
    │   │   └── StatusBadge.tsx    # Clinical Status & Urgency Pills
    │   └── lib/
    │       └── api.ts             # Typed API client with offline resiliency
    ├── package.json
    └── tailwind.config.js / postcss.config.mjs
```

---

**Terumo BCT Africa Hackathon 2026** • Engineering Resilient Healthcare Systems
