const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Paginación">
      <ul className="pagination pagination-sm justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link bg-dark border-secondary text-secondary" onClick={() => onPageChange(page - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </li>
        {start > 1 && (
          <>
            <li className="page-item"><button className="page-link bg-dark border-secondary text-secondary" onClick={() => onPageChange(1)}>1</button></li>
            {start > 2 && <li className="page-item disabled"><span className="page-link bg-dark border-secondary text-secondary">…</span></li>}
          </>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link bg-dark border-secondary" style={p === page ? { background: '#0dcaf0', borderColor: '#0dcaf0', color: '#000' } : { color: '#94a3b8' }} onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <li className="page-item disabled"><span className="page-link bg-dark border-secondary text-secondary">…</span></li>}
            <li className="page-item"><button className="page-link bg-dark border-secondary text-secondary" onClick={() => onPageChange(totalPages)}>{totalPages}</button></li>
          </>
        )}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link bg-dark border-secondary text-secondary" onClick={() => onPageChange(page + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
