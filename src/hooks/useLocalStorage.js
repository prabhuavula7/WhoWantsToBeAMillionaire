import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  const namespacedKey = `millionaire_${key}`;
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(namespacedKey);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (e) {
      console.error('useLocalStorage read error', e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(namespacedKey, JSON.stringify(state));
    } catch (e) {
      console.error('useLocalStorage write error', e);
    }
  }, [namespacedKey, state]);

  return [state, setState];
}
