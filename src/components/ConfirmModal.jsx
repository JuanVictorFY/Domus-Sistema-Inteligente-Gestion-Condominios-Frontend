const ConfirmModal = ({ id = 'confirmModal', title = '¿Estás seguro?', message, onConfirm, confirmText = 'Confirmar', variant = 'danger' }) => (
  <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content bg-dark border border-secondary">
        <div className="modal-header border-secondary">
          <h5 className="modal-title text-white">{title}</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
        </div>
        <div className="modal-body text-secondary">
          {message}
        </div>
        <div className="modal-footer border-secondary">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button
            type="button"
            className={`btn btn-${variant}`}
            data-bs-dismiss="modal"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
