import React, { useRef, useState, useEffect } from 'react';

/**
 * Ultra-smooth, slow cinematic scroll reveal component with
 * luxurious easing curve, soft blur-fade, and slow-motion glide.
 */
export function RevealOnScroll({
  children,
  className = '',
  threshold = 0.05,
  delay = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
  duration = 1600, // Luxurious slow duration (1.6s)
  blur = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate3d(0, 50px, 0) scale(0.96)';
      case 'down':
        return 'translate3d(0, -50px, 0) scale(0.96)';
      case 'left':
        return 'translate3d(50px, 0, 0)';
      case 'right':
        return 'translate3d(-50px, 0, 0)';
      case 'scale':
        return 'translate3d(0, 30px, 0) scale(0.92)';
      case 'none':
        return 'none';
      default:
        return 'translate3d(0, 50px, 0) scale(0.96)';
    }
  };

  const dynamicStyles = {
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth slow-motion deceleration
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialTransform(),
    filter: blur ? (isVisible ? 'blur(0px)' : 'blur(10px)') : 'none',
    willChange: 'opacity, transform, filter',
  };

  return (
    <div ref={ref} style={dynamicStyles} className={className}>
      {children}
    </div>
  );
}

export default RevealOnScroll;
