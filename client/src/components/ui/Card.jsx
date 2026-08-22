import React from 'react';

const cardVariants = {
  default: 'bg-white border border-[#e5eeff] text-[#0b1c30] shadow-[0_1px_3px_rgba(11,28,48,0.05)]',
  elevated: 'bg-white border border-[#dce9ff] text-[#0b1c30] shadow-[0_4px_12px_rgba(11,28,48,0.06)]',
  interactive:
    'bg-white hover:bg-[#f8f9ff] border border-[#e5eeff] hover:border-[#0058be] text-[#0b1c30] transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(11,28,48,0.05)] hover:shadow-[0_10px_20px_-3px_rgba(0,88,190,0.08)] hover:-translate-y-0.5',
  glass:
    'bg-white/95 backdrop-blur-md border border-[#dce9ff] text-[#0b1c30] shadow-[0_1px_3px_rgba(11,28,48,0.05)]',
  flat: 'bg-[#f8f9ff] border border-[#e5eeff] text-[#0b1c30]',
};

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all ${
        cardVariants[variant] || cardVariants.default
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-5 border-b border-[#e5eeff] bg-[#f8f9ff]/50 flex flex-col gap-1.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as: Component = 'h3', ...props }) {
  return (
    <Component
      className={`text-lg font-bold tracking-tight text-[#0b1c30] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-[#45464d] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
