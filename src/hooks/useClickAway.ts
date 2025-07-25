import { useEffect } from 'react';

function useClickAway(ref: any, onOutsideClickCallback: () => void) {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      onOutsideClickCallback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}

export default useClickAway;
