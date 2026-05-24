import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3" style={{ background: '#0f172a' }}>
      <h1 style={{ fontSize: '8rem', fontWeight: 800, color: '#00d4ff', lineHeight: 1 }}>404</h1>
      <h2 className="text-white mb-3">Página no encontrada</h2>
      <p className="text-secondary mb-4">La ruta que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">
        Volver al inicio
      </Link>
    </div>
  );
}
