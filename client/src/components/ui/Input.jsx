import React, { forwardRef } from 'react';

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-3.5 py-2 text-sm rounded-lg',
  lg: 'px-4 py-2.5 text-base rounded-xl',
};

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    startIcon,
    endIcon,
    size = 'md',
    disabled = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-neutral-700 select-none flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {startIcon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none text-neutral-400">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-white text-black placeholder:text-neutral-400 border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
            error
              ? 'border-black focus:border-black focus:ring-black/20'
              : 'border-neutral-300 hover:border-neutral-500 focus:border-black focus:ring-black/15'
          } ${sizeClasses[size] || sizeClasses.md} ${
            startIcon ? 'pl-9' : ''
          } ${endIcon ? 'pr-9' : ''} ${className}`}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3 flex items-center justify-center text-neutral-400">
            {endIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-neutral-900 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
