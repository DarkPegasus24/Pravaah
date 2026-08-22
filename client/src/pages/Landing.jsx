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
  ShieldCheck,
  Building2,
  Clock,
  Layers,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';
import { PravaahLogo } from '../components/common/PravaahLogo';
import { InteractiveFlowHero } from '../components/landing/InteractiveFlowHero';
import { ArchitectureShowcase } from '../components/landing/ArchitectureShowcase';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { WatchPravaahModal } from '../components/landing/WatchPravaahModal';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchModalOpen, setWatchModalOpen] = useState(false);

  const handleStartFlow = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#0058be] selection:text-white">
      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#e5eeff] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo with Official Star Graphic */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <PravaahLogo size="sm" showTagline={true} />
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="#simulator"
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] transition-colors"
            >
              Flow Simulator
            </a>
            <a
              href="#architecture"
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] transition-colors"
            >
              5-Stage Architecture
            </a>
            <a
              href="#features"
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] transition-colors"
            >
              Operations Suite
            </a>
            <a
              href="#comparison"
              className="text-xs font-semibold text-[#45464d] hover:text-[#0058be] transition-colors"
            >
              Why Pravaah
            </a>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-[#0058be] hover:text-[#2170e4] flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs text-[#0b1c30]">
                Sign In
              </Button>
            </Link>
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
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#e5eeff] px-4 py-4 flex flex-col gap-3 shadow-lg animate-fadeIn">
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#45464d] hover:text-[#0058be] py-1"
            >
              Flow Simulator
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#45464d] hover:text-[#0058be] py-1"
            >
              5-Stage Architecture
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#45464d] hover:text-[#0058be] py-1"
            >
              Operations Suite
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#45464d] hover:text-[#0058be] py-1"
            >
              Comparison
            </a>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#0058be] py-1"
            >
              Command Center
            </Link>
            <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" fullWidth size="sm" className="rounded-full">
                  Log In
                </Button>
              </Link>
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
      </header>

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
                AI-Powered B2B Business Operations Platform
              </Badge>
            </div>

            {/* Primary Product Message (Exact Specification) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0b1c30] leading-[1.12]">
              Business Doesn’t Stop at Conversations.
            </h1>

            {/* Sub-headline / Main Value Statement */}
            <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight max-w-3xl">
              Pravaah turns customer interactions into intelligent actions and continuous business workflows.
            </h2>

            {/* Subtext */}
            <p className="mt-4 text-base sm:text-lg text-[#45464d] max-w-2xl font-normal leading-relaxed">
              Capture leads, qualify opportunities, schedule meetings, automate follow-ups, process documents, and uncover business insights from one intelligent operations platform.
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

            {/* Trust Points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#45464d] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> 3-Minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0c9488]" /> Omnichannel Ready (WhatsApp, Web, SMS)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0058be]" /> SOC-2 Certified Security
              </span>
            </div>
          </div>

          {/* Interactive Live Flow Simulator (Embedded in Hero) */}
          <div id="simulator" className="mt-14 scroll-mt-24">
            <InteractiveFlowHero onExplorePlatform={handleStartFlow} />
          </div>
        </div>
      </section>


      {/* 4. 5-Stage Architecture Visualizer */}
      <div id="architecture" className="scroll-mt-20">
        <ArchitectureShowcase />
      </div>      {/* 5. The 6 Pillars Operations Suite */}
      <section id="features" className="py-20 bg-white font-sans scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" dot size="sm" className="mb-3 border-[#d8e2ff]">
              Complete Operations Engine
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b1c30]">
              Everything Your Business Needs to Flow
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#45464d] leading-relaxed">
              Pravaah replaces fragmented tools with an intelligent, continuous platform designed to move work forward autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Conversations & AI Agent */}
            <Card variant="interactive" className="p-6 flex flex-col justify-between bg-white border-[#e5eeff] hover:border-[#0058be]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0058be] flex items-center justify-center mb-4 border border-[#d8e2ff]">
                  <MessageSquare className="w-5 h-5 text-[#0058be]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0b1c30] mb-2">
                  Omnichannel Pravaah Agent
                </h3>
                <p className="text-xs text-[#45464d] leading-relaxed">
                  Engage inbound leads across WhatsApp, Web Chat, SMS, and Email. Pravaah listens 24/7, maintains full conversational memory, and extracts deep context.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs font-semibold text-[#0058be]">
                <span>Multi-channel Memory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>

            {/* Feature 2: Lead Qualification & BANT */}
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

            {/* Feature 3: Autonomous Calendar Booking */}
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

            {/* Feature 4: Flow Automation Engine */}
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

            {/* Feature 5: Document Intelligence */}
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

            {/* Feature 6: Operational Insights & Command Center */}
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
          </div>
        </div>
      </section>

      {/* 6. Comparison Section */}
      <div id="comparison" className="scroll-mt-20">
        <ComparisonSection />
      </div>

      {/* 7. Bottom Final Call to Action Banner */}
      <section className="py-20 bg-[#0b1c30] text-white border-t border-[#131b2e] font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2170e4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="accent" size="sm" className="mb-4 bg-[#131b2e] text-[#adc6ff] border-[#213145]">
            Start Moving Work Forward Today
          </Badge>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Where Business Workflows Flow Automatically.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#adc6ff] max-w-2xl mx-auto leading-relaxed">
            Stop letting revenue get blocked by slow manual steps. Deploy Pravaah and convert customer interactions into completed business actions 24/7.
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
            <Button
              variant="outline"
              size="lg"
              onClick={() => setWatchModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-base text-white border-[#213145] hover:bg-[#131b2e] hover:text-white"
              leftIcon={<Play className="w-4 h-4 text-[#2170e4]" />}
            >
              Watch Pravaah in Action
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#adc6ff]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> Free 14-Day Full Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> Zero Integration Friction
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#89f5e7]" /> Cancel Anytime
            </span>
          </div>
        </div>
      </section>

      {/* 8. Global Footer */}
      <footer className="py-12 bg-white border-t border-[#e5eeff] text-xs text-[#45464d] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 flex flex-col gap-3">
              <Link to="/" className="flex items-center">
                <PravaahLogo size="sm" showTagline={true} />
              </Link>
              <p className="text-xs text-[#45464d] max-w-sm leading-relaxed mt-1">
                The AI-powered B2B business operations platform that converts customer conversations into intelligent actions and continuous workflows.
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#76777d]">
                <ShieldCheck className="w-4 h-4 text-[#0058be]" />
                <span>SOC-2 Certified & GDPR Compliant</span>
              </div>
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
                  <Link to="/dashboard/conversations" className="hover:text-[#0058be] transition-colors">
                    Conversations
                  </Link>
                </li>
                <li>
                  <a href="#simulator" className="hover:text-[#0058be] transition-colors">
                    Flow Simulator
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-[#0058be] transition-colors">
                    5-Stage Architecture
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0b1c30] block mb-3 text-xs uppercase tracking-wider">
                Platform
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Lead Radar
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Meeting Scheduler
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Flow Rules Builder
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#0058be] transition-colors">
                    Document Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#0b1c30] block mb-3 text-xs uppercase tracking-wider">
                Company & Trust
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/login" className="hover:text-[#0058be] transition-colors">
                    Enterprise Security
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#0058be] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#0058be] transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#0058be] transition-colors">
                    System Status (100%)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Pravaah Technologies Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-[#0058be] transition-colors">
                Privacy
              </Link>
              <Link to="/login" className="hover:text-[#0058be] transition-colors">
                Terms
              </Link>
              <Link to="/login" className="hover:text-[#0058be] transition-colors">
                Security
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
