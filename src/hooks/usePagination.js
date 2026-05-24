import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage]       = useState(initialPage);
  const [limit, setLimit]     = useState(initialLimit);
  const [total, setTotal]     = useState(0);

  const totalPages  = Math.max(1, Math.ceil(total / limit));
  const hasNext     = page < totalPages;
  const hasPrev     = page > 1;

  const goToPage    = useCallback((n) => setPage(Math.min(Math.max(1, n), totalPages)), [totalPages]);
  const nextPage    = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const prevPage    = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const changeLimit = useCallback((n) => { setLimit(n); setPage(1); }, []);
  const reset       = useCallback(() => { setPage(initialPage); setLimit(initialLimit); setTotal(0); }, [initialPage, initialLimit]);

  return { page, limit, total, totalPages, hasNext, hasPrev, setTotal, goToPage, nextPage, prevPage, changeLimit, reset };
};
