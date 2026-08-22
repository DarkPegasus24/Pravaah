import React from 'react';

const variantClasses = {
  primary:
    'bg-[#000000] text-white font-semibold hover:bg-[#131b2e] hover:shadow-md border border-black transition-all duration-200 active:scale-[0.98] shadow-xs',
  secondary:
    'bg-white hover:bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff] hover:border-[#0058be] hover:text-[#0058be] transition-all duration-200 active:scale-[0.98] shadow-xs',
  outline:
    'bg-transparent hover:bg-[#eff4ff] text-[#0058be] border border-[#0058be] transition-all duration-200 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] transition-all duration-200 active:scale-[0.98]',
  danger:
    'bg-[#ffdad6] hover:bg-[#ba1a1a] text-[#93000a] hover:text-white font-semibold transition-all duration-200 active:scale-[0.98] border border-[#ffb4ab]',
  accent:
    'bg-[#0058be] hover:bg-[#2170e4] text-white font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-[0_4px_14px_rgba(0,88,190,0.25)] border border-[#0058be]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="inline-flex shrink-0 items-center justify-center">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">{rightIcon}</span>
      )}
    </button>
  );
}

export default Button;
