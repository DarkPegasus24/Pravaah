import React from 'react';

const cardVariants = {
  default: 'bg-white border border-neutral-200 text-black shadow-sm',
  elevated: 'bg-white border border-neutral-300 text-black shadow-md',
  interactive:
    'bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black text-black transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5',
  glass:
    'bg-white/95 backdrop-blur-md border border-neutral-200 text-black shadow-sm',
  flat: 'bg-neutral-50 border border-neutral-200 text-black',
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
      className={`px-6 py-5 border-b border-neutral-200 flex flex-col gap-1.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as: Component = 'h3', ...props }) {
  return (
    <Component
      className={`text-lg font-semibold tracking-tight text-black ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-neutral-500 leading-relaxed ${className}`} {...props}>
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
      className={`px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
