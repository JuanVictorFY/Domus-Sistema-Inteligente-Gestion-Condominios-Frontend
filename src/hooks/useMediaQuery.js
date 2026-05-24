import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const useBreakpoint = () => ({
  isMobile:  useMediaQuery('(max-width: 575px)'),
  isTablet:  useMediaQuery('(min-width: 576px) and (max-width: 991px)'),
  isDesktop: useMediaQuery('(min-width: 992px)'),
  isLarge:   useMediaQuery('(min-width: 1200px)'),
});
