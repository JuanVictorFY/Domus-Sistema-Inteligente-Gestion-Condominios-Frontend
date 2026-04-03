import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="position-relative overflow-hidden" style={{ background: '#010409' }}>
      
      {/* Decorative top border gradient */}
      <div className="w-100" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #00d4ff, #0056b3, #00d4ff, transparent)' }}></div>

      {/* Glow orbs */}
      <div className="position-absolute" style={{ top: '20%', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)' }}></div>
      <div className="position-absolute" style={{ bottom: '10%', right: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(0,86,179,0.05) 0%, transparent 60%)' }}></div>

      <div className="container position-relative pt-5 pb-4" style={{ zIndex: 1 }}>
        
        {/* CTA Section */}
        <div className="text-center mb-5 pb-4">
          <h3 className="display-6 fw-bold text-white mb-3">
            ¿Listo para transformar tu <span style={{ 
              background: 'linear-gradient(90deg, #00d4ff, #0056b3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>condominio?</span>
          </h3>
          <p className="text-white-50 fs-5 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
            Únete a las comunidades que ya confían en Domus.
          </p>
          <Link to="/login" className="btn rounded-pill px-5 py-3 fw-bold text-white shadow-lg" style={{ 
            background: 'linear-gradient(135deg, #0056b3, #00d4ff)',
            border: 'none',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-arrow-right-circle me-2"></i>Acceder al Sistema
          </Link>
        </div>

        <hr className="mb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <div className="row g-4">
          
          {/* COLUMNA 1: Identidad */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex align-items-center justify-content-center me-3 shadow-sm" 
                   style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '12px', transform: 'rotate(45deg)' }}>
                <i className="bi bi-buildings-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '1.1rem' }}></i>
              </div>
              <span className="fs-4 fw-bold text-white">Domus</span>
            </div>
            <p className="text-white-50 pe-lg-4 mb-4">
              Elevando el estándar de la gestión residencial a través de tecnología inteligente y diseño de vanguardia.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="d-flex align-items-center justify-content-center rounded-circle text-white-50 transition-all hover-cyan" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="d-flex align-items-center justify-content-center rounded-circle text-white-50 transition-all hover-cyan" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="d-flex align-items-center justify-content-center rounded-circle text-white-50 transition-all hover-cyan" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </div>

          {/* COLUMNA 2: Navegación */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-4 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Navegación</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><Link to="/" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Inicio</Link></li>
              <li className="mb-3"><a href="/#features" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Módulos</a></li>
              <li className="mb-3"><a href="/#servicios" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Servicios</a></li>
              <li className="mb-3"><a href="/#contacto" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Contacto</a></li>
            </ul>
          </div>

          {/* COLUMNA 3: Empresa */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-4 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>La Empresa</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="/#about" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Sobre Nosotros</a></li>
              <li className="mb-3"><a href="/#faq" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Preguntas Frecuentes</a></li>
              <li className="mb-3"><Link to="/login" className="text-white-50 text-decoration-none hover-cyan d-flex align-items-center"><i className="bi bi-chevron-right me-2 text-info" style={{ fontSize: '0.7rem' }}></i>Portal de Clientes</Link></li>
            </ul>
          </div>

          {/* COLUMNA 4: Contacto */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-4 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Contacto</h6>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: '36px', height: '36px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <i className="bi bi-envelope-at text-info" style={{ fontSize: '0.9rem' }}></i>
                </div>
                <small className="text-white-50">admin.domus.condominio@gmail.com</small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: '36px', height: '36px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <i className="bi bi-telephone text-info" style={{ fontSize: '0.9rem' }}></i>
                </div>
                <small className="text-white-50">+51 928 799 314</small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: '36px', height: '36px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <i className="bi bi-geo-alt text-info" style={{ fontSize: '0.9rem' }}></i>
                </div>
                <small className="text-white-50">Lima, Perú</small>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <small className="text-white-50">© {currentYear} Domus. Todos los derechos reservados.</small>
          <div className="d-flex gap-4">
            <a href="#" className="text-white-50 text-decoration-none small hover-cyan">Privacidad</a>
            <a href="#" className="text-white-50 text-decoration-none small hover-cyan">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
