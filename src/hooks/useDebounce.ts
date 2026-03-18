import debounce from 'lodash/debounce';
import { useMemo } from 'react';

function useDebounce(callback: any, delay: number) {
  return useMemo(() => debounce(callback, delay), [delay, callback]);
}

export default useDebounce;
