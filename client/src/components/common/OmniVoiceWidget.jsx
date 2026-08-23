import React, { useEffect } from 'react';
import { Mic, Sparkles } from 'lucide-react';

export default function OmniVoiceWidget() {
  useEffect(() => {
    // Hide OmniDimension's default launcher button if injected
    const hideDefaultLauncher = () => {
      // Find all elements that might be the default launcher
      const selectors = [
        '#omnidimension-launcher-wrapper',
        '#omnidim-widget-launcher',
        '#omnidimension-widget-button',
        '#omnidim-launcher',
        '[id*="launcher"]',
        '[class*="launcher"]',
        '[id*="omnidim-btn"]',
        '[id*="omni-widget-btn"]:not(#omni-open-widget-btn)',
      ];

      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (el.id !== 'omni-open-widget-btn') {
            el.style.setProperty('display', 'none', 'important');
          }
        });
      });

      // Also find any button/div with text 'OmniDimension Agent'
      const allElements = document.querySelectorAll('button, div, span, a');
      allElements.forEach((el) => {
        if (
          el.id !== 'omni-open-widget-btn' &&
          !el.closest('#omni-open-widget-btn') &&
          el.textContent &&
          el.textContent.trim().toLowerCase().includes('omnidimension agent')
        ) {
          // Find the top-most container
          let target = el;
          while (
            target.parentElement &&
            target.parentElement !== document.body &&
            target.parentElement.id !== 'root'
          ) {
            target = target.parentElement;
          }
          target.style.setProperty('display', 'none', 'important');
        }
      });
    };

    hideDefaultLauncher();
    const interval = setInterval(hideDefaultLauncher, 500);

    const observer = new MutationObserver(hideDefaultLauncher);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* OmniDimension Voice Call Trigger Button */}
      <button
        id="omni-open-widget-btn"
        type="button"
        className="flex items-center gap-3 px-5 py-3 bg-[#0058be] hover:bg-[#0047a0] text-white rounded-full shadow-[0_4px_16px_rgba(0,88,190,0.25)] hover:shadow-[0_6px_20px_rgba(0,88,190,0.35)] transition-all duration-200 cursor-pointer border border-white/20"
        title="Talk to Voice Agent"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
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
  );
}
