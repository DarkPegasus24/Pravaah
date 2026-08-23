import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ArrowRight,
  Clock,
  Loader2,
  Calendar,
  Send,
  User,
  PhoneCall,
  Sparkles,
  BarChart3,
  Target,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from '../components/ui';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();

  // Real Supabase data states
  const [totalConversations, setTotalConversations] = useState(0);
  const [newTodayCount, setNewTodayCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [recentConversations, setRecentConversations] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        setIsLoading(true);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayISO = startOfToday.toISOString();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch all stats, recent conversations, and 7-day timestamps in parallel
        const [
          totalConvRes,
          newTodayRes,
          totalMsgRes,
          totalLeadsRes,
          recentConvRes,
          weeklyConvRes,
        ] = await Promise.all([
          // 1. Total conversations count
          supabase.from('conversations').select('*', { count: 'exact', head: true }),
          // 2. New Today conversations count (created_at >= local start of today)
          supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfTodayISO),
          // 3. Total messages count
          supabase.from('messages').select('*', { count: 'exact', head: true }),
          // 4. Total leads count
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          // 5. 5 most recent conversations
          supabase
            .from('conversations')
            .select('id, customer_name, customer_contact, status, updated_at, channel, call_duration')
            .order('updated_at', { ascending: false })
            .limit(5),
          // 6. Created timestamps for the last 7 days to build real activity bar
          supabase
            .from('conversations')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString()),
        ]);

        if (!isMounted) return;

        if (!totalConvRes.error) {
          setTotalConversations(totalConvRes.count || 0);
        }

        if (!newTodayRes.error) {
          setNewTodayCount(newTodayRes.count || 0);
        }

        if (!totalMsgRes.error) {
          setTotalMessages(totalMsgRes.count || 0);
        }

        if (!totalLeadsRes.error) {
          setTotalLeads(totalLeadsRes.count || 0);
        }

        if (!recentConvRes.error && recentConvRes.data) {
          setRecentConversations(recentConvRes.data);
        }

        // Build real 7-day activity buckets
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
          const dateStr = d.toISOString().split('T')[0];
          days.push({ dayName, dateStr, count: 0 });
        }

        if (!weeklyConvRes.error && weeklyConvRes.data) {
          weeklyConvRes.data.forEach((row) => {
            if (!row.created_at) return;
            const rowDate = new Date(row.created_at).toISOString().split('T')[0];
            const match = days.find((d) => d.dateStr === rowDate);
            if (match) match.count += 1;
          });
        }
        setWeeklyActivity(days);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const maxWeeklyCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

  /*
  // TODO: re-enable when this feature is built
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
      badge: 'Active Engine',
      badgeVariant: 'success',
    },
    {
      title: 'AI Qualified Leads (BANT)',
      value: '412',
      change: '$1.84M',
      period: 'pipeline generated (88 avg BANT)',
      badge: 'High Intent',
      badgeVariant: 'accent',
    },
    {
      title: 'Meetings Booked',
      value: '89',
      change: '+24%',
      period: '0 scheduling conflicts',
      badge: '24/7 Autopilot',
      badgeVariant: 'secondary',
    },
    {
      title: 'Documents Processed',
      value: '164',
      change: '100%',
      period: 'OCR & metadata synced to CRM',
      badge: 'Verified',
      badgeVariant: 'info',
    },
    {
      title: 'Operations Hours Saved',
      value: '142.5h',
      change: '+$18.4k',
      period: 'estimated monthly value created',
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
  */

  return (
    <div className="flex flex-col gap-8 animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white">
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
            Here's what's happening across your business right now.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/dashboard/conversations')}
            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold shadow-[0_4px_14px_rgba(0,88,190,0.25)] px-4 py-2"
          >
            Open Conversations Engine
          </Button>
        </div>
      </div>

      {/* 2. Prominent Real Metric Cards: Total Conversations, New Today, Total Messages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Total Conversations */}
        <Card
          variant="interactive"
          onClick={() => navigate('/dashboard/conversations')}
          className="p-6 border-[#e5eeff] hover:border-[#0058be] flex flex-col justify-between bg-white shadow-[0_2px_8px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_20px_rgba(0,88,190,0.08)] transition-all cursor-pointer rounded-2xl"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
                Total Conversations
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex items-center justify-center text-[#0058be] shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="font-heading text-4xl font-extrabold text-[#0b1c30] tracking-tight flex items-center">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
              ) : (
                totalConversations
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#e5eeff] flex items-center justify-between text-xs">
            <Badge variant="success" size="sm" className="text-[10px]">
              Live Database
            </Badge>
            <span className="text-xs text-[#0058be] font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Card>

        {/* Card 2: New Today */}
        <Card
          variant="interactive"
          onClick={() => navigate('/dashboard/conversations')}
          className="p-6 border-[#e5eeff] hover:border-[#0058be] flex flex-col justify-between bg-white shadow-[0_2px_8px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_20px_rgba(0,88,190,0.08)] transition-all cursor-pointer rounded-2xl"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
                New Today
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex items-center justify-center text-[#0058be] shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="font-heading text-4xl font-extrabold text-[#0b1c30] tracking-tight flex items-center">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
              ) : (
                newTodayCount
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#e5eeff] flex items-center justify-between text-xs">
            <Badge variant="accent" size="sm" className="text-[10px]">
              Today
            </Badge>
            <span className="text-xs text-[#45464d] font-medium">
              Inbound inquiries
            </span>
          </div>
        </Card>

        {/* Card 3: Total Messages */}
        <Card
          variant="interactive"
          onClick={() => navigate('/dashboard/conversations')}
          className="p-6 border-[#e5eeff] hover:border-[#0058be] flex flex-col justify-between bg-white shadow-[0_2px_8px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_20px_rgba(0,88,190,0.08)] transition-all cursor-pointer rounded-2xl"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76777d]">
                Total Messages
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] border border-[#d8e2ff] flex items-center justify-center text-[#0058be] shadow-xs">
                <Send className="w-5 h-5" />
              </div>
            </div>

            <div className="font-heading text-4xl font-extrabold text-[#0b1c30] tracking-tight flex items-center">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
              ) : (
                totalMessages
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#e5eeff] flex items-center justify-between text-xs">
            <Badge variant="info" size="sm" className="text-[10px]">
              All Threads
            </Badge>
            <span className="text-xs text-[#45464d] font-medium">
              Customer & AI
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Quick Actions & Operations Launchpad */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading font-bold text-base text-[#0b1c30]">
            Operations Launchpad
          </h2>
          <p className="text-xs text-[#45464d]">
            Direct shortcuts to active tools and roadmap features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Live Conversations Hub (Active) */}
          <div
            onClick={() => navigate('/dashboard/conversations')}
            className="p-5 rounded-2xl bg-white border border-[#dce9ff] hover:border-[#0058be] hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm" className="text-[10px]">
                  Active Engine
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                Live Conversations
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                Monitor incoming customer messages, trigger AI replies, or take over threads directly.
              </p>
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
              <span>Open Conversations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Inbound Voice Telephony (Active) */}
          <div
            onClick={() => navigate('/dashboard/calling')}
            className="p-5 rounded-2xl bg-white border border-[#dce9ff] hover:border-[#0058be] hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm" className="text-[10px]">
                  OmniDimension Live
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                AI Voice Telephony
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                Autonomous telephony agent that picks up incoming phone calls, provides voice responses, and logs audio recordings.
              </p>
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
              <span>Configure Voice Agent</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: CRM Leads Pipeline (Active) */}
          <div
            onClick={() => navigate('/dashboard/leads')}
            className="p-5 rounded-2xl bg-white border border-[#dce9ff] hover:border-[#0058be] hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff]">
                  <Target className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm" className="text-[10px]">
                  Active CRM {totalLeads > 0 ? `(${totalLeads})` : ''}
                </Badge>
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                CRM Lead Enrichment
              </h3>
              <p className="text-xs text-[#45464d] mt-1 leading-relaxed">
                Automatic customer data enrichment, meeting scheduler sync, and continuous pipeline automation from AI conversations.
              </p>
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
              <span>Open Leads Pipeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Row: 7-Day Inflow Bar Chart + Recent Conversations List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): 100% Real 7-Day Inflow Bar Chart */}
        <div className="lg:col-span-4">
          <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#eff4ff] text-[#0058be]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#0b1c30]">
                    7-Day Activity
                  </h3>
                </div>
                <Badge variant="secondary" size="sm" className="text-[10px] bg-[#eff4ff] text-[#004395] border-[#d8e2ff]">
                  Real Inflow
                </Badge>
              </div>
              <p className="text-xs text-[#76777d] mb-6">
                Daily new conversation creation over the last 7 days.
              </p>

              {/* Visual 7-day Bar Columns */}
              <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1">
                {weeklyActivity.map((day, idx) => {
                  const heightPercent = Math.max((day.count / maxWeeklyCount) * 100, 8);
                  const isToday = idx === weeklyActivity.length - 1;

                  return (
                    <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-[#0058be] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </span>
                      <div className="w-full bg-[#f0f4fc] rounded-lg h-24 flex items-end p-0.5 overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-md transition-all duration-500 ${
                            isToday ? 'bg-[#0058be]' : 'bg-[#7ba9ff] group-hover:bg-[#0058be]'
                          }`}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-[#0058be] font-bold' : 'text-[#76777d]'}`}>
                        {day.dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs text-[#45464d] mt-4">
              <span>Today: <strong className="text-[#0b1c30]">{newTodayCount} new</strong></span>
              <span>Total: <strong className="text-[#0058be]">{totalConversations}</strong></span>
            </div>
          </Card>
        </div>

        {/* Right Column (8 cols): Real Recent Conversations List */}
        <div className="lg:col-span-8">
          <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] rounded-2xl overflow-hidden h-full flex flex-col justify-between">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f9ff] border-b border-[#e5eeff] p-5">
              <div>
                <CardTitle className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0058be]" />
                  <span>Recent Conversations</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#45464d]">
                  Latest active customer interactions synced with Supabase
                </CardDescription>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard/conversations')}
                className="text-xs font-semibold text-[#0058be] border-[#d8e2ff] bg-white hover:bg-[#eff4ff]"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View All
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex-1">
              {isLoading ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0058be]" />
                  <p className="text-xs text-[#76777d]">Loading recent conversations...</p>
                </div>
              ) : recentConversations.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center border border-[#d8e2ff] shadow-xs">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#0b1c30]">No conversations yet</h3>
                    <p className="text-xs text-[#76777d] mt-1 max-w-sm mx-auto">
                      When customers submit inquiries or start chats, they will automatically appear here in real time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#e5eeff]">
                  {recentConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => navigate('/dashboard/conversations')}
                      className="p-4 sm:px-6 hover:bg-[#f8f9ff] transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                          conv.channel === 'voice' ? 'bg-[#0b1c30] text-[#89f5e7]' : 'bg-[#0058be] text-white'
                        }`}>
                          {conv.channel === 'voice' ? <PhoneCall className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-xs sm:text-sm text-[#0b1c30] truncate group-hover:text-[#0058be] transition-colors">
                              {conv.customer_name || (conv.channel === 'voice' ? 'Voice Call Caller' : 'Customer Inquiry')}
                            </span>
                            {conv.channel === 'voice' ? (
                              <Badge variant="success" size="sm" className="text-[10px]">
                                Phone Call
                              </Badge>
                            ) : conv.status ? (
                              <Badge variant="secondary" size="sm" className="text-[10px] bg-[#eff4ff] text-[#004395] border-[#d8e2ff]">
                                {conv.status}
                              </Badge>
                            ) : null}
                          </div>
                          {conv.customer_contact ? (
                            <p className="text-[11px] text-[#76777d] truncate">
                              {conv.customer_contact}
                            </p>
                          ) : (
                            <p className="text-[11px] text-[#76777d] truncate">
                              {conv.channel === 'voice' ? 'OmniDimension Inbound' : 'Direct Web Inbound'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-right">
                        <div className="flex items-center gap-1.5 text-xs text-[#76777d]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(conv.updated_at)}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#76777d] group-hover:text-[#0058be] group-hover:translate-x-0.5 transition-all hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/*
      // TODO: re-enable when this feature is built
      // 5-Stage Autonomous Pipeline Monitor section
      <Card variant="default" className="p-6 bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)]">
        ...
      </Card>
      */}

      {/*
      // TODO: re-enable when this feature is built
      // Human-in-the-Loop AI Action Approvals Queue
      <div className="flex flex-col gap-4">
        ...
      </div>
      */}

      {/*
      // TODO: re-enable when this feature is built
      // Live Omnichannel Activity & Telemetry Stream Table
      <Card variant="default" className="bg-white border-[#e5eeff] shadow-[0_1px_3px_rgba(11,28,48,0.05)] overflow-hidden">
        ...
      </Card>
      */}

      {/*
      // TODO: re-enable when this feature is built
      // Telemetry Inspection Drawer Modal
      */}
    </div>
  );
}
