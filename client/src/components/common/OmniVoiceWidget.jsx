import React, { useEffect, useState } from 'react';
import { Mic, Sparkles, PhoneCall, Volume2, X } from 'lucide-react';

export default function OmniVoiceWidget() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Only hide external launcher buttons outside of React's #root container
    const hideDefaultLauncher = () => {
      const externalElements = document.querySelectorAll('body > *:not(#root)');
      externalElements.forEach((el) => {
        if (
          el.id?.startsWith('omnidim') ||
          el.id?.startsWith('omnidimension-launcher') ||
          el.className?.toString().includes('omnidim-launcher')
        ) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    };

    hideDefaultLauncher();
    const interval = setInterval(hideDefaultLauncher, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOpenWidget = () => {
    // Check if OmniDimension global object or widget exists
    if (window.OmniDimension && typeof window.OmniDimension.open === 'function') {
      window.OmniDimension.open();
      return;
    }

    // Try finding the external OmniDimension trigger button outside #root
    const externalButtons = document.querySelectorAll('body > *:not(#root) button, body > *:not(#root) a');
    for (const btn of externalButtons) {
      if (
        btn.id?.includes('omnidim') ||
        btn.className?.toString().includes('omnidim') ||
        btn.getAttribute('aria-label')?.toLowerCase().includes('voice')
      ) {
        btn.click();
        return;
      }
    }

    // Otherwise show our built-in voice agent modal
    setModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* OmniDimension Voice Call Trigger Button */}
        <button
          id="omni-open-widget-btn"
          type="button"
          onClick={handleOpenWidget}
          className="flex items-center gap-3 px-5 py-3 bg-[#0058be] hover:bg-[#0047a0] text-white rounded-full shadow-[0_4px_16px_rgba(0,88,190,0.25)] hover:shadow-[0_6px_20px_rgba(0,88,190,0.35)] transition-all duration-200 cursor-pointer border border-white/20 active:scale-95 group"
          title="Talk to Voice Agent"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Mic className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-100 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-blue-200" />
              Live Voice AI
            </span>
            <span className="text-xs font-bold text-white leading-tight">
              Talk to Receptionist
            </span>
          </div>
        </button>
      </div>

      {/* Built-in Voice AI Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#dce9ff] shadow-2xl max-w-md w-full p-6 relative flex flex-col items-center text-center">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#76777d] hover:text-[#0b1c30] p-1.5 rounded-full hover:bg-[#eff4ff] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] flex items-center justify-center mb-4 shadow-xs relative">
              <PhoneCall className="w-7 h-7 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0058be] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0058be]" />
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#0b1c30]">Pravaah Autonomous Voice Agent</h3>
            <p className="text-xs text-[#45464d] mt-1.5 max-w-xs leading-relaxed">
              Real-time conversational voice receptionist powered by OmniDimension & Supabase Knowledge Base.
            </p>

            <div className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-2xl p-4 my-5 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-[#76777d]">
                <span>Status:</span>
                <span className="font-semibold text-[#0c9488] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0c9488] animate-pulse" />
                  Telephony Bridge Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-[#76777d]">
                <span>Inbound Hotline:</span>
                <span className="font-mono font-semibold text-[#0b1c30]">+1 (830) 269-2120</span>
              </div>
              <div className="flex items-center justify-between text-[#76777d]">
                <span>Voice Model:</span>
                <span className="font-semibold text-[#0058be]">OmniDimension WebRTC</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <a
                href="tel:+18302692120"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call +1 (830) 269-2120
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#dce9ff] hover:bg-[#eff4ff] text-[#0b1c30] font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

