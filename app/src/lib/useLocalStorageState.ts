import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

function readValue<T>(key: string, initialValue: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorageState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => readValue(key, initialValue));

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setState((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // storage unavailable or full — state still updates in memory for this session
        }
        return next;
      });
    },
    [key],
  );

  return [state, setValue];
}
