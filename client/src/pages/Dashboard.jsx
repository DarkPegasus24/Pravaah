import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Zap,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  CheckCheck,
  UserCheck,
  Building2,
  Layers,
  Bot,
  Send,
  Sliders,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Modal,
} from '../components/ui';

export default function Dashboard() {
  const navigate = useNavigate();

  // Active channel filter
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Interactive Approval Queue State
  const [approvals, setApprovals] = useState([
    {
      id: 'appr-1',
      title: 'Approve $45,000 Enterprise Agreement Dispatch',
      company: 'Apex Dental Group',
      contact: 'Sarah Jenkins (Owner)',
      channel: 'WhatsApp',
      amount: '$45,000 ARR',
      bantScore: 94,
      flowRule: 'Enterprise Inbound Flow ($30k+)',
      actionText: 'Generate 50-Seat Service Agreement & Email to Sarah',
      status: 'pending',
      time: '2 mins ago',
    },
    {
      id: 'appr-2',
      title: 'Approve Calendar Slot Reassignment',
      company: 'Nexus Global Health',
      contact: 'Dr. Michael Chang',
      channel: 'Web Chat',
      amount: '$18,500 ARR',
      bantScore: 89,
      flowRule: 'Conflict-Free Scheduler Rule',
      actionText: 'Move Demo Call to Thursday @ 3:00 PM EST & Alert AE',
      status: 'pending',
      time: '14 mins ago',
    },
    {
      id: 'appr-3',
      title: 'Approve Urgent SLA Escalation Flow',
      company: 'Quantum Health Care',
      contact: 'David Ross (VP Ops)',
      channel: 'SMS Inbound',
      amount: '$60,000 ARR',
      bantScore: 98,
      flowRule: 'Urgent SLA Escalation (< 15 min)',
      actionText: 'Dispatch SMS to On-Call Exec & Lock Priority Slot',
      status: 'pending',
      time: '28 mins ago',
    },
  ]);

  // Telemetry Inspect Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectedActivity, setInspectedActivity] = useState(null);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
    showToast('Flow Action Approved & Executed Autonomously!');
  };

  // 5 KPI Metrics matching DESIGN.md tokens
  const stats = [
    {
      title: 'Flow Execution Velocity',
      value: '99.4%',
      change: '+4.8%',
      period: '1,482 actions automated',
      icon: <Zap className="w-5 h-5 text-[#0058be]" />,
      badge: 'Active Engine',
      badgeVariant: 'success',
    },
    {
      title: 'AI Qualified Leads (BANT)',
      value: '412',
      change: '$1.84M',
      period: 'pipeline generated (88 avg BANT)',
      icon: <Sparkles className="w-5 h-5 text-[#0058be]" />,
      badge: 'High Intent',
      badgeVariant: 'accent',
    },
    {
      title: 'Meetings Booked',
      value: '89',
      change: '+24%',
      period: '0 scheduling conflicts',
      icon: <Calendar className="w-5 h-5 text-[#0058be]" />,
      badge: '24/7 Autopilot',
      badgeVariant: 'secondary',
    },
    {
      title: 'Documents Processed',
      value: '164',
      change: '100%',
      period: 'OCR & metadata synced to CRM',
      icon: <FileText className="w-5 h-5 text-[#0058be]" />,
      badge: 'Verified',
      badgeVariant: 'info',
    },
    {
      title: 'Operations Hours Saved',
      value: '142.5h',
      change: '+$18.4k',
      period: 'estimated monthly value created',
      icon: <Clock className="w-5 h-5 text-[#0058be]" />,
      badge: 'ROI Accelerate',
      badgeVariant: 'success',
    },
  ];

  // Recent Live Activity Stream
  const activityFeed = [
    {
      id: 'act-1',
      customer: 'Sarah Jenkins',
      company: 'Apex Dental Group',
      channel: 'WhatsApp',
      message: 'Hi! We need 40 seats by next month, budget is around $30k ARR.',
      extracted: '40 seats, $30,000 ARR, Next Month',
      bantScore: 94,
      flowRule: 'Enterprise Inbound ($30k+)',
      actionResult: 'Lead #412 Created & Demo Booked for Thu @ 2 PM',
      time: 'Just now',
      status: 'Completed',
    },
    {
      id: 'act-2',
      customer: 'Dr. Michael Chang',
      company: 'Nexus Global Health',
      channel: 'Web Chat',
      message: 'Can we reschedule our onboarding review to Friday morning?',
      extracted: 'Reschedule, Friday Morning, Onboarding Review',
      bantScore: 89,
      flowRule: 'Calendar Slot Optimizer',
      actionResult: 'Rescheduled to Fri 10:30 AM & Sent Calendar Update',
      time: '8 mins ago',
      status: 'Completed',
    },
    {
      id: 'act-3',
      customer: 'Elena Rostova',
      company: 'Metropolis Diagnostics',
      channel: 'Email Inbound',
      message: 'Signed service proposal attached. Please trigger vendor setup.',
      extracted: 'Signed SOW #SOW-9821, $24,000/yr',
      bantScore: 96,
      flowRule: 'Document Intelligence Pipeline',
      actionResult: 'Deal advanced to Closed-Won & Invoice Dispatched',
      time: '22 mins ago',
      status: 'Completed',
    },
    {
      id: 'act-4',
      customer: 'David Ross',
      company: 'Quantum Health Care',
      channel: 'SMS Inbound',
      message: 'Urgent: clinic expansion requires 25 additional provider seats.',
      extracted: 'Urgent, 25 seats, Expansion',
      bantScore: 92,
      flowRule: 'Urgent SLA Escalation (< 15 min)',
      actionResult: 'Assigned Priority AE & Dispatched Fast-Track Link',
      time: '45 mins ago',
      status: 'Completed',
    },
  ];

  const filteredFeed =
    selectedChannel === 'all'
      ? activityFeed
      : activityFeed.filter(
          (item) => item.channel.toLowerCase() === selectedChannel.toLowerCase()
        );

  const handleInspect = (item) => {
    setInspectedActivity(item);
    setInspectModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0b1c30] text-white border border-[#2170e4] shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#0c9488]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Executive Operations Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e5eeff]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Operational Command Center
            </h1>
            <Badge variant="success" dot pulse size="sm">
              Continuous Flow Active
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#45464d] leading-relaxed">
            Autonomous multi-channel interaction orchestration, real-time BANT qualification, and workflow execution.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Refreshed live telemetry data.')}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs font-semibold text-[#0058be] border-[#d8e2ff] bg-white hover:bg-[#eff4ff]"
          >
            Sync Telemetry
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/dashboard/conversations')}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold shadow-[0_4px_14px_rgba(0,88,190,0.25)]"
          >
            Open Conversations Engine
          </Button>
        </div>
      </div>

      {/* 2. Operational Velocity KPI Ribbon (5 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((st, idx) => (
          <Card
            key={idx}
            variant="interactive"
            className="p-5 border-[#e5eeff] hover:border-[#0058be] flex flex-col justify-between bg-white shadow-[0_1px_3px_rgba(11,28,48,0.05)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#76777d] truncate">
                  {st.title}
                </span>
                <div className="p-2 rounded-xl bg-[#eff4ff] border border-[#d8e2ff]">
                  {st.icon}
                </div>
              </div>

              <div className="font-heading text-3xl font-extrabold text-[#0b1c30] tracking-tight">
                {st.value}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5eeff] flex items-center justify-between text-xs">
              <Badge variant={st.badgeVariant} size="sm" className="text-[10px]">
                {st.badge}
              </Badge>
              <span className="text-[11px] text-[#45464d] truncate ml-1 font-medium">
                {st.period}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Real-Time Autonomous 5-Stage Pipeline Monitor */}
      <Card variant="default" className="p-6 bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#eff4ff] text-[#0058be]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#0b1c30]">
                Live 5-Stage Autonomous Progression Pipeline
              </h2>
              <p className="text-xs text-[#45464d]">
                Visual progression tracking for every active customer interaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#0058be] bg-[#eff4ff] px-3 py-1.5 rounded-full border border-[#d8e2ff]">
            <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-ping" />
            <span>Telemetry Status: Optimal</span>
          </div>
        </div>

        {/* 5-Step Visual Pipeline Stepper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Stage 1: Ingest */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0058be]">01. INGEST</span>
              <span className="w-2 h-2 rounded-full bg-[#0c9488]" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                Omnichannel Inbound
              </span>
              <span className="text-[11px] text-[#45464d] block mt-0.5 leading-tight">
                WhatsApp, SMS, Web Chat, Email Webhooks
              </span>
            </div>
            <div className="pt-2 border-t border-[#d8e2ff] text-[11px] font-semibold text-[#004395]">
              12 Active Streams
            </div>
          </div>

          {/* Stage 2: Understand */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0058be]">02. UNDERSTAND</span>
              <span className="w-2 h-2 rounded-full bg-[#0c9488]" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                AI Intent & BANT
              </span>
              <span className="text-[11px] text-[#45464d] block mt-0.5 leading-tight">
                Context Extraction, 0-100 Score Evaluation
              </span>
            </div>
            <div className="pt-2 border-t border-[#d8e2ff] text-[11px] font-semibold text-[#004395]">
              94.2 Avg Score
            </div>
          </div>

          {/* Stage 3: Decide */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0058be]">03. DECIDE</span>
              <span className="w-2 h-2 rounded-full bg-[#0c9488]" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-[#0b1c30] block">
                Flow Rule Matching
              </span>
              <span className="text-[11px] text-[#45464d] block mt-0.5 leading-tight">
                Enterprise Rules, SLA Triggers, Priority Routing
              </span>
            </div>
            <div className="pt-2 border-t border-[#d8e2ff] text-[11px] font-semibold text-[#004395]">
              100% Policy Match
            </div>
          </div>

          {/* Stage 4: Act */}
          <div className="p-4 rounded-2xl bg-[#e5eeff] border border-[#0058be] flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0058be]">04. ACT</span>
              <span className="w-2 h-2 rounded-full bg-[#0058be] animate-pulse" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-[#004395] block">
                Mutation Execution
              </span>
              <span className="text-[11px] text-[#45464d] block mt-0.5 leading-tight">
                CRM Lead Sync, Calendar Booking, SOW Dispatch
              </span>
            </div>
            <div className="pt-2 border-t border-[#d8e2ff] text-[11px] font-bold text-[#0058be]">
              0.4s Execution Avg
            </div>
          </div>

          {/* Stage 5: Continue */}
          <div className="p-4 rounded-2xl bg-[#0b1c30] text-white border border-[#131b2e] flex flex-col justify-between gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#89f5e7]">05. CONTINUE</span>
              <span className="w-2 h-2 rounded-full bg-[#89f5e7]" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-white block">
                Chained Flow
              </span>
              <span className="text-[11px] text-[#adc6ff] block mt-0.5 leading-tight">
                Meeting Prep Brief, Follow-up Queue, Pipeline Advance
              </span>
            </div>
            <div className="pt-2 border-t border-[#213145] text-[11px] font-bold text-[#89f5e7]">
              Continuous Progression
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Human-in-the-Loop AI Action Approvals */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0b1c30] flex items-center gap-2">
              <span>Human-in-the-Loop Approval Queue</span>
              <Badge variant="accent" size="sm">
                {approvals.filter((a) => a.status === 'pending').length} Actions Requiring Review
              </Badge>
            </h2>
            <p className="text-xs text-[#45464d]">
              High-stakes commercial decisions queued for 1-click executive verification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {approvals.map((appr) => (
            <Card
              key={appr.id}
              variant="default"
              className={`p-5 border transition-all flex flex-col justify-between ${
                appr.status === 'approved'
                  ? 'bg-[#e6fcf8] border-[#89f5e7]'
                  : 'bg-white border-[#e5eeff] hover:border-[#0058be] shadow-[0_1px_3px_rgba(11,28,48,0.05)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <Badge variant="secondary" size="sm" className="bg-[#eff4ff] text-[#004395] border-[#d8e2ff]">
                    {appr.channel}
                  </Badge>
                  <span className="font-mono text-[11px] text-[#76777d]">{appr.time}</span>
                </div>

                <h3 className="font-heading font-bold text-sm text-[#0b1c30] mb-2 leading-snug">
                  {appr.title}
                </h3>

                <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex flex-col gap-1.5 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#76777d]">Account:</span>
                    <strong className="text-[#0b1c30]">{appr.company}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#76777d]">Deal Value:</span>
                    <span className="font-bold text-[#0058be]">{appr.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#76777d]">BANT Score:</span>
                    <span className="font-bold text-[#0c9488]">{appr.bantScore}/100</span>
                  </div>
                </div>

                <div className="text-xs text-[#45464d] mb-4">
                  <strong className="text-[#0b1c30] block mb-0.5">Automated Action:</strong>
                  <span>{appr.actionText}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5eeff]">
                {appr.status === 'approved' ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#005049] bg-[#e6fcf8] rounded-xl border border-[#89f5e7]">
                    <CheckCircle2 className="w-4 h-4 text-[#0c9488]" />
                    <span>Action Executed Successfully</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="accent"
                      size="sm"
                      fullWidth
                      onClick={() => handleApprove(appr.id)}
                      className="text-xs font-bold shadow-[0_4px_14px_rgba(0,88,190,0.2)]"
                    >
                      Approve & Execute
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast('Action skipped.')}
                      className="text-xs text-[#45464d] border-[#d8e2ff] bg-white hover:bg-[#eff4ff]"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Live Omnichannel Activity & Telemetry Stream Table */}
      <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f9ff] border-b border-[#e5eeff] pb-4">
          <div>
            <CardTitle className="text-base font-bold text-[#0b1c30]">
              Real-Time Interaction & Workflow Telemetry
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d]">
              Live stream of conversations converted to automated business actions
            </CardDescription>
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'whatsapp', 'web chat', 'sms inbound', 'email inbound'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedChannel === ch
                    ? 'bg-[#0058be] text-white shadow-xs'
                    : 'bg-white text-[#45464d] hover:text-[#0058be] border border-[#dce9ff]'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8f9ff] border-b border-[#e5eeff] text-[#0b1c30] font-heading font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Customer & Account</th>
                  <th className="py-3.5 px-6">Channel</th>
                  <th className="py-3.5 px-6">Extracted Parameters</th>
                  <th className="py-3.5 px-6">BANT Score</th>
                  <th className="py-3.5 px-6">Triggered Flow Rule</th>
                  <th className="py-3.5 px-6 text-right">Telemetry Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eeff] bg-white">
                {filteredFeed.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0b1c30] text-xs">
                        {row.customer}
                      </div>
                      <div className="text-[11px] text-[#76777d] truncate mt-0.5">
                        {row.company}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="secondary" size="sm" className="text-[10px] bg-[#eff4ff] text-[#004395] border-[#d8e2ff]">
                        {row.channel}
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-[11px] text-[#0b1c30] bg-[#f8f9ff] px-2 py-1 rounded-md border border-[#e5eeff]">
                        {row.extracted}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="success" size="sm" className="text-[10px] bg-[#e6fcf8] text-[#005049] border-[#89f5e7]">
                        {row.bantScore}/100
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#0058be] text-xs">
                        {row.flowRule}
                      </div>
                      <div className="text-[10px] text-[#76777d] mt-0.5">
                        {row.actionResult}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleInspect(row)}
                        className="text-[11px] font-semibold text-[#0058be] hover:bg-[#eff4ff] border-[#d8e2ff] bg-white"
                      >
                        Inspect Flow
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Telemetry Inspection Drawer Modal */}
      {inspectedActivity && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          title={`Flow Telemetry Audit: ${inspectedActivity.customer}`}
          description={`Full execution breakdown for event ${inspectedActivity.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="flex flex-col gap-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[#76777d]">Customer Message:</span>
                <span className="font-mono text-[10px] text-[#0058be] font-bold">{inspectedActivity.channel}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#0b1c30] leading-relaxed">
                "{inspectedActivity.message}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#e5eeff] bg-white">
                <span className="text-[10px] uppercase font-bold text-[#76777d] block">
                  BANT Qualification Score
                </span>
                <span className="text-lg font-bold text-[#0c9488]">
                  {inspectedActivity.bantScore} / 100
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#e5eeff] bg-white">
                <span className="text-[10px] uppercase font-bold text-[#76777d] block">
                  Triggered Flow Policy
                </span>
                <span className="text-xs font-bold text-[#0058be]">
                  {inspectedActivity.flowRule}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1c30] text-white border border-[#131b2e] flex flex-col gap-2 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#89f5e7]">
                Completed Backend Mutations
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-[#adc6ff]">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0" />
                <span>{inspectedActivity.actionResult}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInspectModalOpen(false)}
                className="border-[#d8e2ff] text-[#45464d]"
              >
                Close Audit
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  setInspectModalOpen(false);
                  navigate('/dashboard/conversations');
                }}
              >
                View in Conversations Hub
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
