import React from 'react';

const badgeVariants = {
  primary: 'bg-black text-white border-black',
  accent: 'bg-neutral-900 text-white border-black',
  secondary: 'bg-neutral-100 text-neutral-800 border-neutral-300',
  success: 'bg-neutral-100 text-black border-black font-semibold',
  warning: 'bg-neutral-100 text-neutral-800 border-neutral-400',
  danger: 'bg-neutral-200 text-neutral-900 border-neutral-500',
  info: 'bg-neutral-100 text-neutral-900 border-neutral-300',
  outline: 'bg-white text-black border-neutral-400',
};

const dotColors = {
  primary: 'bg-white',
  accent: 'bg-white',
  secondary: 'bg-neutral-600',
  success: 'bg-black',
  warning: 'bg-neutral-700',
  danger: 'bg-neutral-800',
  info: 'bg-neutral-600',
  outline: 'bg-black',
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
