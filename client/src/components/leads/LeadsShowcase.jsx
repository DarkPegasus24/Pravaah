import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge, Button } from '../ui';
import { mockLeads } from '../../lib/mockLeads';

export default function LeadsShowcase() {
  const [stage, setStage] = useState('preview');

  useEffect(() => {
    let timer;
    if (stage === 'loading1') {
      timer = setTimeout(() => {
        setStage('stage20');
      }, 3000);
    } else if (stage === 'stage20') {
      timer = setTimeout(() => {
        setStage('loading2');
      }, 1500);
    } else if (stage === 'loading2') {
      timer = setTimeout(() => {
        setStage('stage40');
      }, 1200);
    } else if (stage === 'stage40') {
      timer = setTimeout(() => {
        setStage('loading3');
      }, 1500);
    } else if (stage === 'loading3') {
      timer = setTimeout(() => {
        setStage('stage50');
      }, 1200);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage]);

  // Determine which leads to display based on current stage
  let visibleLeads = [];
  if (stage === 'preview') {
    visibleLeads = mockLeads.slice(0, 4);
  } else if (stage === 'stage20' || stage === 'loading2') {
    visibleLeads = mockLeads.slice(0, 20);
  } else if (stage === 'stage40' || stage === 'loading3') {
    visibleLeads = mockLeads.slice(0, 40);
  } else if (stage === 'stage50') {
    visibleLeads = mockLeads.slice(0, 50);
  }

  const isGridScrollable = stage !== 'preview' && stage !== 'loading1';

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs p-5 sm:p-6 flex flex-col gap-4 animate-fadeIn">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#0b1c30]">
              See What Pravaah Can Capture
            </h2>
            <Badge variant="secondary" size="sm">
              Live Preview
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-[#64748b]">
            Simulated real-time lead capture powered by Pravaah AI across customer conversations.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {stage === 'loading1' ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 animate-fadeIn">
          <Loader2 className="w-6 h-6 text-[#0058be] animate-spin" />
          <span className="text-xs sm:text-sm font-medium text-[#64748b]">
            Analyzing conversations...
          </span>
        </div>
      ) : (
        <div
          className={`grid ${
            stage === 'preview'
              ? 'grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-2 md:grid-cols-4'
          } gap-3 ${
            isGridScrollable ? 'max-h-[420px] overflow-y-auto pr-1' : ''
          }`}
        >
          {visibleLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 flex flex-col justify-between gap-1.5 animate-fadeIn hover:border-slate-300 transition-colors"
            >
              <div>
                <div
                  className="font-bold text-sm text-[#0b1c30] truncate"
                  title={lead.name}
                >
                  {lead.name}
                </div>
                <div className="font-mono text-xs text-slate-600">
                  {lead.mobile}
                </div>
              </div>
              <p
                className="text-xs text-slate-600 line-clamp-2"
                title={lead.query}
              >
                {lead.query}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer / Progression Status */}
      {stage === 'preview' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#e2e8f0]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStage('loading1')}
            >
              Unlock Full Lead Pipeline (46 more)
            </Button>
            <span className="text-xs text-[#64748b]">
              Tap to simulate AI processing your conversations
            </span>
          </div>
        </div>
      )}

      {(stage === 'stage20' || stage === 'stage40') && (
        <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
          <span className="text-xs text-[#64748b] font-medium">
            Loaded {stage === 'stage20' ? '20' : '40'} of 50 leads
          </span>
        </div>
      )}

      {stage === 'loading2' && (
        <div className="flex items-center gap-2 pt-3 border-t border-[#e2e8f0]">
          <Loader2 className="w-3.5 h-3.5 text-[#0058be] animate-spin" />
          <span className="text-xs text-[#64748b] font-medium">
            Finding more leads...
          </span>
        </div>
      )}

      {stage === 'loading3' && (
        <div className="flex items-center gap-2 pt-3 border-t border-[#e2e8f0]">
          <Loader2 className="w-3.5 h-3.5 text-[#0058be] animate-spin" />
          <span className="text-xs text-[#64748b] font-medium">
            Finalizing...
          </span>
        </div>
      )}

      {stage === 'stage50' && (
        <div className="flex items-center pt-3 border-t border-[#e2e8f0]">
          <span className="text-emerald-600 font-semibold text-xs">
            ✓ All 50 leads captured
          </span>
        </div>
      )}
    </div>
  );
}
