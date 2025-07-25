import { useEffect, useState } from 'react';

function useTouchScreenDetect() {
  const isSSR = typeof window === 'undefined',
    [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (!isSSR) {
      setIsTouchDevice('ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0);
    }
  }, [isTouchDevice, isSSR]);

  return { isTouchDevice };
}

export default useTouchScreenDetect;
