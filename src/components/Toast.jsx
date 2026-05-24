import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, show, dismiss };
};

const ICONS = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
const COLORS = { success: '#198754', error: '#dc3545', warning: '#ffc107', info: '#0dcaf0' };

export const ToastContainer = ({ toasts, dismiss }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
    {toasts.map((t) => (
      <div key={t.id} className="d-flex align-items-center gap-2 p-3 rounded shadow" style={{ background: '#1e293b', border: `1px solid ${COLORS[t.type] || COLORS.info}`, color: '#fff', animation: 'slideIn 0.2s ease' }}>
        <i className={`bi ${ICONS[t.type] || ICONS.info}`} style={{ color: COLORS[t.type] || COLORS.info, fontSize: '1.1rem', flexShrink: 0 }}></i>
        <span style={{ fontSize: '0.9rem', flex: 1 }}>{t.message}</span>
        <button onClick={() => dismiss(t.id)} className="btn-close btn-close-white" style={{ fontSize: '0.6rem' }} />
      </div>
    ))}
  </div>
);
