// src/hooks/useClickOutside.js
import { useEffect, useRef } from 'react';

const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [callback]);

  return ref;
};

export default useClickOutside;