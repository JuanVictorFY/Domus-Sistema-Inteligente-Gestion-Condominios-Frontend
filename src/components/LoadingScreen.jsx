const LoadingScreen = ({ message = 'Cargando...' }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '100vh', background: 'var(--bs-dark, #0f172a)' }}
  >
    <div className="spinner-border text-info mb-3" style={{ width: '3rem', height: '3rem' }} role="status" />
    <p className="text-secondary">{message}</p>
  </div>
);

export default LoadingScreen;
