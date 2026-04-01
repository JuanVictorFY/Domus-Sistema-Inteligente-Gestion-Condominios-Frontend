const VARIANTS = {
  success: { icon: 'bi-check-circle-fill', bg: 'rgba(25,135,84,0.15)', border: '#198754' },
  error:   { icon: 'bi-x-circle-fill',     bg: 'rgba(220,53,69,0.15)',  border: '#dc3545' },
  warning: { icon: 'bi-exclamation-triangle-fill', bg: 'rgba(255,193,7,0.15)', border: '#ffc107' },
  info:    { icon: 'bi-info-circle-fill',   bg: 'rgba(13,202,240,0.15)', border: '#0dcaf0' },
};

const Alert = ({ type = 'info', message, onClose }) => {
  const v = VARIANTS[type] || VARIANTS.info;
  if (!message) return null;
  return (
    <div
      className="d-flex align-items-start gap-2 p-3 rounded mb-3"
      style={{ background: v.bg, border: `1px solid ${v.border}` }}
    >
      <i className={`bi ${v.icon}`} style={{ color: v.border, flexShrink: 0, marginTop: 2 }}></i>
      <span className="text-white flex-grow-1" style={{ fontSize: '0.9rem' }}>{message}</span>
      {onClose && (
        <button onClick={onClose} className="btn-close btn-close-white" style={{ fontSize: '0.6rem' }} />
      )}
    </div>
  );
};

export default Alert;
