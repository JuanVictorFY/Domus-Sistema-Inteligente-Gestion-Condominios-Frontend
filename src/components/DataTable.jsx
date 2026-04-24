import Pagination from './Pagination.jsx';
import EmptyState from './EmptyState.jsx';
import { Spinner } from './Spinner.jsx';

const DataTable = ({ columns, data, loading, page, totalPages, onPageChange, emptyMessage = 'No hay datos disponibles.' }) => {
  if (loading) return <div className="text-center py-5"><Spinner /></div>;

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-secondary mb-0">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-secondary fw-semibold" style={{ fontSize: '0.8rem', textTransform: 'uppercase', ...col.style }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length}><EmptyState title={emptyMessage} /></td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td key={col.key} className="text-white align-middle" style={{ fontSize: '0.9rem' }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-3">
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
