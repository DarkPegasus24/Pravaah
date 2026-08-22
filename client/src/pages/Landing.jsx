import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import { Button, Badge } from '../components/ui';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
  // TODO: re-enable when building this feature
  // Steps data, Features grid data, and Comparison data are temporarily commented out
  */

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col justify-between">
      {/* 1. Header / Navbar (Compact & Rounded Floating Pill) */}
      <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-5xl mx-auto h-14 px-3 sm:px-5 bg-white/90 backdrop-blur-xl border border-neutral-200 shadow-sm rounded-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base tracking-tight text-black">
                PRAVAAH
              </span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-700">
            <Link to="/dashboard/conversations" className="hover:text-black transition-colors">
              Conversations Demo
            </Link>
            <Link to="/dashboard" className="hover:text-black transition-colors">
              Overview
            </Link>
          </nav>

          {/* Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-xs px-3.5 py-1.5">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="rounded-full text-xs px-4 py-1.5" rightIcon={<ArrowRight className="w-3 h-3" />}>
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-black focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown (Compact Rounded Card) */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-5xl mx-auto mt-2 border border-neutral-200 bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-3 animate-fadeIn">
            <Link
              to="/dashboard/conversations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-neutral-700 hover:text-black py-1"
            >
              Conversations Demo
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-neutral-700 hover:text-black py-1"
            >
              Overview
            </Link>
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" fullWidth size="sm" className="rounded-full">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth size="sm" className="rounded-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-8 sm:pt-12 md:pt-14 pb-16 md:pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge variant="secondary" dot pulse size="md" className="px-3.5 py-1 text-black font-semibold border-neutral-300">
                Where Business Flows on Autopilot
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.12]">
              Turn Inbound Leads into Booked Revenue.{' '}
              <span className="underline decoration-neutral-300 decoration-wavy underline-offset-8">
                24/7 on Autopilot.
              </span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="mt-5 text-lg sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed">
              Pravaah empowers small businesses to instantly capture, qualify, answer questions, and book high-intent meetings without losing deals to slow replies.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 py-3.5 shadow-md rounded-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start 14-Day Free Trial
                </Button>
              </Link>

              <Link to="/dashboard/conversations" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-7 py-3.5 rounded-full">
                  Try Conversations UI
                </Button>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-neutral-600 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> 3-Minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> Omnichannel Ready
              </span>
            </div>

            {/* Hero Live Mockup Box */}
            <div className="mt-10 w-full max-w-4xl">
              <div className="rounded-2xl p-1 bg-neutral-200 border border-neutral-300 shadow-xl">
                <div className="rounded-[15px] bg-white border border-neutral-200 p-6 text-left">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-neutral-300" />
                      <div className="w-3 h-3 rounded-full bg-neutral-400" />
                      <div className="w-3 h-3 rounded-full bg-neutral-500" />
                      <span className="ml-2 text-xs font-mono text-neutral-500">
                        pravaah.ai/conversations
                      </span>
                    </div>
                    <Badge variant="primary" dot pulse size="sm">
                      Live Chat
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-3 font-sans">
                    <div className="self-start max-w-[85%] bg-neutral-100 text-black p-3.5 rounded-2xl rounded-tl-sm border border-neutral-200 text-xs">
                      <span className="font-semibold text-[11px] text-neutral-500 block mb-1">
                        Inbound Customer
                      </span>
                      Hi, can Pravaah handle customer inquiries 24/7 on WhatsApp and our website?
                    </div>

                    <div className="self-end max-w-[85%] bg-neutral-900 text-white p-3.5 rounded-2xl rounded-tr-sm border border-black text-xs">
                      <div className="flex items-center justify-between text-[11px] text-neutral-300 font-semibold mb-1">
                        <span>PRAVAAH AI</span>
                        <span className="text-[10px] text-neutral-400">Instant reply</span>
                      </div>
                      Yes! Pravaah answers questions from your business knowledge, qualifies lead intent, and books calendar appointments directly.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
      // TODO: re-enable when building this feature
      // "How it works" section: 4-step architecture
      // Features grid section: 6 cards
      // Comparison section: Manual vs Pravaah
      // Final CTA Section
      */}
    </div>
  );
}
