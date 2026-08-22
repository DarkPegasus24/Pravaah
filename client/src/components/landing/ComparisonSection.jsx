import React from 'react';
import { XCircle, CheckCircle2, ArrowRight, Bot, Zap, Sparkles } from 'lucide-react';
import { Badge } from '../ui';

const COMPARISON_ROWS = [
  {
    feature: 'Core Objective',
    traditional: 'Generate a text response to customer questions',
    pravaah: 'Move the underlying business workflow to completion automatically',
  },
  {
    feature: 'Lifecycle Scope',
    traditional: 'Ends immediately after answering ("Dead End")',
    pravaah: 'Continues across CRM qualification, booking, docs, and follow-ups',
  },
  {
    feature: 'Lead Management',
    traditional: 'Requires human staff to manually copy chat notes into CRM',
    pravaah: 'Autonomously creates lead, calculates 0-100 BANT score & syncs stage',
  },
  {
    feature: 'Meeting Scheduling',
    traditional: 'Sends a passive link and hopes the customer clicks it',
    pravaah: 'Proactively finds slot, creates calendar invite, and prepares briefing note',
  },
  {
    feature: 'Document Handling',
    traditional: 'Treats files as static attachments with no comprehension',
    pravaah: 'Extracts contracts/invoices, validates values, and advances deal stage',
  },
  {
    feature: 'Audit & Transparency',
    traditional: 'Black-box response generator with zero execution logs',
    pravaah: 'Complete Flow Activity telemetry with step diffs and flow replay',
  },
];

export function ComparisonSection() {
  return (
    <section className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="secondary" dot size="sm" className="mb-3 border-neutral-300">
            The Paradigm Shift
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Traditional AI Stops. Pravaah Continues.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Discover why simple conversational chatbots fail B2B operations and how Pravaah's continuous flow architecture transforms customer interactions into revenue.
          </p>
        </div>

        {/* Visual Comparison Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Traditional Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#f8f9ff] border border-[#dce9ff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-bold text-base text-[#45464d]">
                  Traditional AI Assistant
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-semibold">
                  Dead End Model
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#dce9ff] flex flex-col gap-2 font-mono text-xs text-[#45464d] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#76777d]">1.</span>
                  <span>Customer asks question</span>
                </div>
                <div className="text-[#c6c6cd] pl-4">↓</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#76777d]">2.</span>
                  <span>AI generates text response</span>
                </div>
                <div className="text-[#c6c6cd] pl-4">↓</div>
                <div className="flex items-center gap-2 text-[#ba1a1a] font-bold">
                  <span className="text-[#ba1a1a]">3.</span>
                  <span>[ END OF WORKFLOW ]</span>
                </div>
              </div>

              <p className="text-xs text-[#45464d] leading-relaxed">
                Result: Leads fall through the cracks, manual data entry is still required, and no business tools are updated.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#dce9ff] flex items-center gap-2 text-xs text-[#ba1a1a] font-medium">
              <XCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
              <span>Stops after answering</span>
            </div>
          </div>

          {/* Pravaah Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0b1c30] text-white border border-[#131b2e] shadow-[0_20px_40px_-15px_rgba(0,88,190,0.25)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2170e4]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2170e4]" />
                  Pravaah Autonomous Flow
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#89f5e7] text-[#00201d] text-xs font-bold">
                  Continuous Flow
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#213145] flex flex-col gap-2 font-mono text-xs text-[#adc6ff] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#7c839b]">1.</span>
                  <span>Customer conversation received</span>
                </div>
                <div className="text-[#7c839b] pl-4">↓</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7c839b]">2.</span>
                  <span>Pravaah extracts context & BANT</span>
                </div>
                <div className="text-[#7c839b] pl-4">↓</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7c839b]">3.</span>
                  <span>Creates Lead & books meeting</span>
                </div>
                <div className="text-[#7c839b] pl-4">↓</div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="text-[#89f5e7]">4.</span>
                  <span>Workflow continues automatically</span>
                </div>
              </div>

              <p className="text-xs text-[#adc6ff] leading-relaxed">
                Result: 100% automated lifecycle execution. Zero manual data entry. Deals progress continuously.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#213145] flex items-center gap-2 text-xs text-[#89f5e7] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0" />
              <span>Moves business actions forward autonomously</span>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl border border-[#e5eeff] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#f8f9ff] border-b border-[#e5eeff] text-[#0b1c30]">
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider">
                    Workflow Dimension
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-[#45464d]">
                    Traditional Conversational AI
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs uppercase tracking-wider text-[#0058be] bg-[#eff4ff]/60">
                    Pravaah Continuous Engine
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eeff] bg-white">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f8f9ff]/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#0b1c30]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-[#45464d]">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#0b1c30] bg-[#eff4ff]/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0c9488] shrink-0 mt-0.5" />
                        <span>{row.pravaah}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonSection;
