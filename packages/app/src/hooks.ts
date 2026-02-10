'use client';

import { useEffect, useMemo, useState } from 'react';
import { ERROR_CODE } from './';

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}

export function useErrorCode(code: string | null | undefined) {
  return useMemo(() => {
    if (!code) return null;

    const normalized = String(Number(code));

    return ERROR_CODE[normalized] ?? null;
  }, [code]);
}
