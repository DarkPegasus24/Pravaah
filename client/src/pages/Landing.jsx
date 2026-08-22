import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Play,
  Zap,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  LayoutDashboard,
  PhoneCall,
  BookOpen,
  Layers,
  Cpu,
} from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';
import { PravaahLogo } from '../components/common/PravaahLogo';

// NOTE: The following components may contain simulated / forward-looking demo claims and should be reviewed separately later
import { InteractiveFlowHero } from '../components/landing/InteractiveFlowHero';
import { ArchitectureShowcase } from '../components/landing/ArchitectureShowcase';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { WatchPravaahModal } from '../components/landing/WatchPravaahModal';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('simulator');

  const handleStartFlow = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#0058be] selection:text-white">
      {/* 1. Sticky Navigation Header (Rounded Floating Bar) */}
      <div className="sticky top-3 sm:top-4 z-40 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <header className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl border border-[#dce9ff] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl md:rounded-full px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between pointer-events-auto transition-all">
          {/* Brand Logo with Official Star Graphic */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <PravaahLogo size="sm" showTagline={true} />
          </Link>

          {/* Center Interactive Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#f8f9ff] border border-[#e5eeff]">
            <a
              href="#simulator"
              onClick={() => setActiveNav('simulator')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === 'simulator'
                  ? 'bg-white text-[#0058be] font-bold shadow-xs border border-[#dce9ff]'
                  : 'text-[#45464d] hover:text-[#0058be] hover:bg-white/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#0058be]" />
              <span>Simulator</span>
            </a>

            <a
              href="#architecture"
              onClick={() => setActiveNav('architecture')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === 'architecture'
                  ? 'bg-white text-[#0058be] font-bold shadow-xs border border-[#dce9ff]'
                  : 'text-[#45464d] hover:text-[#0058be] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0058be]" />
              <span>Architecture</span>
            </a>

            <a
              href="#features"
              onClick={() => setActiveNav('features')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === 'features'
                  ? 'bg-white text-[#0058be] font-bold shadow-xs border border-[#dce9ff]'
                  : 'text-[#45464d] hover:text-[#0058be] hover:bg-white/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#0058be]" />
              <span>Features</span>
            </a>

            <a
              href="#comparison"
              onClick={() => setActiveNav('comparison')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === 'comparison'
                  ? 'bg-white text-[#0058be] font-bold shadow-xs border border-[#dce9ff]'
                  : 'text-[#45464d] hover:text-[#0058be] hover:bg-white/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#0058be]" />
              <span>Why Pravaah</span>
            </a>

            <Link
              to="/docs"
              onClick={() => setActiveNav('docs')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === 'docs'
                  ? 'bg-white text-[#0058be] font-bold shadow-xs border border-[#dce9ff]'
                  : 'text-[#45464d] hover:text-[#0058be] hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0058be]" />
              <span>Docs</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-xs text-[#0058be] hover:bg-[#eff4ff] rounded-full px-3.5 flex items-center gap-1.5"
                leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
              >
                Command Center
              </Button>
            </Link>
            {/* Auth flow removed / commented out as per requirement
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs text-[#0b1c30] rounded-full">
                Sign In
              </Button>
            </Link>
            */}
            <Button
              variant="accent"
              size="sm"
              className="rounded-full shadow-xs px-5 text-xs font-bold"
              onClick={handleStartFlow}
            >
              Start Your Flow
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#76777d] hover:text-[#0b1c30] hover:bg-[#eff4ff]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white border border-[#dce9ff] rounded-2xl p-4 flex flex-col gap-1.5 shadow-xl animate-fadeIn pointer-events-auto">
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#eff4ff]"
            >
              <Cpu className="w-4 h-4 text-[#0058be]" />
              <span>Flow Simulator</span>
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#eff4ff]"
            >
              <Layers className="w-4 h-4 text-[#0058be]" />
              <span>Architecture</span>
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#eff4ff]"
            >
              <Zap className="w-4 h-4 text-[#0058be]" />
              <span>Features</span>
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#eff4ff]"
            >
              <TrendingUp className="w-4 h-4 text-[#0058be]" />
              <span>Why Pravaah</span>
            </a>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#eff4ff]"
            >
              <BookOpen className="w-4 h-4 text-[#0058be]" />
              <span>Documentation</span>
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-[#0058be] flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#eff4ff]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Command Center</span>
            </Link>

            <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-2 mt-1">
              {/* Auth flow commented out
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" fullWidth size="sm" className="rounded-full">
                  Log In
                </Button>
              </Link>
              */}
              <Button
                variant="accent"
                fullWidth
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleStartFlow();
                }}
              >
                Start Your Flow
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Hero Section */}
      <section className="relative pt-10 sm:pt-14 md:pt-16 pb-16 md:pb-24 overflow-hidden bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                dot
                pulse
                size="md"
                className="px-3.5 py-1 text-[#004395] font-semibold border-[#d8e2ff]"
              >
                Autonomous AI Agent & Live Conversation Hub
              </Badge>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0b1c30] leading-[1.12]">
              Never Miss a Customer Inquiry Again.
            </h1>

            {/* Sub-headline / Main Value Statement */}
            <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight max-w-3xl">
              Pravaah AI engages your inbound leads, answers questions, and manages conversations automatically in real time.
            </h2>

            {/* Subtext */}
            <p className="mt-4 text-base sm:text-lg text-[#45464d] max-w-2xl font-normal leading-relaxed">
              Provide immediate, intelligent responses to customer inquiries 24/7. Monitor live chat threads, review history, and keep complete control through your centralized business dashboard.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                onClick={handleStartFlow}
                className="w-full sm:w-auto text-base px-8 py-3.5 shadow-[0_4px_14px_rgba(0,88,190,0.25)] rounded-full font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Your Flow
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => setWatchModalOpen(true)}
                className="w-full sm:w-auto text-base px-7 py-3.5 rounded-full font-semibold border-[#dce9ff]"
                leftIcon={<Play className="w-4 h-4 text-[#0058be]" />}
              >
                Watch Pravaah in Action
              </Button>
            </div>

            {/* Honest Trust Points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#45464d] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> 24/7 Real-Time AI Responses
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> Live Conversation Dashboard
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0058be]" /> AI Voice Calls (Coming Soon)
              </span>
            </div>
          </div>

          {/* Interactive Live Flow Simulator (Embedded in Hero) */}
          <div id="simulator" className="mt-14 scroll-mt-24">
            <InteractiveFlowHero onExplorePlatform={handleStartFlow} />
          </div>
        </div>
      </section>

      {/* 4. Architecture Visualizer */}
      <div id="architecture" className="scroll-mt-20">
        <ArchitectureShowcase />
      </div>

      {/* 5. Features Section */}
      <section id="features" className="py-20 bg-white font-sans scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" dot size="sm" className="mb-3 border-[#d8e2ff]">
              Core Capabilities
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
              Built to Handle Customer Inquiries Autonomously
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#45464d] leading-relaxed">
              Pravaah provides real-time conversational intelligence with human oversight, ensuring your business stays responsive around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Conversations & AI Agent (Real) */}
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <MessageSquare className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Autonomous AI Conversations
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Engage inbound customer inquiries with context-aware, intelligent answers in real time. Pravaah operates 24/7 so your leads get immediate assistance without waiting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Real-Time AI Responses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* Feature 2: Centralized Dashboard (Real) */}
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <LayoutDashboard className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Live Conversation Dashboard
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Monitor all active conversations in one unified view. Review message history, inspect customer contacts, and step in anytime with human agent replies.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Full Thread Visibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* Feature 3: Voice Call Answering (In Progress / Coming Soon) */}
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <PhoneCall className="w-5 h-5 text-[#0058be]" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-heading font-bold text-lg text-[#0b1c30]">
                    AI Voice Call Support
                  </h3>
                  <Badge variant="secondary" size="sm">
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  We are developing voice calling capabilities so your AI agent can answer customer phone calls, provide answers, and log call transcripts automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>In Active Development</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* TODO: re-enable when this feature is built
            // Feature 4: Lead Qualification & BANT
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <Sparkles className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  AI Lead Scoring & BANT Analysis
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Automatically score leads from 0 to 100 across Budget, Authority, Need, and Timeline. High-intent opportunities are immediately prioritized for your team.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>0-100 BANT Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            */}

            {/* TODO: re-enable when this feature is built
            // Feature 5: Autonomous Calendar Booking
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <Calendar className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Conflict-Free Meeting Scheduler
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Eliminate back-and-forth emails. Pravaah finds mutual availability, books calendar slots, dispatches Google/Zoom invites, and generates AI meeting prep briefs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Smart Slot Optimization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            */}

            {/* TODO: re-enable when this feature is built
            // Feature 6: Flow Automation Engine
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <Zap className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Business Flow Rules
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Visual rule builder with multi-step triggers, condition branching, and chained next actions. Pre-built templates for Inbound Auto-Pilot and SLA Escalations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Step Chaining Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            */}

            {/* TODO: re-enable when this feature is built
            // Feature 7: Document Intelligence Hub
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <FileText className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Document Intelligence Hub
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Instantly parse invoices, SOWs, and signed contracts. Extract line items, validate payment terms, and automatically advance deal stages into Closed-Won.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Metadata & OCR Extraction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            */}

            {/* TODO: re-enable when this feature is built
            // Feature 8: Operational Command Center
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <TrendingUp className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Operational Command Center
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Real-time flow velocity metrics, bottleneck detection, and high-impact AI recommendations with one-click "Execute Recommendation" flow triggers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>One-Click Action Execution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            */}
          </div>
        </div>
      </section>

      {/* 6. Comparison Section */}
      <div id="comparison" className="scroll-mt-20">
        <ComparisonSection />
      </div>

      {/* 7. Bottom Final Call to Action Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 font-sans bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto bg-[#0b1c30] text-white rounded-3xl border border-[#131b2e] py-16 sm:py-20 px-6 sm:px-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2170e4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Badge variant="accent" size="sm" className="mb-4 bg-[#131b2e] text-[#adc6ff] border-[#213145]">
              Start Managing Inquiries With AI
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ready to Automate Customer Conversations?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#adc6ff] max-w-2xl mx-auto leading-relaxed">
              Deploy Pravaah AI to handle incoming customer messages immediately and manage all interactions from a single command center.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="accent"
                size="lg"
                onClick={handleStartFlow}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-bold bg-[#0058be] hover:bg-[#2170e4] text-white shadow-[0_4px_14px_rgba(0,88,190,0.35)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Your Flow
              </Button>
              <button
                type="button"
                onClick={() => setWatchModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-200 active:scale-[0.98] cursor-pointer backdrop-blur-xs shadow-xs"
              >
                <Play className="w-4 h-4 text-[#89f5e7]" />
                <span>Watch Pravaah in Action</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#adc6ff]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> 24/7 Real-Time Responses
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> Live Conversation Dashboard
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> Complete Oversight & Control
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Global Footer */}
      <footer className="py-12 bg-white border-t border-[#e5eeff] text-xs text-[#45464d] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 flex flex-col gap-3">
              <Link to="/" className="flex items-center">
                <PravaahLogo size="sm" showTagline={true} />
              </Link>
              <p className="text-xs text-[#45464d] max-w-sm leading-relaxed mt-1">
                The AI agent platform that responds to customer inquiries in real time and provides centralized conversation management for modern businesses.
              </p>
            </div>

            <div>
              <span className="font-bold text-[#0b1c30] block mb-3 text-xs uppercase tracking-wider">
                Product
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Command Center
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-[#0058be] transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/conversations" className="hover:text-[#0058be] transition-colors">
                    Live Conversations
                  </Link>
                </li>
                <li>
                  <a href="#simulator" className="hover:text-[#0058be] transition-colors">
                    Flow Simulator
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-[#0058be] transition-colors">
                    Architecture
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0b1c30] block mb-3 text-xs uppercase tracking-wider">
                Quick Access
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Command Center
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/conversations" className="hover:text-[#0058be] transition-colors">
                    Conversations Hub
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-[#0058be] transition-colors">
                    Docs & Guides
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Pravaah. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/docs" className="hover:text-[#0058be] transition-colors">
                Documentation
              </Link>
              <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                Command Center
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Guided Walkthrough Modal */}
      <WatchPravaahModal
        isOpen={watchModalOpen}
        onClose={() => setWatchModalOpen(false)}
        onLaunchCommandCenter={handleStartFlow}
      />
    </div>
  );
}

