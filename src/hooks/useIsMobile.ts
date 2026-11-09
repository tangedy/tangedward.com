import { useSyncExternalStore } from 'react';

/** Matches the breakpoint every stylesheet uses for the phone layout. */
export const MOBILE_QUERY = '(max-width: 820px)';

const getMediaQuery = () => (
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOBILE_QUERY)
    : null
);

const subscribe = (onChange: () => void) => {
  const query = getMediaQuery();
  if (!query) return () => undefined;

  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const getSnapshot = () => getMediaQuery()?.matches ?? false;

/**
 * True on phone-sized screens. Pages use it where the phone layout needs different markup,
 * not just different styles; the desktop markup is what renders when matchMedia is unavailable.
 */
export const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, () => false);
