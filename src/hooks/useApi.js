import { useState, useCallback } from 'react';

export const useApi = (apiFn) => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result.data ?? result);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = () => { setData(null); setError(null); };

  return { data, loading, error, execute, reset };
};
