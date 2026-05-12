import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const { token, user } = response.data;
      localStorage.setItem('domus_token', token);
      localStorage.setItem('domus_user', JSON.stringify(user));

      navigate('/dashboard', { state: { role: user.role, userEmail: user.email, userName: user.name, userDepto: user.depto } }); 
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.response?.data?.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico primero.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/users/forgot-password', { email });
      setSuccessMsg(response.data.message);
    } catch (err) {
      console.error("Error en recuperación:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 position-relative overflow-hidden">
      {/* Background image */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'heroZoom 20s ease-in-out infinite alternate'
      }} />
      {/* Dark overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(135deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.88) 50%, rgba(2,6,23,0.95) 100%)'
      }} />
      {/* Glow orbs */}
      <div className="position-absolute" style={{ top: '20%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 60%)' }}></div>
      <div className="position-absolute" style={{ bottom: '10%', right: '-100px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(0,86,179,0.08) 0%, transparent 60%)' }}></div>
      
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5" data-aos="zoom-in">
            <div className="card border-0 p-4 p-md-5 shadow-lg" style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '24px'
            }}>
              
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-4 shadow-lg" 
                     style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '18px', transform: 'rotate(45deg)' }}>
                  <i className="bi bi-buildings-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '2.2rem' }}></i>
                </div>
                <h3 className="fw-bold text-white mb-2">{isForgot ? 'Recuperar Contraseña' : 'Iniciar Sesión'}</h3>
                <p className="text-white-50">{isForgot ? 'Te enviaremos un enlace de acceso' : 'Ingresa tus credenciales para continuar'}</p>
              </div>

              {/* Alerta de Error */}
              {error && (
                <div className="alert alert-danger bg-transparent border-danger text-danger text-center small py-2 mb-4 rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
              )}

              {/* Alerta de Éxito */}
              {successMsg && (
                <div className="alert alert-success bg-transparent border-success text-success text-center small py-2 mb-4 rounded-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i> {successMsg}
                </div>
              )}

              <form onSubmit={isForgot ? handleForgot : handleLogin}>
                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-bold text-uppercase">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control text-white shadow-none py-3" 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} 
                    placeholder="ejemplo@correo.com" 
                    value={email}
                    onChange={(e) => { if (e.target.value.length <= 100) setEmail(e.target.value); }}
                    maxLength={100}
                  />
                </div>
                {!isForgot ? (
                  <>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between">
                        <label className="form-label text-white-50 small fw-bold text-uppercase">Contraseña</label>
                        <button type="button" onClick={() => { setIsForgot(true); setError(''); setSuccessMsg(''); }} className="btn btn-link text-info small text-decoration-none hover-cyan p-0 border-0 shadow-none">¿Olvidaste tu contraseña?</button>
                      </div>
                      <input 
                        type="password" 
                        className="form-control text-white shadow-none py-3" 
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => { if (e.target.value.length <= 50) setPassword(e.target.value); }}
                        maxLength={50}
                      />
                    </div>
                    <button type="submit" className="btn btn-premium-unique text-white w-100 py-3 rounded-pill fw-bold mb-4 mt-2 d-flex justify-content-center align-items-center" disabled={isLoading}>
                      {isLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Ingresando...</>
                      ) : (
                        'INICIAR SESIÓN'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className="btn btn-premium-unique text-white w-100 py-3 rounded-pill fw-bold mb-3 mt-2 d-flex justify-content-center align-items-center" disabled={isLoading}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span> Enviando...</> : 'ENVIAR ENLACE'}
                    </button>
                    <button type="button" onClick={() => { setIsForgot(false); setError(''); setSuccessMsg(''); }} className="btn btn-outline-light w-100 py-2 rounded-pill fw-bold mb-4">
                      Volver al Login
                    </button>
                  </>
                )}
              </form>

              <div className="text-center mt-3">
                <Link to="/" className="text-white-50 text-decoration-none hover-cyan"><i className="bi bi-arrow-left me-2"></i>Volver a la página principal</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

// Remember me flag

// Social auth buttons

// Inline error messages
