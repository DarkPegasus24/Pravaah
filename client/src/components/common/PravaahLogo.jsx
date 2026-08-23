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
    xs: { img: 'w-7 h-7', text: 'text-sm', tag: 'text-[7.5px]', gap: 'gap-2' },
    sm: { img: 'w-9 h-9', text: 'text-[17px]', tag: 'text-[8.5px]', gap: 'gap-2.5' },
    md: { img: 'w-11 h-11', text: 'text-lg', tag: 'text-[9.5px]', gap: 'gap-3' },
    lg: { img: 'w-13 h-13', text: 'text-xl', tag: 'text-[10.5px]', gap: 'gap-3.5' },
    xl: { img: 'w-16 h-16', text: 'text-2xl', tag: 'text-[12px]', gap: 'gap-4' },
  }[size] || { img: 'w-9 h-9', text: 'text-[17px]', tag: 'text-[8.5px]', gap: 'gap-2.5' };

  if (iconOnly) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={pravaahLogoImg}
          alt="Pravaah Icon"
          className={`${dimensions.img} object-contain`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none group ${className}`}>
      {/* Clean Logo Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={pravaahLogoImg}
          alt="Pravaah Logo"
          className={`${dimensions.img} object-contain group-hover:scale-105 transition-transform duration-200`}
        />
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
