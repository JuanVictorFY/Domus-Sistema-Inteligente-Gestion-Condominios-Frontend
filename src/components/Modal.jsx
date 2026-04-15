import { useEffect } from 'react';

const Modal = ({ show, onClose, title, children, footer, size = '', centered = true }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div
        className={`modal-dialog ${size ? `modal-${size}` : ''} ${centered ? 'modal-dialog-centered' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark border-secondary text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer border-secondary">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
