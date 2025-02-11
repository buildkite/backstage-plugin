import { useState, useEffect } from 'react';
import parseEmoji, { EMOJI_CATALOGUES } from './parse-emoji';

export const useEmoji = () => {
  const [isLoaded, setIsLoaded] = useState(EMOJI_CATALOGUES.length > 0);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  return {
    parse: parseEmoji,
    isLoaded,
  };
};
