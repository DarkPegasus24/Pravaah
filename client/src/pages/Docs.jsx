import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Search,
  Bot,
  Database,
  Layers,
  PhoneCall,
  ShieldCheck,
  Terminal,
  Server,
  Cpu,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  Smartphone,
  Share2,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { PravaahLogo } from '../components/common/PravaahLogo';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const navSections = [
    { id: 'overview', title: 'Product Overview', icon: BookOpen },
    { id: 'architecture', title: 'Architecture & Tech Stack', icon: Layers },
    { id: 'ai-agent', title: 'AI Agent & Real-Time Engine', icon: Bot },
    { id: 'conversations-hub', title: 'Conversations & Dashboard', icon: MessageSquare },
    { id: 'voice-agent', title: 'Voice Telephony & Calling', icon: PhoneCall },
    { id: 'whatsapp-service', title: 'WhatsApp Business API', icon: Share2 },
    { id: 'sms-service', title: 'SMS Service & Messaging', icon: Smartphone },
    { id: 'schema', title: 'Database Schema & RLS', icon: Database },
    { id: 'edge-functions', title: 'Edge Functions & API', icon: Server },
    { id: 'setup', title: 'Setup & Environment', icon: Terminal },
  ];

  const filteredSections = navSections.filter((sec) =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#0058be] selection:text-white flex flex-col">
      {/* Top Floating Navbar */}
      <div className="sticky top-3 z-40 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <header className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl border border-[#dce9ff] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl md:rounded-full px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto transition-all">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group focus:outline-none">
              <PravaahLogo size="sm" showTagline={false} />
            </Link>
            <div className="h-4 w-px bg-[#dce9ff] hidden sm:block" />
            <span className="text-xs font-bold text-[#0058be] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Documentation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#45464d] hover:text-[#0058be]" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="accent" size="sm" className="rounded-full text-xs font-bold px-4" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                Command Center
              </Button>
            </Link>
          </div>
        </header>
      </div>

      {/* Main Docs Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#dce9ff] shadow-sm">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#76777d] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter topics..."
                className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-[#f8f9ff] text-xs text-[#0b1c30] placeholder:text-[#76777d] border border-[#dce9ff] focus:border-[#0058be] focus:outline-none transition-colors"
              />
            </div>

            {/* Nav list */}
            <nav className="flex flex-col gap-1">
              {filteredSections.map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0058be] text-white shadow-xs'
                        : 'text-[#45464d] hover:text-[#0058be] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0058be]'}`} />
                      <span>{sec.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-100 text-white' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#e5eeff] flex flex-col gap-2 text-[11px] text-[#76777d]">
              <div className="flex items-center gap-1.5 text-[#0058be] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pravaah Core v1.0</span>
              </div>
              <p className="leading-snug">
                Production-ready autonomous conversational AI system powered by Supabase & OpenAI GPT.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-9 flex flex-col gap-10">
          {/* Section 1: Overview */}
          <section id="overview" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" dot size="sm" className="mb-3 border-[#d8e2ff]">
              Introduction
            </Badge>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Product Overview
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#45464d] leading-relaxed">
              <strong>Pravaah</strong> is an intelligent business operations platform engineered to autonomously engage customer inquiries in real time. It unifies high-speed conversational AI with a real-time command center so your business never misses leads or customer queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0058be] flex items-center justify-center font-bold mb-2">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xs text-[#0b1c30]">24/7 AI Reception</h3>
                <p className="text-[11px] text-[#45464d] mt-1 leading-snug">
                  Automated customer conversations with context-aware intelligence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0058be] flex items-center justify-center font-bold mb-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xs text-[#0b1c30]">Live Conversation Hub</h3>
                <p className="text-[11px] text-[#45464d] mt-1 leading-snug">
                  Supabase Realtime synchronized chat threads and thread inspection.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0058be] flex items-center justify-center font-bold mb-2">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xs text-[#0b1c30]">AI Voice Calls</h3>
                <p className="text-[11px] text-[#45464d] mt-1 leading-snug">
                  Upcoming inbound telephony and AI voice conversation support.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Architecture & Tech Stack */}
          <section id="architecture" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              System Architecture
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Architecture & Tech Stack
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Pravaah is built as a cloud-native real-time system combining reactive client-side architecture with serverless Edge Functions and Postgres.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce9ff] bg-[#0b1c30] text-white p-5 font-mono text-xs leading-relaxed">
              <div className="text-[#adc6ff] font-semibold mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#89f5e7]" /> System Pipeline Flow
              </div>
              <div className="space-y-2 text-[#dce9ff]">
                <p className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-[#89f5e7] font-bold">1. Client UI</span>
                  <span>React 19 + Vite 8 + Tailwind CSS</span>
                </p>
                <p className="pl-4 text-[#7c839b]">↓ HTTP Request / Function Invoke</p>
                <p className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-[#89f5e7] font-bold">2. Edge Function</span>
                  <span>Supabase Edge Function (`ai-agent`) powered by OpenAI GPT</span>
                </p>
                <p className="pl-4 text-[#7c839b]">↓ Writes `customer` message + `business` response</p>
                <p className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-[#89f5e7] font-bold">3. Database</span>
                  <span>Supabase PostgreSQL (`conversations` & `messages` tables)</span>
                </p>
                <p className="pl-4 text-[#7c839b]">↓ Realtime WebSocket `postgres_changes` Event</p>
                <p className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-[#89f5e7] font-bold">4. Live Sync</span>
                  <span>Instant push updates to active conversation threads without manual refresh</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: AI Agent & Real-Time Engine */}
          <section id="ai-agent" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              Intelligence
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              AI Agent & Real-Time Engine
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              When a user submits a message, the system calls the serverless Edge Function <code className="bg-[#eff4ff] text-[#004395] px-1.5 py-0.5 rounded font-mono text-xs">ai-agent</code>. The agent extracts customer intent, produces an intelligent business response, and saves both rows to Postgres.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
              <h3 className="font-heading font-bold text-xs text-[#0b1c30] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> Key Agent Characteristics:
              </h3>
              <ul className="text-xs text-[#45464d] space-y-2 list-disc list-inside">
                <li>Immediate response latency typically under 1.5 seconds.</li>
                <li>Preserves context across sequential messages within a conversation.</li>
                <li>Identifies customer intent and answers product, pricing, and onboarding inquiries.</li>
                <li>Supports seamless human agent takeover through the live Command Center.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Conversations Hub */}
          <section id="conversations-hub" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              UI & Management
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Live Conversations & Dashboard
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              The Conversations interface (<code className="bg-[#eff4ff] text-[#004395] px-1.5 py-0.5 rounded font-mono text-xs">/dashboard/conversations</code>) offers a full two-panel communication suite:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-1">Left Panel: Threads List</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Fetches all conversations ordered by <code className="font-mono text-[11px]">updated_at DESC</code>. Filter by status (All, Booked, Qualified) or search by customer name/contact.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-1">Right Panel: Live Chat Thread</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Renders message history with customer queries on the left and business AI replies on the right. Subscribed to live WebSocket updates.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Voice Calling & Telephony Integration */}
          <section id="voice-agent" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success" size="sm" className="border-[#89f5e7]">
                Live Telephony Ready
              </Badge>
              <Badge variant="accent" size="sm">
                OmniDimension / OmniDev
              </Badge>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30] flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#0058be]" /> AI Voice Telephony & Calling Architecture
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Pravaah integrates with <strong>OmniDimension</strong> (and standard WebRTC/SIP telephony providers) to enable real 24/7 inbound phone reception. When a customer dials your business phone number from their phone, the AI answers autonomously, references your Supabase Knowledge Base, and streams audio recordings and transcripts into your dashboard.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-3 text-xs">
              <h4 className="font-heading font-bold text-xs text-[#0b1c30] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> 3-Step Setup with OmniDimension:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[#45464d]">
                <li><strong>Create Agent</strong> on <a href="https://omnidim.io" target="_blank" rel="noopener noreferrer" className="text-[#0058be] underline font-semibold">omnidim.io</a> and purchase/link an inbound phone number.</li>
                <li><strong>Configure Webhook</strong> in OmniDimension agent settings and set URL to: <code className="bg-[#eff4ff] text-[#004395] px-1.5 py-0.5 rounded font-mono text-[11px]">https://khncmjutalqwepxrydvt.supabase.co/functions/v1/voice-call-webhook</code></li>
                <li><strong>Sync Knowledge Base</strong> in Pravaah Command Center (<code className="font-mono text-[11px]">/dashboard/calling</code>) to automatically train your agent.</li>
              </ol>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-[#0b1c30] text-white font-mono text-xs overflow-hidden">
              <div className="text-[#89f5e7] font-bold mb-2">Sample Webhook Event Payload:</div>
              <pre className="text-[#adc6ff] overflow-x-auto text-[11px]">
{`{
  "event": "call.completed",
  "call": {
    "customer_phone_number": "+18302692120",
    "customer_name": "Dr. Jenkins (Apex Clinic)",
    "duration_seconds": 134,
    "recording_url": "https://cdn.omnidim.io/recordings/call_992.mp3",
    "transcript": [
      { "role": "customer", "content": "Hi, do you have slots for root canal this Thursday?" },
      { "role": "assistant", "content": "Yes! Dr. Miller is available at 2:00 PM on Thursday." }
    ]
  }
}`}
              </pre>
            </div>
          </section>

          {/* Section 6: SMS Service & Two-Way Messaging */}
          <section id="sms-service" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success" size="sm" className="border-[#89f5e7]">
                2-Way SMS Active
              </Badge>
              <Badge variant="accent" size="sm">
                Carrier Webhook
              </Badge>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#0058be]" /> Autonomous SMS Service & Messaging
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Pravaah supports automated two-way SMS conversations and post-call follow-ups. When customers text your business number, Pravaah generates concise responses under 2 seconds, while automatically dispatching booking confirmations and missed-call recovery texts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-1">1. Two-Way AI Text Replies</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Instant natural replies under 160 characters referencing your Knowledge Base.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-1">2. Post-Call Follow-ups</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Automated SMS dispatching meeting links immediately when a phone call concludes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#dce9ff]">
                <h4 className="font-heading font-bold text-xs text-[#0b1c30] mb-1">3. Missed-Call Recovery</h4>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Instant text back to recover and qualify missed callers automatically.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-[#0b1c30] text-white font-mono text-xs overflow-hidden">
              <div className="text-[#89f5e7] font-bold mb-2">Inbound SMS Webhook URL:</div>
              <div className="p-2 rounded bg-[#131b2e] text-[#adc6ff] break-all select-all text-[11px]">
                https://khncmjutalqwepxrydvt.supabase.co/functions/v1/sms-inbound-webhook
              </div>
            </div>
          </section>

          {/* Section 7: WhatsApp Business Cloud API & Webhooks */}
          <section id="whatsapp-service" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success" size="sm" className="bg-[#25D366]/20 text-[#166534] border-[#25D366]/40">
                WhatsApp Cloud API
              </Badge>
              <Badge variant="accent" size="sm">
                Meta Verified
              </Badge>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30] flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#25D366]" /> Meta WhatsApp Business AI Integration
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Pravaah links directly with the official <strong>Meta WhatsApp Cloud API</strong>. When customers send WhatsApp messages, Pravaah handles Meta's verification handshake, processes messages with AI in under 2 seconds, and sends formatted WhatsApp replies directly back to the customer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <h4 className="font-heading font-bold text-xs text-[#14532d] mb-1">1. Callback Webhook URL</h4>
                <p className="font-mono text-[11px] text-[#166534] bg-white p-2 rounded border border-[#bbf7d0] break-all select-all">
                  https://khncmjutalqwepxrydvt.supabase.co/functions/v1/whatsapp-webhook
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <h4 className="font-heading font-bold text-xs text-[#14532d] mb-1">2. Verify Token (Meta Handshake)</h4>
                <p className="font-mono text-[11px] text-[#166534] bg-white p-2 rounded border border-[#bbf7d0] select-all">
                  pravaah_verify_token_2026
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Database Schema & RLS */}
          <section id="schema" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              Database
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Database Schema & RLS
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Pravaah uses two core tables in Postgres with Row-Level Security (RLS) configured:
            </p>

            {/* Table 1: conversations */}
            <div className="mt-6">
              <h3 className="font-heading font-bold text-xs text-[#0b1c30] uppercase tracking-wider mb-2">
                1. `conversations` Table
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#dce9ff]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8f9ff] text-[#45464d] font-semibold border-b border-[#dce9ff]">
                    <tr>
                      <th className="px-4 py-2.5">Column</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5eeff] text-[#0b1c30]">
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">id</td>
                      <td className="px-4 py-2 text-[#76777d]">uuid (PK)</td>
                      <td className="px-4 py-2">Unique conversation identifier</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">customer_name</td>
                      <td className="px-4 py-2 text-[#76777d]">text</td>
                      <td className="px-4 py-2">Customer full name</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">customer_contact</td>
                      <td className="px-4 py-2 text-[#76777d]">text (nullable)</td>
                      <td className="px-4 py-2">Phone number or email address</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">status</td>
                      <td className="px-4 py-2 text-[#76777d]">text</td>
                      <td className="px-4 py-2">Status (e.g. 'open', 'Qualified', 'Booked')</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">updated_at</td>
                      <td className="px-4 py-2 text-[#76777d]">timestamptz</td>
                      <td className="px-4 py-2">Last updated timestamp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: messages */}
            <div className="mt-6">
              <h3 className="font-heading font-bold text-xs text-[#0b1c30] uppercase tracking-wider mb-2">
                2. `messages` Table
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#dce9ff]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8f9ff] text-[#45464d] font-semibold border-b border-[#dce9ff]">
                    <tr>
                      <th className="px-4 py-2.5">Column</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5eeff] text-[#0b1c30]">
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">id</td>
                      <td className="px-4 py-2 text-[#76777d]">uuid (PK)</td>
                      <td className="px-4 py-2">Message unique identifier</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">conversation_id</td>
                      <td className="px-4 py-2 text-[#76777d]">uuid (FK)</td>
                      <td className="px-4 py-2">References `conversations.id`</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">sender_type</td>
                      <td className="px-4 py-2 text-[#76777d]">text</td>
                      <td className="px-4 py-2">'customer' | 'business'</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">content</td>
                      <td className="px-4 py-2 text-[#76777d]">text</td>
                      <td className="px-4 py-2">Message body content</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[#0058be]">created_at</td>
                      <td className="px-4 py-2 text-[#76777d]">timestamptz</td>
                      <td className="px-4 py-2">Creation timestamp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 7: Edge Functions & API */}
          <section id="edge-functions" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              API Reference
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Edge Function Invocation
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              The frontend communicates with the AI agent using the Supabase client:
            </p>

            <div className="mt-4 rounded-2xl bg-[#0b1c30] text-white p-4 font-mono text-xs relative overflow-hidden">
              <button
                onClick={() =>
                  handleCopy(
                    `const { data, error } = await supabase.functions.invoke('ai-agent', {\n  body: {\n    conversation_id: selectedId,\n    customer_message: textToSend,\n  },\n});`,
                    'invoke-code'
                  )
                }
                className="absolute right-3 top-3 p-1.5 rounded-lg bg-[#131b2e] hover:bg-[#213145] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedSnippet === 'invoke-code' ? <Check className="w-3.5 h-3.5 text-[#0c9488]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="text-[#89f5e7] overflow-x-auto">
{`const { data, error } = await supabase.functions.invoke('ai-agent', {
  body: {
    conversation_id: selectedId,
    customer_message: textToSend,
  },
});`}
              </pre>
            </div>
          </section>

          {/* Section 8: Setup & Environment */}
          <section id="setup" className="scroll-mt-24 bg-white p-6 sm:p-8 rounded-3xl border border-[#dce9ff] shadow-xs">
            <Badge variant="secondary" size="sm" className="mb-3 border-[#d8e2ff]">
              Configuration
            </Badge>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Setup & Environment Variables
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#45464d] leading-relaxed">
              Create a <code className="bg-[#eff4ff] text-[#004395] px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file in the <code className="bg-[#eff4ff] text-[#004395] px-1.5 py-0.5 rounded font-mono text-xs">client/</code> directory:
            </p>

            <div className="mt-4 rounded-2xl bg-[#0b1c30] text-white p-4 font-mono text-xs relative overflow-hidden">
              <button
                onClick={() =>
                  handleCopy(
                    `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-publishable-anon-key\nOPENAI_API_KEY=your-openai-api-key`,
                    'env-code'
                  )
                }
                className="absolute right-3 top-3 p-1.5 rounded-lg bg-[#131b2e] hover:bg-[#213145] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedSnippet === 'env-code' ? <Check className="w-3.5 h-3.5 text-[#0c9488]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="text-[#adc6ff] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
OPENAI_API_KEY=your-openai-api-key`}
              </pre>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-[#dce9ff] text-xs text-[#45464d] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pravaah. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-[#0058be]">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/docs" className="hover:underline">Documentation</Link>
            <Link to="/dashboard" className="hover:underline">Command Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
