import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinkStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  // Cierra el menú móvil automáticamente al cambiar de vista
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Inicio',   link: '/' },
    { name: 'Servicios',link: '/#servicios' },
    { name: 'Módulos',  link: '/#features' },
    { name: 'Precios',  link: '/#pricing' },
    { name: 'Nosotros', link: '/#about' },
    { name: 'Contacto', link: '/#contacto' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent position-absolute w-100 mt-3" style={{ zIndex: 1000 }}>
      <div className="container">
        
        {/* Logo animado */}
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4 text-decoration-none text-white" to="/" style={navLinkStyle} 
           onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
           onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div className="d-flex align-items-center justify-content-center me-3 shadow-sm" 
               style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '12px', transform: 'rotate(45deg)' }}>
            <i className="bi bi-buildings-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '1.2rem' }}></i>
          </div>
          DOMUS
        </Link>

        {/* BOTÓN HAMBURGUESA (Solo visible en móvil) */}
        <button 
          className={`navbar-toggler shadow-none ${isMenuOpen ? '' : 'collapsed'}`} 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen} 
          aria-label="Toggle navigation"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido Colapsable */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav" style={{ flexGrow: 1 }}> {/* Añadido flexGrow para asegurar que ocupe el espacio */}
          <div className="d-flex flex-column align-items-center mx-lg-auto my-3 my-lg-0">
            <ul className="navbar-nav gap-lg-3 text-center">
              {navItems.slice(0, 8).map((item) => {
                const isActive = item.link.includes('#') 
                  ? location.hash === item.link.substring(item.link.indexOf('#'))
                  : location.pathname === item.link && !location.hash;
                return (
                  <li className="nav-item" key={item.name}>
                    <Link 
                      className={`nav-link fw-medium custom-nav-link px-2 ${isActive ? 'text-info opacity-100' : 'text-white opacity-75'}`} 
                      to={item.link} 
                      style={navLinkStyle}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="navbar-nav gap-lg-3 text-center">
              {navItems.slice(8).map((item) => {
                const isActive = item.link.includes('#') 
                  ? location.hash === item.link.substring(item.link.indexOf('#'))
                  : location.pathname === item.link && !location.hash;
                return (
                  <li className="nav-item" key={item.name}>
                    <Link 
                      className={`nav-link fw-medium custom-nav-link px-2 ${isActive ? 'text-info opacity-100' : 'text-white opacity-75'}`} 
                      to={item.link} 
                      style={navLinkStyle}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Botones de Acción dentro del colapso para móvil */}
          <div className="d-lg-none d-flex flex-column align-items-center gap-3 pt-3 pb-2 border-top border-secondary border-opacity-25 w-100 mt-3">
             <button 
                className="btn btn-light rounded-pill px-4 py-2 fw-bold w-100 shadow-lg"
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
             >
                Iniciar Sesión
             </button>
          </div>
        </div>

        {/* Botones de Acción (Solo visibles en escritorio) */}
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <button 
            className="btn rounded-pill px-5 py-2 fw-bold text-nowrap"
            style={{
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              backgroundColor: isHovered ? '#0056b3' : '#f8f9fa',
              color: isHovered ? '#fff' : '#0056b3',
              border: isHovered ? '2px solid #0056b3' : '2px solid transparent',
              minWidth: '180px',
              transform: isHovered ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
              boxShadow: isHovered ? '0 10px 20px rgba(0, 86, 179, 0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
// Mobile menu state added
