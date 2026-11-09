import { useCallback, useState } from 'react';

/**
 * Tracks whether an <img> has finished loading, including images already in the cache
 * (those can finish before React attaches onLoad). Key the component that uses it by
 * image, so a new image always starts from a fresh, unloaded state.
 */
export const useImageLoaded = () => {
  const [loaded, setLoaded] = useState(false);

  const ref = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return { loaded, ref, onLoad: () => setLoaded(true) };
};
