import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ArrowRight,
  Bot,
  User,
  CheckCircle2,
  Calendar,
  Zap,
  Building2,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCheck,
} from 'lucide-react';
import { Badge, Button } from '../ui';

const PRESET_SCENARIOS = [
  {
    id: 'enterprise',
    label: '💼 Enterprise Inbound ($30k)',
    prompt:
      'Hi! We are looking for a 50-seat enterprise plan for Apex Health by next month. Our budget is around $30,000. Can we book a demo for this Thursday at 2 PM?',
    channel: 'Web Chat',
    extracted: {
      company: 'Apex Health',
      seats: '50 seats',
      budget: '$30,000',
      timeline: 'Next month',
      intent: 'Demo Request & Purchase',
      urgency: 'High (BANT 94/100)',
    },
    flowRule: 'Enterprise Inbound Auto-Pilot',
    actions: [
      'Created & Qualified Lead: Apex Health (Score: 94/100)',
      'Scheduled Demo: Thursday @ 2:00 PM EST with Senior AE',
      'Generated AI Meeting Prep Brief with BANT Breakdown',
      'Dispatched Slack Alert to #enterprise-deals',
    ],
    nextFlow: 'Auto-send Calendar Invite + Prep Document',
  },
  {
    id: 'sla',
    label: '🚨 Urgent SLA Escalation',
    prompt:
      'Emergency: Our production payment webhook is returning 500 errors on Account #A-992. We are losing checkout transactions right now!',
    channel: 'WhatsApp',
    extracted: {
      company: 'Account #A-992 (Tier 1)',
      issue: 'Payment Webhook 500 Outage',
      urgency: 'Critical SLA (15 min response)',
      intent: 'Urgent Support Escalation',
    },
    flowRule: 'High-Priority SLA Escalation Flow',
    actions: [
      'Detected Critical Sentiment & Urgent SLA Trigger',
      'Created Priority Incident Ticket #INC-4092',
      'Page-duty alert dispatched to On-Call Tech Lead',
      'Sent reassurance SMS to customer with Live Incident URL',
    ],
    nextFlow: 'Auto-monitor webhook health + Escalate to VP if unresolved in 20m',
  },
  {
    id: 'contract',
    label: '📄 Contract Document Processing',
    prompt:
      'Hi Pravaah, please find our signed Master Services Agreement (MSA) attached for the Q3 expansion ($45,000 value). Let us know when onboarding starts.',
    channel: 'Email',
    extracted: {
      company: 'Nexus Global',
      document: 'Signed_MSA_Q3_Expansion.pdf',
      contractValue: '$45,000 ARR',
      paymentTerms: 'Net 30',
      intent: 'Contract Execution & Onboarding',
    },
    flowRule: 'Document-Driven Deal Accelerator',
    actions: [
      'Extracted MSA Metadata: $45,000 ARR, Net 30 Terms, 1-yr term',
      'Updated Lead stage from Proposal Sent to Closed-Won',
      'Generated Onboarding Kickoff Workspace & Welcome Email',
      'Queued Finance Invoice Approval in Command Center',
    ],
    nextFlow: 'Trigger Client Onboarding Sequence + Schedule Kickoff Call',
  },
];

export function InteractiveFlowHero({ onExplorePlatform }) {
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0]);
  const [inputVal, setInputVal] = useState(PRESET_SCENARIOS[0].prompt);
  const [currentStep, setCurrentStep] = useState(5); // 1 to 5
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'diff'

  const runSimulation = (scenario) => {
    setIsSimulating(true);
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 600);
    setTimeout(() => setCurrentStep(3), 1300);
    setTimeout(() => setCurrentStep(4), 2100);
    setTimeout(() => {
      setCurrentStep(5);
      setIsSimulating(false);
    }, 2900);
  };

  const handleSelectScenario = (sc) => {
    setSelectedScenario(sc);
    setInputVal(sc.prompt);
    runSimulation(sc);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    runSimulation(selectedScenario);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-[#dce9ff] via-[#eff4ff] to-[#dce9ff] border border-[#dce9ff] shadow-[0_20px_40px_-15px_rgba(0,88,190,0.12)] overflow-hidden font-sans">
      <div className="rounded-[22px] bg-white border border-[#e5eeff] overflow-hidden">
        {/* Top Live Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0b1c30] text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#131b2e]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c9488] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0c9488]" />
            </span>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Pravaah Autonomous Flow Engine
            </span>
            <span className="text-[11px] text-[#adc6ff] hidden sm:inline">
              • Real-Time Interactive Simulator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="sm" className="bg-[#131b2e] text-[#adc6ff] border-[#213145] text-[10px]">
              Active Autopilot
            </Badge>
            <button
              onClick={() => runSimulation(selectedScenario)}
              disabled={isSimulating}
              className="px-2.5 py-1 rounded-lg bg-white text-[#0b1c30] hover:bg-[#eff4ff] hover:text-[#0058be] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Re-run Simulation"
            >
              <RotateCcw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Replay</span>
            </button>
          </div>
        </div>

        {/* Preset Prompt Scenario Pills */}
        <div className="p-4 sm:px-6 bg-[#f8f9ff] border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0b1c30] shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#0058be]" />
            <span>Select Customer Scenario:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {PRESET_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedScenario.id === sc.id
                    ? 'bg-[#0058be] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#45464d] hover:text-[#0058be] hover:bg-[#eff4ff] border border-[#dce9ff]'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Chat Input & Live Stepper Grid */}
        <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
          {/* LEFT: Customer Interaction Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#45464d] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0058be]" />
                Step 1: Customer Input
              </span>
              <Badge variant="secondary" size="sm" className="text-[10px]">
                Channel: {selectedScenario.channel}
              </Badge>
            </div>

            {/* Chat bubble card */}
            <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] flex flex-col gap-3 relative shadow-xs">
              <div className="flex items-center justify-between text-[11px] text-[#45464d] border-b border-[#e5eeff] pb-2">
                <div className="flex items-center gap-1.5 font-semibold text-[#0b1c30]">
                  <div className="w-5 h-5 rounded-full bg-[#0058be] text-white flex items-center justify-center text-[10px] font-bold">
                    C
                  </div>
                  <span>Inbound Customer Message</span>
                </div>
                <span>Just now</span>
              </div>

              <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed font-sans">
                "{inputVal}"
              </p>

              {/* Editable Input Box for custom prompt */}
              <form onSubmit={handleCustomSubmit} className="mt-2 pt-2 border-t border-[#e5eeff] flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Or type a custom customer message..."
                  className="flex-1 bg-white text-[#0b1c30] text-xs px-3 py-2 rounded-xl border border-[#dce9ff] focus:border-[#0058be] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSimulating || !inputVal.trim()}
                  className="px-3 py-2 bg-[#0058be] text-white hover:bg-[#2170e4] text-xs font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
                  title="Submit message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Traditional AI vs Pravaah Tag */}
            <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#004395] mb-1">
                <Bot className="w-3.5 h-3.5 text-[#0058be]" />
                <span>Why Pravaah is Different:</span>
              </div>
              <p className="text-[11px] text-[#45464d] leading-snug">
                Traditional bots send a plain text reply and stop. <strong className="text-[#0b1c30] font-semibold">Pravaah autonomously parses the intent, creates the lead, books the calendar slot, and triggers downstream workflows.</strong>
              </p>
            </div>
          </div>

          {/* RIGHT: 5-Stage Continuous Flow Pipeline (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-black" />
                Pravaah Continuous Flow Execution
              </span>
              <span className="text-xs font-mono text-neutral-500">
                Stage {currentStep} of 5
              </span>
            </div>

            {/* 5-Step Flow Stepper Track */}
            <div className="flex flex-col gap-2.5">
              {/* STAGE 1: INPUT */}
              <div
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  currentStep >= 1
                    ? 'bg-white border-[#dce9ff] shadow-xs'
                    : 'bg-[#f8f9ff]/50 border-[#e5eeff] opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    currentStep >= 1
                      ? 'bg-[#0058be] text-white'
                      : 'bg-[#dce9ff] text-[#76777d]'
                  }`}
                >
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#0b1c30]">
                      INPUT: Ingest Interaction
                    </span>
                    {currentStep >= 1 && (
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        Ingested
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-0.5">
                    Customer message received via {selectedScenario.channel}
                  </p>
                </div>
              </div>

              {/* STAGE 2: UNDERSTAND */}
              <div
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  currentStep >= 2
                    ? 'bg-white border-[#dce9ff] shadow-xs'
                    : 'bg-[#f8f9ff]/50 border-[#e5eeff] opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    currentStep >= 2
                      ? 'bg-[#0058be] text-white'
                      : 'bg-[#dce9ff] text-[#76777d]'
                  }`}
                >
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#0b1c30]">
                      UNDERSTAND: AI Context & Entity Extraction
                    </span>
                    {currentStep >= 2 && (
                      <Badge variant="accent" size="sm" className="text-[10px]">
                        Context Parsed
                      </Badge>
                    )}
                  </div>
                  {currentStep >= 2 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(selectedScenario.extracted).map(([key, val]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 rounded-md bg-[#eff4ff] border border-[#d8e2ff] text-[10px] font-mono text-[#004395]"
                        >
                          <strong className="text-[#0b1c30] capitalize">{key}:</strong> {val}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#45464d] mt-0.5">
                      Extracting entities, BANT parameters, intent, and sentiment...
                    </p>
                  )}
                </div>
              </div>

              {/* STAGE 3: DECIDE */}
              <div
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  currentStep >= 3
                    ? 'bg-white border-[#dce9ff] shadow-xs'
                    : 'bg-[#f8f9ff]/50 border-[#e5eeff] opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    currentStep >= 3
                      ? 'bg-[#0058be] text-white'
                      : 'bg-[#dce9ff] text-[#76777d]'
                  }`}
                >
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#0b1c30]">
                      DECIDE: Select Workflow Rule
                    </span>
                    {currentStep >= 3 && (
                      <Badge variant="accent" size="sm" className="text-[10px]">
                        Flow Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-0.5">
                    Triggered Business Flow Rule:{' '}
                    <strong className="text-[#0058be] font-semibold font-mono">
                      "{selectedScenario.flowRule}"
                    </strong>
                  </p>
                </div>
              </div>

              {/* STAGE 4: ACT */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  currentStep >= 4
                    ? 'bg-[#f8f9ff] border-[#0058be] shadow-sm'
                    : 'bg-[#f8f9ff]/50 border-[#e5eeff] opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    currentStep >= 4
                      ? 'bg-[#0c9488] text-white'
                      : 'bg-[#dce9ff] text-[#76777d]'
                  }`}
                >
                  4
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#0b1c30]">
                      ACT: Execute Business Actions
                    </span>
                    {currentStep >= 4 && (
                      <Badge variant="success" dot size="sm" className="text-[10px]">
                        Actions Executed
                      </Badge>
                    )}
                  </div>
                  {currentStep >= 4 ? (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {selectedScenario.actions.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-xs text-[#0b1c30] font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488] shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#45464d] mt-0.5">
                      Executing automated backend mutations across CRM, calendar, and alerts...
                    </p>
                  )}
                </div>
              </div>

              {/* STAGE 5: CONTINUE */}
              <div
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  currentStep >= 5
                    ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-md'
                    : 'bg-[#f8f9ff]/50 border-[#e5eeff] opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    currentStep >= 5
                      ? 'bg-[#89f5e7] text-[#00201d]'
                      : 'bg-[#dce9ff] text-[#76777d]'
                  }`}
                >
                  5
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-heading font-bold text-xs ${
                        currentStep >= 5 ? 'text-white' : 'text-[#0b1c30]'
                      }`}
                    >
                      CONTINUE: Next Business Workflow Begins
                    </span>
                    {currentStep >= 5 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#89f5e7] text-[#00201d]">
                        Continuous Flow
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      currentStep >= 5 ? 'text-[#adc6ff]' : 'text-[#45464d]'
                    }`}
                  >
                    {selectedScenario.nextFlow}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA footer inside the interactive frame */}
        <div className="px-6 py-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#45464d]">
            <CheckCheck className="w-4 h-4 text-[#0058be]" />
            <span>
              All actions logged transparently in <strong className="text-[#0b1c30]">Flow Activity</strong> with full telemetry audit trail.
            </span>
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={onExplorePlatform}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto"
          >
            Open Command Center & Test Live
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InteractiveFlowHero;
