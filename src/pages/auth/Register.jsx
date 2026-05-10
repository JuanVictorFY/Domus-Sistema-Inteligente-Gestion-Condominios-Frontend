import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validar campos
    if (!email || !name) {
      setError('Por favor, completa todos los campos.');
      setIsLoading(false);
      return;
    }

    // Mapear el rol visual al rol del backend
    let backendRole = 'RESIDENTE';
    if (selectedRole === 'Administrador') backendRole = 'ADMIN';
    if (selectedRole === 'Seguridad') backendRole = 'SEGURIDAD';

    try {
      // Llamada al backend para registrar al usuario
      await api.post('/auth/register', {
        name: name,
        email,
        password: 'temp_password',
        depto: 'N/A',
        role: backendRole,
        status: 'PENDIENTE' // Forzamos el estado por seguridad
      });

      setSuccess('¡Registro exitoso! Tu cuenta está pendiente de aprobación por el Administrador.');
      
      // Redirigimos al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3500);

    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.response?.data?.message || "Error al conectar con el servidor.");
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
            <div className="card border-0 p-4 p-md-5 shadow-lg" style={{
              background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '24px'
            }}>
              {!selectedRole ? (
                <>
                  <div className="text-center mb-4 pb-2">
                    <div className="d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" 
                         style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '18px', transform: 'rotate(45deg)' }}>
                      <i className="bi bi-person-plus-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '2.2rem' }}></i>
                    </div>
                    <h3 className="fw-bold text-white mb-2">Solicitar Acceso</h3>
                    <p className="text-white-50">Elige tu perfil para registrarte en Domus</p>
                  </div>
                  <div className="d-grid gap-3">
                    <button className="btn p-3 d-flex align-items-center rounded-4 border border-secondary border-opacity-50 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }} onClick={() => { setSelectedRole('Residente'); setError(''); setSuccess(''); }}>
                      <div className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}><i className="bi bi-house-door-fill fs-4"></i></div>
                      <div className="text-start">
                        <strong className="text-white d-block fs-5">Residente</strong>
                        <small className="text-white-50">Gestiona tu hogar y pagos</small>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-white-50 fs-5"></i>
                    </button>
                    <button className="btn p-3 d-flex align-items-center rounded-4 border border-secondary border-opacity-50 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }} onClick={() => { setSelectedRole('Administrador'); setError(''); setSuccess(''); }}>
                      <div className="rounded-circle bg-info bg-opacity-25 text-info d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}><i className="bi bi-grid-1x2-fill fs-4"></i></div>
                      <div className="text-start">
                        <strong className="text-white d-block fs-5">Administrador</strong>
                        <small className="text-white-50">Panel de control y finanzas</small>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-white-50 fs-5"></i>
                    </button>
                    <button className="btn p-3 d-flex align-items-center rounded-4 border border-secondary border-opacity-50 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }} onClick={() => { setSelectedRole('Seguridad'); setError(''); setSuccess(''); }}>
                      <div className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}><i className="bi bi-shield-shaded fs-4"></i></div>
                      <div className="text-start">
                        <strong className="text-white d-block fs-5">Seguridad</strong>
                        <small className="text-white-50">Control de accesos y CCTV</small>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-white-50 fs-5"></i>
                    </button>
                  </div>
                  <div className="text-center mt-5">
                    <span className="text-white-50">¿Ya tienes una cuenta aprobada? </span>
                    <Link to="/login" className="text-info text-decoration-none fw-bold hover-cyan">Iniciar Sesión</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" 
                         style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '18px', transform: 'rotate(45deg)' }}>
                      <i className={`bi ${selectedRole === 'Administrador' ? 'bi-grid-1x2-fill' : selectedRole === 'Seguridad' ? 'bi-shield-shaded' : 'bi-house-door-fill'} text-white`} style={{ transform: 'rotate(-45deg)', fontSize: '2.2rem' }}></i>
                    </div>
                    <h3 className="fw-bold text-white mb-2">Registro {selectedRole}</h3>
                    <p className="text-white-50">Ingresa tu correo para solicitar acceso</p>
                  </div>

                  {error && <div className="alert alert-danger bg-transparent border-danger text-danger text-center small py-2 mb-4 rounded-3"><i className="bi bi-exclamation-triangle-fill me-2"></i> {error}</div>}
                  {success && <div className="alert alert-success bg-transparent border-success text-success text-center small py-2 mb-4 rounded-3"><i className="bi bi-check-circle-fill me-2"></i> {success}</div>}

                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small fw-bold text-uppercase">{selectedRole === 'Seguridad' ? 'Nombre / Etiqueta *' : 'Nombre Completo *'}</label>
                      <input type="text" required className="form-control text-white shadow-none py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} placeholder={selectedRole === 'Seguridad' ? 'Ej. Agente de Seguridad 1' : selectedRole === 'Administrador' ? 'Ej. Administrador Principal' : 'Ej. Juan Pérez'} value={name} onChange={(e) => { const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, ''); if (val.length <= 50) setName(val); }} disabled={!!success} maxLength={50} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+" title="Solo letras y espacios, máximo 50 caracteres" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white-50 small fw-bold text-uppercase">Correo Electrónico *</label>
                      <input type="email" required className="form-control text-white shadow-none py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="correo@ejemplo.com" value={email} onChange={(e) => { if (e.target.value.length <= 100) setEmail(e.target.value); }} disabled={!!success} maxLength={100} />
                    </div>
                    
                    <button type="submit" className={`btn btn-premium-unique text-white w-100 py-3 rounded-pill fw-bold mb-4 mt-3 d-flex justify-content-center align-items-center ${success ? 'd-none' : ''}`} disabled={isLoading}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Procesando...</> : 'ENVIAR SOLICITUD'}
                    </button>
                    
                    <div className="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
                      <button type="button" className="btn btn-link text-white-50 text-decoration-none small hover-cyan p-0 border-0 shadow-none" onClick={() => { setSelectedRole(null); setError(''); setSuccess(''); setEmail(''); setName(''); }}><i className="bi bi-arrow-left me-1"></i> Cambiar de perfil</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
// Password strength indicator

// Terms checkbox
