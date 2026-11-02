import {useCallback, useEffect, useRef, useState} from 'react';
import {getErrorMessage} from '../services/api';

/** Small react-query stand-in: runs `fn` on mount / when deps change, exposes reload. */
export default function useAsync<T>(fn: () => Promise<T>, deps: any[] = [], enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (mode: 'load' | 'refresh' | 'silent' = 'load') => {
    if (mode === 'load') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    try {
      const result = await fnRef.current();
      if (mounted.current) {
        setData(result);
        setError(null);
      }
      return result;
    } catch (e) {
      if (mounted.current) setError(getErrorMessage(e));
      return null;
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) run('load');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return {
    data,
    setData,
    loading,
    refreshing,
    error,
    reload: () => run('load'),
    refresh: () => run('refresh'),
    silentReload: () => run('silent'),
  };
}
