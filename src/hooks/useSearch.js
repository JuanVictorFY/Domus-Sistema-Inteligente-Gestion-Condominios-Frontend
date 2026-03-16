import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce.js';

export const useSearch = (items, keys, delay = 300) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    const q = debouncedQuery.toLowerCase();
    return items.filter((item) =>
      keys.some((key) => {
        const val = key.split('.').reduce((obj, k) => obj?.[k], item);
        return String(val ?? '').toLowerCase().includes(q);
      })
    );
  }, [items, keys, debouncedQuery]);

  return { query, setQuery, filtered };
};
