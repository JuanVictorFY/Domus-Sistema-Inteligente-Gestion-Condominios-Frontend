const EmptyState = ({ icon = 'bi-inbox', title = 'Sin resultados', description, action }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
    <i className={`bi ${icon} text-secondary`} style={{ fontSize: '3.5rem' }}></i>
    <h5 className="text-white mt-3 mb-1">{title}</h5>
    {description && <p className="text-secondary mb-3" style={{ maxWidth: 340 }}>{description}</p>}
    {action && (
      <button className="btn btn-outline-info btn-sm" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
