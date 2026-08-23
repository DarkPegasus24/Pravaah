import React, { useState } from 'react';
import {
  MessageSquare,
  Brain,
  GitFork,
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  Database,
  Calendar,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { Badge, Card } from '../ui';

const STAGES = [
  {
    number: '01',
    name: 'INPUT',
    title: 'Multi-Channel Interaction Ingestion',
    subtitle: 'Customer interacts across any business touchpoint',
    icon: <MessageSquare className="w-5 h-5 text-black" />,
    summary:
      'Pravaah unifies inputs from WhatsApp, Web Chat, Email, SMS, or inbound portal forms into a standardized context stream.',
    highlights: [
      'Omnichannel webhook listeners',
      'Attachment & document stream ingestion',
      'Real-time conversation thread mapping',
    ],
    badge: 'Multi-Channel',
  },
  {
    number: '02',
    name: 'UNDERSTAND',
    title: 'Pravaah AI Context & Entity Extraction',
    subtitle: 'Deep business understanding, not keyword matching',
    icon: <Brain className="w-5 h-5 text-black" />,
    summary:
      'Pravaah extracts business parameters: Budget, Timeline, Authority, Company Size, Sentiment, SLA urgency, and specific service needs.',
    highlights: [
      'BANT (Budget, Authority, Need, Timeline) scoring',
      'Entity extraction (Email, Phone, Org, Terms)',
      'Intent & urgency classification (0-100 score)',
    ],
    badge: 'AI Core',
  },
  {
    number: '03',
    name: 'DECIDE',
    title: 'Autonomous Flow Rule Determination',
    subtitle: 'Determines the exact business workflow required',
    icon: <GitFork className="w-5 h-5 text-black" />,
    summary:
      'Pravaah evaluates active Business Flow Rules, applies business logic thresholds, and routes the interaction to the optimal automation pipeline.',
    highlights: [
      'Custom configurable Flow Rules',
      'Human-in-the-loop approval thresholds',
      'Multi-branch condition routing',
    ],
    badge: 'Rule Engine',
  },
  {
    number: '04',
    name: 'ACT',
    title: 'Business Tool & Backend Mutation Execution',
    subtitle: 'Executes actual business work across systems',
    icon: <Zap className="w-5 h-5 text-black" />,
    summary:
      'Rather than just typing a reply, Pravaah executes real mutations: creates qualified leads, generates calendar invites, and parses documents.',
    highlights: [
      'Automated CRM Lead creation & BANT scoring',
      'Zero-friction calendar slot booking & invite dispatch',
      'Document parsing & invoice metadata extraction',
    ],
    badge: 'Tool Execution',
  },
  {
    number: '05',
    name: 'CONTINUE',
    title: 'Continuous Business Workflow Progression',
    subtitle: 'The next workflow stage begins automatically',
    icon: <RefreshCw className="w-5 h-5 text-black" />,
    summary:
      'Workflows do not end at the initial action. Pravaah automatically triggers the next chained phase: meeting prep docs, follow-up queues, or executive alerts.',
    highlights: [
      'Automated meeting prep briefing generation',
      'Intelligent no-show re-engagement triggers',
      'Cross-system pipeline progression',
    ],
    badge: 'Continuous Flow',
  },
];

export function ArchitectureShowcase() {
  const [activeStageIndex, setActiveStageIndex] = useState(1);
  const currentStage = STAGES[activeStageIndex];

  return (
    <section className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="secondary" dot size="sm" className="mb-3 border-[#d8e2ff]">
            The 5-Stage Pravaah Lifecycle
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
            How Pravaah Moves Business Forward
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#45464d] leading-relaxed">
            Every customer interaction follows a continuous, transparent 5-stage pipeline from raw message to completed business action.
          </p>
        </div>

        {/* 5-Stage Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {STAGES.map((stg, idx) => {
            const isSelected = activeStageIndex === idx;
            return (
              <button
                key={stg.name}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#0058be] text-white border-[#0058be] shadow-[0_10px_20px_-3px_rgba(0,88,190,0.25)] scale-[1.02]'
                    : 'bg-white text-[#0b1c30] border-[#dce9ff] hover:border-[#0058be] hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-[#d8e2ff]' : 'text-[#76777d]'
                    }`}
                  >
                    {stg.number}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-white/15 text-white' : 'bg-[#eff4ff] text-[#0058be]'
                    }`}
                  >
                    {stg.icon}
                  </div>
                </div>

                <div>
                  <div
                    className={`font-heading font-bold text-sm tracking-tight ${
                      isSelected ? 'text-white' : 'text-[#0b1c30]'
                    }`}
                  >
                    {stg.name}
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-[#d8e2ff]' : 'text-[#45464d]'
                    }`}
                  >
                    {stg.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#e5eeff] shadow-[0_4px_12px_rgba(11,28,48,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  Stage {currentStage.number}: {currentStage.name}
                </Badge>
                <Badge variant="secondary" size="sm">
                  {currentStage.badge}
                </Badge>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                {currentStage.title}
              </h3>

              <p className="text-sm sm:text-base text-[#45464d] leading-relaxed font-sans">
                {currentStage.summary}
              </p>

              <div className="mt-2 flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
                  Key Capabilities in this Stage:
                </span>
                {currentStage.highlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#0b1c30]">
                    <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Architecture Diagram Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#0b1c30] rounded-2xl p-6 text-white border border-[#131b2e] shadow-xl flex flex-col gap-4 font-sans">
              <div className="flex items-center justify-between border-b border-[#213145] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2170e4]" />
                  <span className="font-heading font-semibold text-xs text-white">
                    Pravaah Architecture Flow
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#adc6ff]">
                  STAGE_{currentStage.name}
                </span>
              </div>

              {/* Architecture Blueprint Tree */}
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStageIndex === 0
                      ? 'bg-[#0058be] text-white border-[#2170e4] font-bold shadow-sm'
                      : 'bg-[#131b2e] text-[#adc6ff] border-[#213145]'
                  }`}
                >
                  1. CUSTOMER INTERACTION (Omnichannel)
                </div>
                <div className="text-center text-[#7c839b] text-[10px]">↓</div>
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStageIndex === 1
                      ? 'bg-[#0058be] text-white border-[#2170e4] font-bold shadow-sm'
                      : 'bg-[#131b2e] text-[#adc6ff] border-[#213145]'
                  }`}
                >
                  2. PRAVAAH AI CORE (Understand & Extract)
                </div>
                <div className="text-center text-[#7c839b] text-[10px]">↓</div>
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStageIndex === 2
                      ? 'bg-[#0058be] text-white border-[#2170e4] font-bold shadow-sm'
                      : 'bg-[#131b2e] text-[#adc6ff] border-[#213145]'
                  }`}
                >
                  3. BUSINESS FLOW ENGINE (Decide & Validate)
                </div>
                <div className="text-center text-[#7c839b] text-[10px]">↓</div>
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStageIndex === 3
                      ? 'bg-[#0058be] text-white border-[#2170e4] font-bold shadow-sm'
                      : 'bg-[#131b2e] text-[#adc6ff] border-[#213145]'
                  }`}
                >
                  4. BUSINESS TOOLS (Leads / Calendar / Docs)
                </div>
                <div className="text-center text-[#7c839b] text-[10px]">↓</div>
                <div
                  className={`p-2.5 rounded-lg border transition-all ${
                    activeStageIndex === 4
                      ? 'bg-[#0058be] text-white border-[#2170e4] font-bold shadow-sm'
                      : 'bg-[#131b2e] text-[#adc6ff] border-[#213145]'
                  }`}
                >
                  5. CONTINUOUS FLOW (Follow-ups & Telemetry)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureShowcase;
