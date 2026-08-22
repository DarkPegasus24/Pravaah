import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Sparkles,
  Bot,
  Smartphone,
  Globe,
  MessageSquare,
  Calendar,
  Paperclip,
  CheckCheck,
  Building2,
  Zap,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  User,
  Clock,
  Layers,
} from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui';

export default function Conversations() {
  // Pre-loaded realistic enterprise threads matching DESIGN.md
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      name: 'Sarah Jenkins',
      company: 'Apex Dental Group',
      channel: 'WhatsApp',
      channelType: 'whatsapp',
      status: 'Qualified',
      statusVariant: 'success',
      intentScore: 94,
      unreadCount: 1,
      autopilotEnabled: true,
      bant: {
        budget: '$30,000 - $45,000 ARR',
        authority: 'Owner / Principal Decision Maker',
        need: 'Automated 50-Seat Patient Inbound Workflow',
        timeline: 'Next Month (Q3 Launch)',
        score: 94,
      },
      flowRuleMatched: 'Enterprise Inbound Flow ($30k+)',
      nextChainedAction: 'Dispatch SOW #SOW-412 & Schedule Onboarding',
      messages: [
        {
          id: 'm-1',
          sender: 'customer',
          senderName: 'Sarah Jenkins',
          text: 'Hi! We operate 6 dental clinics and need an autonomous system for patient inquiries and scheduling. Our budget is around $30,000 - $45,000 ARR.',
          timestamp: '10:14 AM',
        },
        {
          id: 'm-2',
          sender: 'ai',
          senderName: 'PRAVAAH Autopilot',
          text: 'Hello Sarah! Welcome to Pravaah. We can easily automate intake and multi-calendar scheduling across your 6 clinic locations. Would Thursday at 2:00 PM EST work for an executive architecture demo?',
          timestamp: '10:15 AM',
        },
        {
          id: 'm-3',
          sender: 'customer',
          senderName: 'Sarah Jenkins',
          text: 'Thursday at 2:00 PM EST is perfect. Please send the invite to sarah@apexdental.com.',
          timestamp: '10:16 AM',
        },
        {
          id: 'm-4',
          sender: 'ai',
          senderName: 'PRAVAAH Autopilot',
          text: '✅ Calendar invite dispatched and confirmed for Thursday, Oct 24 @ 2:00 PM EST. Lead #412 created and qualified in CRM with a 94/100 BANT score.',
          timestamp: '10:16 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      name: 'Dr. Michael Chang',
      company: 'Nexus Global Health',
      channel: 'Web Chat',
      channelType: 'web',
      status: 'Meeting Booked',
      statusVariant: 'accent',
      intentScore: 89,
      unreadCount: 0,
      autopilotEnabled: true,
      bant: {
        budget: '$18,500 ARR',
        authority: 'Chief of Medicine',
        need: 'Conflict-Free Telehealth Booking',
        timeline: 'Immediate',
        score: 89,
      },
      flowRuleMatched: 'Calendar Slot Optimizer Rule',
      nextChainedAction: 'Sync with Dr. Chang Calendar & Send Prep Brief',
      messages: [
        {
          id: 'm-21',
          sender: 'customer',
          senderName: 'Dr. Michael Chang',
          text: 'Could we reschedule our onboarding review to Friday morning at 10:30 AM?',
          timestamp: 'Yesterday',
        },
        {
          id: 'm-22',
          sender: 'ai',
          senderName: 'PRAVAAH Autopilot',
          text: 'Checking team calendar availability... Friday @ 10:30 AM EST is completely clear! Calendar invite has been updated.',
          timestamp: 'Yesterday',
        },
      ],
    },
    {
      id: 'conv-3',
      name: 'David Ross',
      company: 'Quantum Health Care',
      channel: 'SMS Inbound',
      channelType: 'sms',
      status: 'Qualified',
      statusVariant: 'success',
      intentScore: 98,
      unreadCount: 0,
      autopilotEnabled: false,
      bant: {
        budget: '$60,000 ARR',
        authority: 'VP Operations',
        need: 'Urgent Clinic Expansion (25 Provider Seats)',
        timeline: 'This Week',
        score: 98,
      },
      flowRuleMatched: 'Urgent SLA Escalation (< 15 min)',
      nextChainedAction: 'Alert Executive On-Call & Lock Priority Slot',
      messages: [
        {
          id: 'm-31',
          sender: 'customer',
          senderName: 'David Ross',
          text: 'Urgent: Clinic expansion requires 25 additional provider seats by this Friday. Please connect us with an AE.',
          timestamp: '2 hours ago',
        },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inputMessage, setInputMessage] = useState('');
  const [mobileChatView, setMobileChatView] = useState(false);
  const [showReasoningDrawer, setShowReasoningDrawer] = useState(true);

  const chatEndRef = useRef(null);

  const activeConversation =
    conversations.find((c) => c.id === selectedId) || conversations[0];

  useEffect(() => {
    if (activeConversation?.messages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setMobileChatView(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: 'Operations Admin',
      text: inputMessage.trim(),
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
          };
        }
        return c;
      })
    );

    setInputMessage('');
  };

  const handleSendQuickReply = (text) => {
    if (!activeConversation) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      senderName: 'PRAVAAH Autopilot',
      text: text,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
          };
        }
        return c;
      })
    );
  };

  const toggleAutopilot = () => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, autopilotEnabled: !c.autopilotEnabled }
          : c
      )
    );
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages?.some((m) =>
        m.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'unread') return matchesSearch && c.unreadCount > 0;
    if (filterStatus === 'booked') return matchesSearch && c.status === 'Meeting Booked';
    if (filterStatus === 'qualified') return matchesSearch && c.status === 'Qualified';
    return matchesSearch;
  });

  const getChannelIcon = (type) => {
    switch (type) {
      case 'whatsapp':
        return <Smartphone className="w-3.5 h-3.5 text-[#0c9488]" />;
      case 'web':
        return <Globe className="w-3.5 h-3.5 text-[#0058be]" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-[#76777d]" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-[#0058be]" />;
    }
  };

  return (
    <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-8.5rem)] min-h-[560px] flex flex-col gap-4 animate-fadeIn font-sans bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0b1c30] tracking-tight flex items-center gap-2.5">
            <span>Conversations Hub</span>
            <Badge variant="accent" size="sm">
              {conversations.length} Active Threads
            </Badge>
          </h1>
          <p className="text-xs text-[#45464d]">
            Omnichannel customer inquiries autonomously moved to CRM pipeline and calendar actions.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowReasoningDrawer(!showReasoningDrawer)}
            className="text-xs font-semibold text-[#0058be] border-[#d8e2ff] bg-white hover:bg-[#eff4ff]"
            leftIcon={<Layers className="w-3.5 h-3.5" />}
          >
            {showReasoningDrawer ? 'Hide AI Inspector' : 'Show AI Inspector'}
          </Button>
        </div>
      </div>

      {/* Main Multi-Panel Container */}
      <Card
        variant="default"
        className="flex-1 min-h-0 border-[#e5eeff] overflow-hidden flex flex-col md:flex-row shadow-[0_1px_3px_rgba(11,28,48,0.05)] bg-white"
      >
        {/* ================= LEFT PANEL: CONVERSATIONS LIST ================= */}
        <div
          className={`w-full md:w-80 lg:w-88 border-r border-[#e5eeff] flex flex-col bg-white shrink-0 ${
            mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search and Filters */}
          <div className="p-3.5 border-b border-[#e5eeff] flex flex-col gap-2.5 bg-[#f8f9ff]">
            <Input
              placeholder="Search leads, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              startIcon={<Search className="w-4 h-4 text-[#76777d]" />}
              className="bg-white border-[#dce9ff]"
            />

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'booked', 'qualified', 'unread'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-[#0058be] text-white shadow-xs'
                      : 'bg-white text-[#45464d] hover:text-[#0058be] border border-[#dce9ff]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e5eeff] flex flex-col">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              const lastMsg = conv.messages?.[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-4 transition-all cursor-pointer flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-[#eff4ff] border-l-4 border-[#0058be]'
                      : 'hover:bg-[#f8f9ff]'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-colors ${
                      isSelected
                        ? 'bg-[#0058be] text-white'
                        : 'bg-[#eff4ff] text-[#004395] border border-[#d8e2ff]'
                    }`}
                  >
                    {conv.name.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Content Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-heading font-bold text-xs text-[#0b1c30] truncate">
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-[#76777d] font-mono shrink-0">
                        {lastMsg?.timestamp || 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#76777d] mb-1">
                      <span className="truncate">{conv.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getChannelIcon(conv.channelType)}
                      </span>
                    </div>

                    <p className="text-xs text-[#45464d] truncate leading-snug">
                      {lastMsg?.text || 'No messages yet'}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={conv.statusVariant || 'secondary'} size="sm" className="text-[9px]">
                        {conv.status}
                      </Badge>

                      <span className="text-[10px] font-mono text-[#0c9488] font-bold">
                        {conv.intentScore}% BANT
                      </span>
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0058be] absolute right-3 top-4 shadow-sm" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MIDDLE PANEL: CHAT THREAD & INPUT ================= */}
        <div
          className={`flex-1 flex flex-col bg-white min-w-0 ${
            !mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 sm:px-6 border-b border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileChatView(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-[#0b1c30] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {activeConversation.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-sm text-[#0b1c30] truncate">
                        {activeConversation.name}
                      </h2>
                      <Badge variant={activeConversation.statusVariant || 'secondary'} size="sm">
                        {activeConversation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#76777d] truncate">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#0058be]" />
                        {activeConversation.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getChannelIcon(activeConversation.channelType)}
                        {activeConversation.channel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Toggle: Autopilot */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleAutopilot}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      activeConversation.autopilotEnabled
                        ? 'bg-[#e6fcf8] border-[#89f5e7] text-[#005049]'
                        : 'bg-white border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]'
                    }`}
                  >
                    <Zap
                      className={`w-3.5 h-3.5 ${
                        activeConversation.autopilotEnabled
                          ? 'text-[#0c9488] animate-pulse'
                          : 'text-[#76777d]'
                      }`}
                    />
                    <span>
                      {activeConversation.autopilotEnabled
                        ? 'Autopilot: Active'
                        : 'Manual Agent'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-[#f8f9ff]/40">
                {activeConversation.messages?.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  const isAgent = msg.sender === 'agent';
                  const isCustomer = msg.sender === 'customer';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                        isCustomer ? 'self-start items-start' : 'self-end items-end'
                      }`}
                    >
                      {/* Sender Label */}
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#76777d]">
                        {isAi && <Sparkles className="w-3 h-3 text-[#0058be]" />}
                        <span className="font-semibold text-[#0b1c30]">
                          {msg.senderName}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isAi
                            ? 'bg-[#0b1c30] text-white border border-[#131b2e] shadow-sm'
                            : isAgent
                            ? 'bg-[#0058be] text-white shadow-xs'
                            : 'bg-white text-[#0b1c30] border border-[#e5eeff] shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* AI Quick Suggestion Chips */}
              <div className="px-4 py-2 bg-white border-t border-[#e5eeff] flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#76777d] flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#0058be]" />
                  AI Suggested:
                </span>
                <button
                  onClick={() =>
                    handleSendQuickReply(
                      'I have reserved Thursday @ 2 PM EST for your team. Here is your calendar link: https://meet.pravaah.ai/demo-412'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#004395] hover:bg-[#d8e2ff] font-semibold transition-colors shrink-0 text-xs border border-[#d8e2ff]"
                >
                  📅 Send Demo Link
                </button>
                <button
                  onClick={() =>
                    handleSendQuickReply(
                      'I have generated your customized 50-seat Enterprise SLA proposal. Check your inbox for SOW-412.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#004395] hover:bg-[#d8e2ff] font-semibold transition-colors shrink-0 text-xs border border-[#d8e2ff]"
                >
                  📄 Dispatch SOW Agreement
                </button>
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-[#e5eeff] flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 rounded-xl text-[#76777d] hover:text-[#0058be] hover:bg-[#eff4ff] transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type a message or trigger a flow action..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3.5 py-2 text-xs text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]"
                />

                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  disabled={!inputMessage.trim()}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                  className="font-bold"
                >
                  Send
                </Button>
              </form>
            </>
          ) : null}
        </div>

        {/* ================= RIGHT PANEL: 5-STAGE AI REASONING INSPECTOR ================= */}
        {showReasoningDrawer && activeConversation && (
          <div className="hidden lg:flex w-80 border-l border-[#e5eeff] flex-col bg-[#f8f9ff] p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e5eeff]">
              <Layers className="w-4 h-4 text-[#0058be]" />
              <h3 className="font-heading font-bold text-xs text-[#0b1c30] uppercase tracking-wider">
                5-Stage Reasoning Trace
              </h3>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              {/* Stage 1 */}
              <div className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs">
                <span className="font-mono text-[10px] font-bold text-[#0058be] block mb-1">
                  01. INGESTION
                </span>
                <span className="font-semibold text-[#0b1c30] block">
                  {activeConversation.channel} Webhook
                </span>
                <span className="text-[11px] text-[#76777d] mt-0.5 block">
                  Latency: 142ms • Verified Source
                </span>
              </div>

              {/* Stage 2 */}
              <div className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs">
                <span className="font-mono text-[10px] font-bold text-[#0058be] block mb-1">
                  02. CONTEXT & BANT
                </span>
                <div className="flex flex-col gap-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Budget:</span>
                    <strong className="text-[#0b1c30]">{activeConversation.bant?.budget}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Score:</span>
                    <strong className="text-[#0c9488] font-bold">{activeConversation.bant?.score} / 100</strong>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-3 rounded-xl bg-white border border-[#e5eeff] shadow-xs">
                <span className="font-mono text-[10px] font-bold text-[#0058be] block mb-1">
                  03. FLOW POLICY
                </span>
                <span className="font-semibold text-[#004395] block">
                  {activeConversation.flowRuleMatched}
                </span>
              </div>

              {/* Stage 4 */}
              <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#0058be] shadow-xs">
                <span className="font-mono text-[10px] font-bold text-[#0058be] block mb-1">
                  04. MUTATION EXECUTED
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0058be]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0c9488]" />
                  <span>Lead Created & Booked</span>
                </div>
              </div>

              {/* Stage 5 */}
              <div className="p-3 rounded-xl bg-[#0b1c30] text-white border border-[#131b2e] shadow-xs">
                <span className="font-mono text-[10px] font-bold text-[#89f5e7] block mb-1">
                  05. NEXT CONTINUED FLOW
                </span>
                <span className="text-[11px] text-[#adc6ff] block leading-snug">
                  {activeConversation.nextChainedAction}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
