import { useMemo } from 'react';
import { ERROR_CODE } from '../data';

export function useErrorCode(code: string | null | undefined) {
  return useMemo(() => {
    if (!code) return null;

    const normalized = String(Number(code));

    return ERROR_CODE[normalized] ?? null;
  }, [code]);
}
