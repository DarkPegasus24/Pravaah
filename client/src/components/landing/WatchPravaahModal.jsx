import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  Zap,
  Building2,
  FileText,
  UserCheck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Modal, Badge, Button } from '../ui';

const WALKTHROUGH_STEPS = [
  {
    step: 1,
    title: 'Customer Inquires via WhatsApp',
    badge: 'Customer Interaction',
    summary:
      'Sarah from Apex Dental Group sends a message: "Hi! We have 4 clinic locations and need 40 seats by next month. Budget is $25k-$30k ARR. Can we schedule a walkthrough?"',
    actor: 'Customer (Sarah Jenkins)',
    channel: 'WhatsApp Inbound',
    impact: 'Message captured in real-time, identity verified & thread initialized.',
  },
  {
    step: 2,
    title: 'Pravaah AI Extracts Business Context & Scores BANT',
    badge: 'Pravaah Intelligence',
    summary:
      'Pravaah AI parses the message context: Company (Apex Dental Group), Locations (4), Budget ($25k-$30k), Timeline (Next month), Need (40 seats). Computes BANT Score: 92/100.',
    actor: 'Pravaah AI Core',
    channel: 'Entity Extractor',
    impact: 'Lead created in CRM, status set to "AI Qualified", High-Priority tag attached.',
  },
  {
    step: 3,
    title: 'Autonomous Conflict-Free Calendar Scheduling',
    badge: 'Calendar Flow',
    summary:
      'Pravaah checks real-time calendar availability of the Senior Dental Enterprise Account Exec, offers optimal time slots, and reserves Thursday @ 2:00 PM EST with automated calendar invites.',
    actor: 'Pravaah Scheduler',
    channel: 'Google Calendar / Outlook Sync',
    impact: 'Meeting confirmed, Zoom link generated, and customer received SMS confirmation.',
  },
  {
    step: 4,
    title: 'AI Generates Account Briefing & Attached Service Proposal',
    badge: 'Document Intelligence',
    summary:
      'Pravaah synthesizes customer pain points into a 1-page Executive Briefing Document for the Account Exec, and attaches the tailored Enterprise Pricing Sheet.',
    actor: 'Pravaah Doc Engine',
    channel: 'Document Processor',
    impact: 'Executive brief linked to Lead profile and emailed to AE 2 hours before meeting.',
  },
  {
    step: 5,
    title: 'Continuous Follow-Up & Action Telemetry Recorded',
    badge: 'Flow Continuous Progression',
    summary:
      'Pravaah logs every single step into the Flow Activity audit trail, sets up automated SMS reminder 1 hour before call, and queues next milestone workflow.',
    actor: 'Pravaah Operations Core',
    channel: 'Command Center',
    impact: 'Business workflow moved from raw conversation to booked revenue without human delay.',
  },
];

export function WatchPravaahModal({ isOpen, onClose, onLaunchCommandCenter }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const step = WALKTHROUGH_STEPS[currentStepIndex];

  useEffect(() => {
    let timer;
    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % WALKTHROUGH_STEPS.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev - 1 + WALKTHROUGH_STEPS.length) % WALKTHROUGH_STEPS.length);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Watch Pravaah in Action: End-to-End Enterprise Flow"
      description="Interactive simulation of an autonomous business workflow from raw chat to revenue."
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6 font-sans">
        {/* Progress Stepper Bar */}
        <div className="grid grid-cols-5 gap-2">
          {WALKTHROUGH_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentStepIndex >= idx
                  ? 'bg-[#0058be]'
                  : 'bg-[#d8e2ff] hover:bg-[#adc6ff]'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Step Spotlight Box */}
        <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="accent" size="sm">
              Step {step.step} of 5: {step.badge}
            </Badge>
            <span className="text-xs font-mono text-[#0058be]">{step.channel}</span>
          </div>

          <h4 className="font-heading font-extrabold text-lg sm:text-xl text-[#0b1c30] tracking-tight">
            {step.title}
          </h4>

          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] text-xs sm:text-sm text-[#0b1c30] leading-relaxed shadow-xs">
            {step.summary}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e5eeff] text-xs">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#76777d] block">
                Primary Actor
              </span>
              <span className="font-semibold text-[#0b1c30]">{step.actor}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-[#76777d] block">
                Workflow Outcome
              </span>
              <span className="font-semibold text-[#0058be]">{step.impact}</span>
            </div>
          </div>
        </div>

        {/* Playback Controls & CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#004395] border border-[#d8e2ff] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}</span>
            </button>

            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0058be] transition-colors cursor-pointer border border-[#dce9ff]"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0058be] transition-colors cursor-pointer border border-[#dce9ff]"
              aria-label="Next step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="w-1/2 sm:w-auto"
            >
              Close
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                onClose();
                onLaunchCommandCenter();
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="w-1/2 sm:w-auto"
            >
              Open Live Command Center
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default WatchPravaahModal;
