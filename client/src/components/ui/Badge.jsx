import React from 'react';

const badgeVariants = {
  primary: 'bg-[#000000] text-white border-black shadow-xs',
  accent: 'bg-[#0058be] text-white border-[#0058be] shadow-xs',
  secondary: 'bg-[#eff4ff] text-[#004395] border-[#d8e2ff]',
  success: 'bg-[#e6fcf8] text-[#005049] border-[#89f5e7] font-semibold',
  warning: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]',
  danger: 'bg-[#ffdad6] text-[#93000a] border-[#ffb4ab] font-semibold',
  info: 'bg-[#e5eeff] text-[#0058be] border-[#dce9ff]',
  outline: 'bg-white text-[#0b1c30] border-[#dce9ff]',
};

const dotColors = {
  primary: 'bg-white',
  accent: 'bg-white',
  secondary: 'bg-[#0058be]',
  success: 'bg-[#0c9488]',
  warning: 'bg-[#d97706]',
  danger: 'bg-[#ba1a1a]',
  info: 'bg-[#0058be]',
  outline: 'bg-[#0b1c30]',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  dot = false,
  pulse = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center justify-center font-medium font-sans rounded-full border transition-colors select-none ${
        badgeVariants[variant] || badgeVariants.primary
      } ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dotColors[variant] || 'bg-black'
              }`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              dotColors[variant] || 'bg-black'
            }`}
          />
        </span>
      )}

      {icon && <span className="inline-flex shrink-0">{icon}</span>}

      <span>{children}</span>
    </span>
  );
}

export default Badge;
