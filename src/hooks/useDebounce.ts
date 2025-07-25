import debounce from 'lodash/debounce';
import { useEffect, useRef } from 'react';

function useDebounce(callback: any, delay: number) {
  const debouncedFn = useRef(debounce(callback, delay));

  useEffect(() => {
    debouncedFn.current = debounce(callback, delay);
  }, [delay, callback]);

  return debouncedFn.current;
}

export default useDebounce;
