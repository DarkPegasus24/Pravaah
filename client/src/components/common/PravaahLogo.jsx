import React from 'react';
import pravaahLogoImg from '../../assets/pravaah-logo.png';

export function PravaahLogo({
  size = 'md',
  showTagline = false,
  variant = 'dark', // 'dark' (for white bg) or 'light' (for black bg) or 'image'
  iconOnly = false,
  className = '',
}) {
  // Size dimensions
  const dimensions = {
    xs: { img: 'w-6 h-6', text: 'text-sm', tag: 'text-[7px]', gap: 'gap-1.5' },
    sm: { img: 'w-7 h-7', text: 'text-base', tag: 'text-[8px]', gap: 'gap-2' },
    md: { img: 'w-8 h-8', text: 'text-lg', tag: 'text-[9px]', gap: 'gap-2.5' },
    lg: { img: 'w-10 h-10', text: 'text-xl', tag: 'text-[10px]', gap: 'gap-3' },
    xl: { img: 'w-12 h-12', text: 'text-2xl', tag: 'text-[11px]', gap: 'gap-3.5' },
  }[size] || { img: 'w-8 h-8', text: 'text-lg', tag: 'text-[9px]', gap: 'gap-2.5' };

  if (iconOnly) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={pravaahLogoImg}
          alt="Pravaah Icon"
          className={`${dimensions.img} rounded-xl object-contain shadow-xs`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none group ${className}`}>
      {/* Dynamic Star/Comet Logo Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-8.5 h-8.5 rounded-xl bg-black flex items-center justify-center overflow-hidden shadow-sm p-0.5 group-hover:scale-105 transition-transform duration-200">
          <img
            src={pravaahLogoImg}
            alt="Pravaah Logo"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Typography: Wordmark + Optional Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-heading font-black tracking-[-0.03em] ${dimensions.text} ${
              variant === 'light' ? 'text-white' : 'text-black'
            }`}
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            Pravaah
          </span>
          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
            AI
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-mono font-bold tracking-[0.18em] uppercase ${dimensions.tag} text-blue-600 mt-1`}
          >
            Flow. Grow. Succeed.
          </span>
        )}
      </div>
    </div>
  );
}

export default PravaahLogo;
