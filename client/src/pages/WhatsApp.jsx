import React from 'react';
import {
  MessageCircle,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import {
  Badge,
} from '../components/ui';

export default function WhatsApp() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto animate-fadeIn font-sans selection:bg-[#0058be] selection:text-white pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e2e8f0]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              WhatsApp
            </h1>
            <Badge variant="secondary" size="sm" className="font-medium text-xs">
              Messaging Channel
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748b]">
            Let customers message your business on WhatsApp — your AI agent will reply automatically, just like on Email and Calling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-xs font-medium text-[#334155] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Channel: In Development</span>
          </div>
        </div>
      </div>

      {/* 2. Channel Status & Placeholder Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden p-6 sm:p-7 flex flex-col gap-5 transition-all">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-[#0b1c30] flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block">
                WhatsApp Business Cloud Line
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#0b1c30] tracking-tight">
                Meta Business Integration
              </span>
            </div>
          </div>

          <Badge variant="warning" size="sm" className="font-semibold shadow-xs">
            Not Connected Yet
          </Badge>
        </div>

        {/* Informational Notice */}
        <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Integration currently in development</p>
            <p className="mt-0.5 text-[#b45309]">
              WhatsApp integration requires a Meta Business account and phone number verification. This channel isn't live yet — check back soon.
            </p>
          </div>
        </div>

        {/* Assigned WhatsApp Number Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#64748b]">Assigned WhatsApp Number</label>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl select-none">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#0b1c30] font-semibold">
              <MessageCircle className="w-4 h-4 text-slate-600" />
              <span>+91 9413973399</span>
            </div>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
              Pending Activation
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent WhatsApp Conversations (Static Empty State) */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Section Header */}
        <div className="px-5 py-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e2e8f0] text-[#334155] flex items-center justify-center shrink-0 shadow-xs">
              <Inbox className="w-4 h-4 text-[#0b1c30]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30]">
                Recent WhatsApp Conversations
              </h2>
              <p className="text-[11px] text-[#64748b]">
                Inbound customer WhatsApp chats and AI replies
              </p>
            </div>
          </div>
        </div>

        {/* Section Body (Static Empty State) */}
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-xs">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <div className="max-w-md">
            <h3 className="font-heading font-bold text-sm text-[#0b1c30]">
              No conversations yet
            </h3>
            <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
              Once WhatsApp is connected, incoming customer messages will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
