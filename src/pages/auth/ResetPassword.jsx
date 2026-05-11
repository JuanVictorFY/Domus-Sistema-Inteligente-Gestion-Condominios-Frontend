import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setError('Enlace inválido o sin token de seguridad.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/users/reset-password', { 
        token, 
        newPassword: password 
      });
      setSuccessMsg(response.data.message + '. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error al restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 position-relative" style={{ background: '#020617' }}>
      <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.05) 0%, transparent 50%)', zIndex: 0 }}></div>
      
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5" data-aos="zoom-in">
            <div className="card border-0 p-4 p-md-5 shadow-lg" style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '24px' }}>
              
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '18px', transform: 'rotate(45deg)' }}>
                  <i className="bi bi-shield-lock-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '2.2rem' }}></i>
                </div>
                <h3 className="fw-bold text-white mb-2">Crear Nueva Contraseña</h3>
                <p className="text-white-50">Ingresa tu nueva credencial de acceso</p>
              </div>

              {error && <div className="alert alert-danger bg-transparent border-danger text-danger text-center small py-2 mb-4 rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i> {error}</div>}
              {successMsg && <div className="alert alert-success bg-transparent border-success text-success text-center small py-2 mb-4 rounded-3"><i className="bi bi-check-circle-fill me-2"></i> {successMsg}</div>}

              <form onSubmit={handleReset}>
                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-bold text-uppercase">Nueva Contraseña</label>
                  <input type="password" required className="form-control text-white shadow-none py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={successMsg !== ''} />
                </div>
                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-bold text-uppercase">Confirmar Contraseña</label>
                  <input type="password" required className="form-control text-white shadow-none py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={successMsg !== ''} />
                </div>
                <button type="submit" className="btn btn-premium-unique text-white w-100 py-3 rounded-pill fw-bold mb-2 mt-2 d-flex justify-content-center align-items-center" disabled={isLoading || successMsg !== ''}>
                  {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span> Guardando...</> : 'ACTUALIZAR CONTRASEÑA'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
// Success state
