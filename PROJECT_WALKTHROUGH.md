# PRAVAAH — Project Overview & Comprehensive Walkthrough

> **Tagline**: *From Customer Conversation to Business Action. Automatically.*  
> **Alternative Tagline**: *Where Business Workflows Flow Automatically.*  
> **Core Operating Philosophy**: *"Most AI assistants stop after answering. Pravaah continues until the business workflow moves forward to completion."*

---

## 1. Executive Summary

**Pravaah** (representing *flow, movement, and continuous progression*) is a production-oriented, enterprise-grade AI Operations Platform. It bridges the gap between raw customer interactions across multiple channels (WhatsApp, Web Chat, SMS, Email, Inbound Phone Calls) and real-world business execution (CRM pipeline qualification, calendar bookings, contract extraction, and downstream automations).

Unlike traditional chatbot solutions that terminate after sending a text reply ("Dead End"), Pravaah operates on a **5-stage continuous progression model**, orchestrating business workflows from initial contact to completed transaction without manual data entry.

```text
  [1. INGEST] Multi-Channel Touchpoint (WhatsApp / Web / SMS / Email / Voice / SOW)
        ↓
  [2. UNDERSTAND] Context & Entity Extraction (BANT 0-100, Intent, Value, Timeline)
        ↓
  [3. DECIDE] Flow Policy Matching & Logic Routing (Enterprise Rules, SLA Triggers)
        ↓
  [4. ACT] Business Tool & Mutation Execution (CRM Lead Sync, Calendar Booking, SOW Dispatch)
        ↓
  [5. CONTINUE] Downstream Progression Chain (Meeting Prep Brief, Follow-up Queue, Task Alert)
```

---

## 2. Project Architecture & Technology Stack

### Frontend Architecture (`/client`)
* **Framework**: React 18 + Vite
* **Styling**: Tailwind CSS v4 configured with the **Reliant Enterprise** Design System
* **Routing**: React Router DOM v7 (Smooth transitions + global `ScrollToTop`)
* **Icons**: Lucide React
* **Database & Auth SDK**: `@supabase/supabase-js`
* **Performance**: Production bundle builds in **< 900ms** with zero errors

### Directory Layout
```text
Pravaah/
├── client/
│   ├── public/
│   │   └── pravaah-logo.png            # Official high-resolution brand assets
│   ├── src/
│   │   ├── assets/                     # Brand graphics and icons
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── PravaahLogo.jsx     # Glowing blue star mark, typography & badges
│   │   │   │   └── ScrollToTop.jsx     # Smooth route transition helper
│   │   │   ├── landing/
│   │   │   │   ├── InteractiveFlowHero.jsx   # 5-stage interactive simulator
│   │   │   │   ├── ArchitectureShowcase.jsx  # Interactive system architecture
│   │   │   │   ├── ComparisonSection.jsx     # Traditional AI vs. Pravaah matrix
│   │   │   │   └── WatchPravaahModal.jsx     # 5-step guided walkthrough modal
│   │   │   └── ui/
│   │   │       ├── Badge.jsx           # Tonal status badges (Success, Accent, etc.)
│   │   │       ├── Button.jsx          # Primary, Accent, Secondary, Ghost buttons
│   │   │       ├── Card.jsx            # Level 1/2 elevation containers
│   │   │       ├── Input.jsx           # Focus-ring form inputs
│   │   │       ├── Modal.jsx           # Level 3 overlay dialogs
│   │   │       └── index.js            # Unified component exports
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx     # Topbar, responsive sidebar & status pills
│   │   ├── lib/
│   │   │   └── supabaseClient.js       # Supabase database & auth integration
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # High-converting product landing page
│   │   │   ├── Dashboard.jsx           # Operational Command Center
│   │   │   ├── Conversations.jsx       # Real-time multi-channel chat & reasoning
│   │   │   ├── Login.jsx               # Branded login experience
│   │   │   └── Signup.jsx              # 14-day trial provisioning with strength meter
│   │   ├── index.css                   # Reliant Enterprise @theme tokens
│   │   ├── App.jsx                     # Route definitions
│   │   └── main.jsx                    # Root entry point
│   └── package.json
├── DESIGN.md                           # Official Reliant Enterprise design specs
├── DOCUMENTATION.md                    # Exhaustive page-by-page & button manual
├── ReadMe                              # Quick reference guide
└── PROJECT_WALKTHROUGH.md              # Complete project overview & roadmap
```

---

## 3. UI & Page Walkthrough

### 1. Landing Page (`/`) — [`Landing.jsx`](file:///c:/Users/Manve/Desktop/Pravaah/client/src/pages/Landing.jsx)
* **Header**: Floating glassmorphism navbar with brand mark, anchor links (`#simulator`, `#architecture`, `#features`, `#comparison`), `Command Center` link, and `Start Your Flow` CTA.
* **Hero**: Compelling executive statement: *"Business Doesn’t Stop at Conversations. Pravaah turns customer interactions into intelligent actions and continuous business workflows."*
* **Live Interactive Simulator (`InteractiveFlowHero.jsx`)**: Allows visitors to test pre-set scenarios (Enterprise Inbound, SLA Escalation, SOW Contract) or type custom inquiries to watch the 5-stage reasoning stepper in real time.
* **Architecture Showcase (`ArchitectureShowcase.jsx`)**: 5-stage interactive selector displaying operational capabilities and live blueprint diagrams.
* **Operations Suite**: Explains the 6 pillars (Pravaah Agent, BANT Radar, Scheduler, Flows Engine, Doc Intelligence, Command Center).
* **Comparison Section (`ComparisonSection.jsx`)**: High-contrast comparison between dead-end chatbots and Pravaah's continuous progression engine.
* **Guided Walkthrough Modal (`WatchPravaahModal.jsx`)**: 5-step automated simulation with auto-play and manual controls.

### 2. Operational Command Center (`/dashboard`) — [`Dashboard.jsx`](file:///c:/Users/Manve/Desktop/Pravaah/client/src/pages/Dashboard.jsx)
* **Executive Header**: Live `● Continuous Flow Active` telemetry pill, `Sync Telemetry` refresh trigger, and shortcut to Conversations.
* **5 Operational Velocity KPI Cards**:
  1. *Flow Execution Velocity (`99.4%`)* — 1,482 actions automated with zero drop-off.
  2. *AI Qualified Leads (`412`)* — $1.84M qualified pipeline with 88.5 avg BANT score.
  3. *Meetings Booked (`89`)* — Autonomous conflict-free calendar booking.    
  4. *Documents Processed (`164`)* — OCR extracted contracts & CRM stage syncing.
  5. *Operations Hours Saved (`142.5h`)* — $18.4k estimated monthly labor ROI.
* **Live 5-Stage Pipeline Monitor**: Real-time visual tracking of interactions moving through Ingestion, Understanding, Decision, Action, and Progression.
* **Human-in-the-Loop Action Approval Queue**: Interactive decision cards with 1-click **"Approve & Execute"** and **"Dismiss"** controls.
* **Omnichannel Telemetry Table**: Real-time interaction feed with channel filters and an interactive **"Inspect Flow"** telemetry breakdown modal.

### 3. Conversations Hub (`/dashboard/conversations`) — [`Conversations.jsx`](file:///c:/Users/Manve/Desktop/Pravaah/client/src/pages/Conversations.jsx)
* **Omnichannel Inbox**: Unified thread list across WhatsApp, Web Chat, and SMS with search and status filter tabs (`All`, `Booked`, `Qualified`, `Unread`).
* **Live Chat Stream**: Color-coded bubbles distinguishing Inbound Customer, Operator Agent, and Autonomous AI.
* **AI Autopilot Switch**: Instant toggle between full autonomous execution and manual agent takeover.
* **AI Quick Suggestions**: Context-aware 1-click reply chips (e.g. `"📅 Send Demo Link"`, `"📄 Dispatch SOW Agreement"`).
* **5-Stage Reasoning Drawer**: Side-by-side transparency into raw payloads, BANT extractions, flow policy matching, and backend mutations.

### 4. Authentication (`/login` & `/signup`)
* **Login (`Login.jsx`)**: Branded access with password visibility toggles, session persistence, and a 1-click demo account auto-fill helper.
* **Signup (`Signup.jsx`)**: 14-day free workspace creation with a dynamic 3-tier password strength visualizer (`Weak`, `Good`, `Strong`).

---

## 4. Design System Compliance (Reliant Enterprise)

All UI elements strictly adhere to the tokens defined in [`DESIGN.md`](file:///c:/Users/Manve/Desktop/Pravaah/DESIGN.md):

| Design Token | Hex Code | Purpose / Application |
| :--- | :--- | :--- |
| **Surface (Canvas Base)** | `#f8f9ff` | Grounding background for pages and layouts |
| **Surface Container (Cards)** | `#ffffff` | Elevated cards, dialogs, and main panels |
| **Surface Container Low** | `#eff4ff` | Active nav items, stage tags, and selection pills |
| **Surface Container High** | `#dce9ff` | Subtle borders, hover highlights, and inputs |
| **Border Outline** | `#e5eeff` | Low-contrast borders defining structure |
| **Headings & Bold Text** | `#0b1c30` | High-contrast Deep Navy for authority and focus |
| **Body / Description Text** | `#45464d` | Slate text for clean, legible reading |
| **Muted Metadata** | `#76777d` | Timestamps, labels, and secondary hints |
| **Interactive Accent (CTA)** | `#0058be` / `#2170e4` | Primary action buttons, links, and active rings |
| **Strategic Highlight (Success)** | `#0c9488` / `#89f5e7` | BANT scores, verified checkmarks, and active telemetry |
| **Error / Destructive** | `#ba1a1a` on `#ffdad6` | Form validation and rejection notices |

---

## 5. Inbound Voice AI Architecture Roadmap

To expand Pravaah into automated telephony where an AI answers inbound calls from real customers:

```text
[ Customer Calls Business Number ]
                 │
                 ▼
      [ Telephony Gateway ]  (Twilio / Telnyx / LiveKit SIP)
                 │  (Live bi-directional WebSockets)
                 ▼
    [ Pravaah Voice Agent ]
  ┌───────────────────────────────────────────────────────────┐
  │ • Audio Ingestion: 8kHz PCM audio streaming               │
  │ • Realtime AI Model: Gemini Live / OpenAI Realtime API     │
  │ • Function Calling: Tool execution during live voice      │
  │ • Voice Synthesis: Human-like low-latency audio stream    │
  └───────────────────────────────────────────────────────────┘
                 │
                 ▼
  [ Pravaah 5-Stage Action Mutations ]
  ┌───────────────────────────────────────────────────────────┐
  │ • Qualify BANT score from spoken answers                  │
  │ • Lock slot on Google Calendar / Cal.com                  │
  │ • Dispatch SMS confirmation to caller's phone             │
  │ • Stream audio recording & transcript to Command Center   │
  └───────────────────────────────────────────────────────────┘
```

---

## 6. How to Run the Application

```bash
# 1. Navigate to client folder
cd c:\Users\Manve\Desktop\Pravaah\client

# 2. Start Vite development server
npm run dev

# 3. Open in your browser
http://localhost:5173/              # Landing Page
http://localhost:5173/dashboard     # Command Center
http://localhost:5173/dashboard/conversations # Conversations Hub

# 4. Production build test
npm run build
```

---

*Walkthrough document maintained for PRAVAAH Technologies, Inc.*
