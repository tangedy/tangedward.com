import { useEffect, useRef, useState, useMemo } from 'react';

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
    duration = 800,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Add staggered delay based on element index
          const staggeredDelay = index * delay;
          
          setTimeout(() => {
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

// Hook for managing multiple elements with staggered animations
export const useStaggeredContainer = <T extends HTMLElement>(
  elementCount: number,
  options: UseStaggeredFadeInOptions = {}
) => {
  // Create individual refs at the top level
  const ref0 = useRef<T>(null);
  const ref1 = useRef<T>(null);
  const ref2 = useRef<T>(null);
  const ref3 = useRef<T>(null);
  const ref4 = useRef<T>(null);
  const ref5 = useRef<T>(null);
  const ref6 = useRef<T>(null);
  const ref7 = useRef<T>(null);
  const ref8 = useRef<T>(null);
  const ref9 = useRef<T>(null);

  // Create refs array using useMemo to avoid recreating
  const refs = useMemo(() => {
    const allRefs = [ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9];
    return allRefs.slice(0, elementCount);
  }, [elementCount]);

  const [elements, setElements] = useState<Array<{ id: number; ref: React.RefObject<T | null>; isVisible: boolean; animationDelay: number }>>([]);

  useEffect(() => {
    const newElements = refs.map((ref, index) => ({
      id: index,
      ref,
      isVisible: false,
      animationDelay: index * (options.delay || 200),
    }));
    setElements(newElements);
  }, [refs, options.delay]);

  return elements;
}; 