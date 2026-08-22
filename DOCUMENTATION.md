# PRAVAAH — Complete Product, Architecture & Button Functionality Master Documentation

> **Official Tagline**: *From Customer Conversation to Business Action. Automatically.*  
> **Alternative Tagline**: *Where Business Workflows Flow Automatically.*  
> **Core Operating Philosophy**: *"Most AI assistants stop after answering. Pravaah continues until the business workflow moves forward to completion."*

---

## 1. Executive Summary & Brand Identity

**Pravaah** (representing *flow, movement, and continuous progression*) is an AI-powered B2B SaaS Business Operations Platform. It converts raw customer interactions across WhatsApp, Web Chat, SMS, and Email into completed business actions, qualified CRM opportunities, booked calendar meetings, and continuous workflows without requiring manual human data entry.

### The 5-Stage Continuous Flow Engine Architecture
```text
[1. INPUT] Customer Interaction (WhatsApp / Web Chat / SMS / Email / SOW / Invoice)
       ↓
[2. UNDERSTAND] Pravaah AI Context & Entity Extraction (BANT 0-100, Intent, Deal Size, Urgency)
       ↓
[3. DECIDE] Autonomous Flow Rule Determination & Validation (Enterprise Policy, SLA Router)
       ↓
[4. ACT] Business Tool & Mutation Execution (CRM Lead Created, Calendar Booked, SOW Dispatched)
       ↓
[5. CONTINUE] Next Business Workflow Begins Automatically (Meeting Prep Brief, Follow-up Queue, Stage Advance)
```

---

## 2. Standard Brand Terminology

| Traditional Concept | Pravaah Standard Terminology | Definition & Operational Meaning |
| :--- | :--- | :--- |
| **AI Chatbot / Assistant** | **Pravaah Agent** | Autonomous 24/7 omnichannel listener and executor. |
| **Automation Workflow** | **Flow** | Multi-stage autonomous process advancing customer intent to business completion. |
| **Workflow Pipeline** | **Business Flow** | End-to-end chained sequence of operational business tasks. |
| **Automation Rule** | **Flow Rule** | Business logic trigger, conditional criteria, and execution policies. |
| **Audit / Telemetry Log** | **Flow Activity** | Real-time, transparent audit trail of every autonomous decision and tool call. |
| **AI Action / Tool Call** | **Pravaah Action** | Individual backend mutation (e.g. Lead creation, Calendar booking, Document OCR). |
| **Lead History** | **Flow History** | Time-stamped history of interactions and automated advancements for a specific contact. |
| **Business Dashboard** | **Pravaah Command Center** | Central executive operational interface for telemetry, approvals, and metrics. |

---

## 3. Comprehensive Page-by-Page & Button Functionality Guide

---

### Page 1: Landing Page (`/`)
* **Route**: `/`
* **File Location**: `client/src/pages/Landing.jsx`
* **Target Audience**: Inbound B2B buyers, Founders, COOs, VPs of Sales, Operations Directors.

#### Section 1: Floating Glassmorphism Header
* **Brand Logo (`PravaahLogo`)**:
  * *Purpose*: Displays official glowing blue star mark, wordmark, and `"AI"` badge.
  * *Action*: Smoothly scrolls the viewport to the hero top (`#hero`).
* **Navigation Anchor Links (`Live Flow Demo`, `5-Stage Architecture`, `Operations Suite`, `Why Pravaah`)**:
  * *Purpose*: Fast jump navigation across landing sections.
  * *Action*: Smoothly scrolls the page to corresponding anchor IDs with browser URL history preservation.
* **`Command Center` Quick Link Button**:
  * *Purpose*: Provides direct instant access to the operations dashboard for existing operators.
  * *Action*: Navigates directly to `/dashboard`.
* **`Sign In` Button**:
  * *Purpose*: Authenticates existing workspace users.
  * *Action*: Navigates to `/login`.
* **`Start Your Flow` Button (Header CTA)**:
  * *Purpose*: Primary conversion driver for new accounts.
  * *Action*: Navigates to `/signup`.
* **Mobile Menu Hamburger Toggle Button (`<Menu />` / `<X />`)**:
  * *Purpose*: Opens/closes the responsive mobile navigation drawer.

#### Section 2: Hero Section
* **Mandatory Copy**:
  * **Headline**: `# Business Doesn’t Stop at Conversations.`
  * **Core Statement**: **Pravaah turns customer interactions into intelligent actions and continuous business workflows.**
  * **Subtext**: *Capture leads, qualify opportunities, schedule meetings, automate follow-ups, process documents, and uncover business insights from one intelligent operations platform.*
* **`Start Your Flow` Button (Primary Hero CTA)**:
  * *Purpose*: Main conversion action.
  * *Action*: Navigates user to `/signup` with free 14-day trial provisioning.
* **`Watch Pravaah in Action` Button (Secondary Hero CTA)**:
  * *Purpose*: Interactive visual proof for evaluators who want to see how the system works before signing up.
  * *Action*: Opens the interactive 5-step walkthrough modal (`WatchPravaahModal`).

#### Section 3: Interactive Live Flow Simulator (`InteractiveFlowHero.jsx`)
* **Scenario Selection Buttons**:
  * *Button 1 (`💼 Enterprise Inbound ($30k)`)*: Loads a sample high-value $30k enterprise inquiry.
  * *Button 2 (`🚨 Urgent SLA Escalation`)*: Loads a mission-critical payment outage escalation scenario.
  * *Button 3 (`📄 Contract SOW Execution`)*: Loads a signed MSA document processing scenario.
* **Custom Message Input Box**:
  * *Purpose*: Allows visitors to type their own real-world business scenarios.
* **`Simulate Flow` (Send Button)**:
  * *Purpose*: Fires the live simulation engine.
  * *Action*: Triggers the 5-stage animated reasoning stepper (`INPUT -> UNDERSTAND -> DECIDE -> ACT -> CONTINUE`), extracts entities, calculates BANT score, and displays output cards.
* **`Reset Simulation` (Rotate Button)**:
  * *Purpose*: Clears the active simulation and restores default state.
* **`Launch Command Center` Button**:
  * *Purpose*: Direct conversion link after seeing the simulation result.
  * *Action*: Navigates to `/dashboard`.

#### Section 4: 5-Stage Architecture Visualizer (`ArchitectureShowcase.jsx`)
* **Stage Stepper Selector Buttons (`01. INPUT`, `02. UNDERSTAND`, `03. DECIDE`, `04. ACT`, `05. CONTINUE`)**:
  * *Purpose*: Allows deep architectural inspection of each stage of Pravaah's pipeline.
  * *Action*: Dynamically switches the active spotlight card, capabilities bullet points, and live architecture blueprint diagram on the right.

#### Section 5: The 6 Pillars Operations Suite
* **Interactive Cards**:
  1. *Omnichannel Pravaah Agent* (WhatsApp, Web, SMS, Email ingestion).
  2. *AI Lead Scoring (BANT 0-100)* (Continuous qualification radar).
  3. *Conflict-Free Scheduler* (Autonomous booking & timezone mapping).
  4. *Flow Rules Engine* (Visual if-this-then-that operational logic).
  5. *Document Intelligence* (OCR & invoice/SOW contract extraction).
  6. *Pravaah Command Center* (Real-time velocity telemetry & human approvals).

#### Section 6: Paradigm Shift Comparison (`ComparisonSection.jsx`)
* **Comparison Cards**:
  * *Card 1 (Traditional AI Assistant)*: Explains the "Dead End" limitation where assistants stop after answering.
  * *Card 2 (Pravaah Autonomous Flow)*: Explains how Pravaah continues across CRM, calendars, documents, and follow-ups.
* **Capability Matrix**: Detailed line-by-line feature comparison.

#### Section 7: Interactive Guided Walkthrough Modal (`WatchPravaahModal.jsx`)
* **`Play / Pause` Button**: Starts/stops automated slide progression (advances every 4 seconds).
* **`Previous Step` / `Next Step` Arrow Buttons**: Manual step-by-step navigation.
* **Step Number Buttons (1 to 5)**: Instant jump to any specific stage of the workflow.
* **`Close Modal` (`<X />`) Button**: Exits modal and returns to page.
* **`Start 14-Day Free Trial` Button**: Navigates to `/signup`.

---

### Page 2: Pravaah Command Center (`/dashboard`)
* **Route**: `/dashboard`
* **File Location**: `client/src/pages/Dashboard.jsx`
* **Target Audience**: Business Owners, COOs, Revenue Executives, Operations Leads.

#### Key Elements & Button Actions:
* **System Status Indicator Pill (`● Continuous Flow Active`)**:
  * *Purpose*: Live pulsing visual confirmation that the background orchestration engine is listening and operational.
* **`Sync Telemetry` Button**:
  * *Purpose*: Re-polls live backend webhooks and recalculates telemetry velocity.
  * *Action*: Triggers a data sync animation and displays a toast notification (`"Refreshed live telemetry data."`).
* **`Open Conversations Engine` Button**:
  * *Purpose*: Quick transition from executive overview to live chat operations.
  * *Action*: Navigates to `/dashboard/conversations`.
* **5 Operational Velocity KPI Cards**:
  1. *Flow Execution Velocity (`99.4%`)* — 1,482 actions automated with zero drop-off.
  2. *AI Qualified Leads (`412`)* — $1.84M in qualified pipeline with 88.5 avg BANT score.
  3. *Meetings Booked (`89`)* — Conflict-free autonomous calendar scheduling.
  4. *Documents Processed (`164`)* — OCR extracted contracts and stage syncing.
  5. *Operations Hours Saved (`142.5h`)* — $18.4k estimated monthly labor ROI.
* **Real-Time 5-Stage Pipeline Monitor**:
  * *Purpose*: Live visualization showing throughput across `01. INGEST` → `02. UNDERSTAND` → `03. DECIDE` → `04. ACT` → `05. CONTINUE`.
* **Human-in-the-Loop Approval Cards (`Approve & Execute` / `Dismiss`)**:
  * *Card 1*: Approve $45k Enterprise Agreement Dispatch (Apex Dental Group).
  * *Card 2*: Approve Calendar Slot Reassignment (Nexus Global Health).
  * *Card 3*: Approve Urgent SLA Escalation (Quantum Health Care).
  * *`Approve & Execute` Button Action*: Immediately marks the item as `"Approved & Executed"`, updates status badge to green, and triggers a success toast (`"Flow Action Approved & Executed Autonomously!"`).
  * *`Dismiss` Button Action*: Skips the queue item and displays feedback toast.
* **Omnichannel Telemetry Table & Filters**:
  * *Channel Filter Buttons (`All`, `WhatsApp`, `Web Chat`, `SMS Inbound`, `Email Inbound`)*: Instant client-side filtering of live interaction events.
  * *`Inspect Flow` Button (for each row)*: Opens the detailed Telemetry Audit Modal for that interaction.
* **Telemetry Inspection Modal Buttons**:
  * *`Close Audit` Button*: Closes the modal.
  * *`View in Conversations Hub` Button*: Closes modal and navigates directly to the matching thread in `/dashboard/conversations`.

---

### Page 3: Dashboard Layout Shell (`DashboardLayout.jsx`)
* **File Location**: `client/src/layouts/DashboardLayout.jsx`
* **Target Audience**: All logged-in dashboard users.

#### Top Navigation Bar & Sidebar Buttons:
* **`PravaahLogo` Link (Sidebar Header)**:
  * *Action*: Navigates to `/dashboard`.
* **Navigation Links**:
  * *`Overview` NavLink*: Navigates to `/dashboard` (active styling: Deep Navy background `#0b1c30` with white icon).
  * *`Conversations` NavLink*: Navigates to `/dashboard/conversations`.
* **Business Selector Pill (`Demo Operations HQ`)**:
  * *Purpose*: Displays active workspace tenant and tier (`Live Hub`).
* **Autopilot Status Badge (`● Autopilot Active`)**:
  * *Purpose*: Real-time pulsating teal badge showing 24/7 automated listener status.
* **Notifications Bell Button (`<Bell />`)**:
  * *Purpose*: Toggles the slide-out Telemetry Alerts dropdown.
  * *`Mark all read` Button (inside dropdown)*: Clears the unread badge counter to 0.
* **User Profile Avatar Button (`A`)**:
  * *Purpose*: Toggles the User Profile menu displaying name, role (`Operations Admin`), and email (`admin@pravaah.ai`).
  * *`Sign Out` Button (inside menu)*: Clears user session and navigates to `/login`.
* **Mobile Drawer Hamburger & Bottom Navigation Bar**:
  * *Purpose*: Provides navigation on mobile and tablet devices.

---

### Page 4: Conversations Hub (`/dashboard/conversations`)
* **Route**: `/dashboard/conversations`
* **File Location**: `client/src/pages/Conversations.jsx`
* **Target Audience**: Sales Development Reps, Account Executives, Support Specialists.

#### Key Elements & Button Actions:
* **Search Input Field**:
  * *Purpose*: Filters customer threads in real-time by customer name, company, or message snippet.
* **Status Filter Tabs (`All`, `Active`, `Qualified`, `Booked`)**:
  * *Purpose*: Filters conversations by current lifecycle stage.
* **Conversation List Thread Items**:
  * *Action*: Clicking any conversation item selects it, marks unread messages as read, and loads the active message history into the chat viewport.
* **`AI Autopilot Mode` Toggle Switch**:
  * *Purpose*: Switches between full autonomous flow execution and manual agent takeover.
* **Message Input Box & `Send` Button (`<Send />`)**:
  * *Action*: Dispatches manual message from the operator into the conversation stream.
* **Attachment Button (`<Paperclip />`)**:
  * *Action*: Prompts file upload for sending contracts, brochures, or diagnostic reports.
* **AI Quick Suggestion Chips**:
  * *Buttons* (e.g. `"📅 Propose Demo Slot"`, `"📄 Send Enterprise SOW"`, `"✅ Qualify Lead"`):
  * *Action*: Inserts formatted context-aware responses or triggers immediate business actions into the active thread.
* **5-Stage AI Reasoning Inspector Drawer**:
  * *Purpose*: Displays live step-by-step transparency into why Pravaah took a specific action:
    * *Step 1*: Raw Inbound Message Payload
    * *Step 2*: Extracted Entities (Budget, Authority, Need, Timeline)
    * *Step 3*: Flow Policy Match
    * *Step 4*: Backend Execution Status (CRM mutations, Google Calendar event IDs)
    * *Step 5*: Chained Downstream Flow

---

### Page 5: Authentication Pages (`/login` & `/signup`)

#### Login Page (`/login`) — `client/src/pages/Login.jsx`
* **`PravaahLogo` Link (Header)**: Navigates back to the landing page (`/`).
* **`Create an account` Link**: Navigates to `/signup`.
* **`Show / Hide Password` Toggle Button (`<Eye />` / `<EyeOff />`)**: Toggles password input visibility between plaintext and masked bullets.
* **`Remember this browser` Checkbox**: Toggles persistent session caching.
* **`Forgot password?` Link**: Displays alert dialog with password reset flow.
* **`Sign in to Workspace` Button (Submit CTA)**:
  * *Action*: Validates email format and password length, sets loading spinner, and redirects authenticated user to `/dashboard`.
* **`Auto-Fill Demo Admin Account` Helper Button**:
  * *Purpose*: One-click developer/evaluator shortcut that fills the form with `admin@pravaah.ai` and demo credentials.

#### Signup Page (`/signup`) — `client/src/pages/Signup.jsx`
* **`PravaahLogo` Link (Header)**: Navigates back to landing page (`/`).
* **`Sign in` Link**: Navigates to `/login`.
* **Form Inputs**: Business Name, Owner Name, Business Email, Phone Number, Password.
* **Interactive Password Strength Meter**:
  * *Purpose*: Dynamically evaluates length, special characters, uppercase, and digits, rendering a 3-tier progress bar (`Weak` #76777d, `Good` #0058be, `Strong` #0c9488).
* **`Terms of Service & Privacy Policy` Checkbox**: Enforces compliance before submission.
* **`Create Free Workspace` Button (Submit CTA)**:
  * *Action*: Validates all required fields, provisions trial workspace in state, and directs user to `/dashboard`.

---

## 4. UI Design System Tokens & Color Compliance

All components and pages strictly follow the **Reliant Enterprise** design system ([`DESIGN.md`](file:///c:/Users/Manve/Desktop/Pravaah/DESIGN.md)):

```yaml
Base Colors:
  Surface (Base Canvas): '#f8f9ff'
  Surface Containers (Cards): '#ffffff'
  Surface Low (Active Pills): '#eff4ff'
  Surface High (Borders/Accents): '#dce9ff'
  Borders: '#e5eeff'

Typography & Text:
  Headings & Primary Text: '#0b1c30' (Deep Navy / Charcoal)
  Body & Secondary Text: '#45464d' (Refined Slate)
  Muted / Meta Text: '#76777d' (Cool Gray)

Brand Accents & Feedback:
  Primary Brand: '#000000' / '#0b1c30'
  Interactive Accent (Buttons/Links/Active): '#0058be' / '#2170e4'
  Strategic Highlight / Success (BANT/Pills): '#0c9488' / '#89f5e7'
  Error / Destructive: '#ba1a1a' on '#ffdad6'
```

### Elevation & Shadows
* **Level 0 (Canvas Base)**: `#f8f9ff`
* **Level 1 (Card Default)**: `#ffffff` with border `#e5eeff` and shadow `0 1px 3px rgba(11, 28, 48, 0.05)`.
* **Level 2 (Interactive Hover)**: border `#0058be` and shadow `0 10px 20px -3px rgba(0, 88, 190, 0.08)`.
* **Level 3 (Modal / Overlays)**: `bg-black/60` with `backdrop-blur-md` and shadow `0 25px 50px -12px rgba(11, 28, 48, 0.25)`.

### Smooth Scrolling
* Global `scroll-behavior: smooth` enabled across all viewport elements in `index.css`.
* Automated `ScrollToTop` helper registered in `App.jsx` ensuring smooth zero-jump route transitions.

---

## 5. Development & Execution Instructions

### Starting the Frontend Application
```bash
cd c:\Users\Manve\Desktop\Pravaah\client
npm run dev
```
* **Localhost URL**: `http://localhost:5173/`
* **Command Center URL**: `http://localhost:5173/dashboard`
* **Conversations Hub URL**: `http://localhost:5173/dashboard/conversations`

### Running Production Bundle Validation
```bash
cd c:\Users\Manve\Desktop\Pravaah\client
npm run build
```
*(Build executes in ~500ms with 0 compilation errors).*

---

*Master Documentation maintained for PRAVAAH Technologies, Inc.*
