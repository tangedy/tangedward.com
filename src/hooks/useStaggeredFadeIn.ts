import { useEffect, useRef, useState } from 'react';

interface UseStaggeredFadeInOptions {
  delay?: number; // Delay between each element animation
  duration?: number; // Duration of each fade-in animation
  threshold?: number; // Intersection observer threshold
  rootMargin?: string; // Intersection observer root margin
}

interface UseStaggeredFadeInReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
  animationDelay: number;
}

export const useStaggeredFadeIn = <T extends HTMLElement>(
  index: number,
  options: UseStaggeredFadeInOptions = {}
): UseStaggeredFadeInReturn<T> => {
  const {
    delay = 200,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Add staggered delay based on element index
          const staggeredDelay = index * delay;
          
          timeoutId = setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, staggeredDelay);

          // Stop observing after animation
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [index, delay, threshold, rootMargin, hasAnimated]);

  // Calculate animation delay for CSS
  const animationDelay = index * delay;

  return {
    ref,
    isVisible,
    animationDelay,
  };
};
