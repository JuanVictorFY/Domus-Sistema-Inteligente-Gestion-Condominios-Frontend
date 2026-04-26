import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      category: "Para Residentes",
      title: "El Condominio en tu Bolsillo",
      desc: "Una app móvil intuitiva donde cada familia puede gestionar su vida en el edificio. Desde autorizar visitas con un código QR temporal hasta reservar la zona de parrillas en segundos.",
      bullets: ["Códigos QR temporales para visitas", "Reserva de áreas comunes 24/7", "Reporte de incidencias con fotos"],
      img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200",
      color: "#25d366",
      reverse: true,
      floatingIcon: "bi-qr-code-scan",
      floatingText: "Pase de Visita Activo",
      floatingColor: "text-white"
    },
    {
      category: "Para Seguridad",
      title: "Accesos Inteligentes y Control",
      desc: "Convierte la portería en una fortaleza. Integra nuestras cámaras de reconocimiento facial o utiliza la tablet del conserje para un registro digital impecable y seguro.",
      bullets: ["Reconocimiento facial de residentes", "Bitácora digital en la nube", "Botón de pánico silencioso"],
      img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200",
      color: "#0056b3",
      reverse: false,
      floatingIcon: "bi-shield-check",
      floatingText: "Acceso Autorizado: Dpto 402",
      floatingColor: "text-info"
    }
  ];

  return (
    <section id="features" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0d1b2a 50%, #020617 100%)', overflow: 'hidden' }}>
      {/* Resplandor decorativo de fondo */}
      <div className="position-absolute top-0 start-0" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }}></div>
      <div className="position-absolute" style={{ bottom: '20%', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,86,179,0.05) 0%, transparent 70%)' }}></div>
      
      <div className="container py-5">
        <div className="text-center mb-5 pb-4" data-aos="fade-down">
          <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>Módulos SaaS</h6>
          <h2 className="display-4 fw-bold text-white mb-4">Potencia cada aspecto de <br/><span className="text-info">tu comunidad</span></h2>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: '800px' }}>
            Herramientas especializadas para cada rol. Domus unifica la administración, la seguridad y la vida comunitaria en un solo ecosistema inteligente.
          </p>
        </div>

        <div className="features-showcase mt-5">
          {features.map((feat, index) => (
            <div className={`row align-items-center g-5 mb-5 pb-5 ${feat.reverse ? 'flex-lg-row-reverse' : ''}`} key={index}>
              
              {/* Textos y Viñetas */}
              <div className="col-lg-6" data-aos={feat.reverse ? "fade-left" : "fade-right"}>
                <div className="pe-lg-4">
                  <span className="badge rounded-pill mb-3 px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', color: feat.color, border: `1px solid ${feat.color}40` }}>
                    <i className="bi bi-star-fill me-2"></i>{feat.category}
                  </span>
                  <h2 className="fw-bold text-white mb-4 display-6">{feat.title}</h2>
                  <p className="text-white-50 fs-5 lh-lg mb-4">
                    {feat.desc}
                  </p>
                  <ul className="list-unstyled text-white-50 fs-5 mb-5">
                    {feat.bullets.map((bullet, i) => (
                      <li key={i} className="mb-3 d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0" style={{ width: '30px', height: '30px', background: `${feat.color}20`, color: feat.color }}>
                          <i className="bi bi-check-lg"></i>
                        </div>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Imagen Inmersiva con Notificación Flotante */}
              <div className="col-lg-6" data-aos={feat.reverse ? "fade-right" : "fade-left"}>
                <div className="position-relative feature-image-wrapper rounded-5 p-2" style={{ background: `linear-gradient(135deg, ${feat.color}40, transparent)` }}>
                  <div className="overflow-hidden rounded-5 shadow-lg position-relative" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={feat.img} alt={feat.title} className="img-fluid w-100" style={{ objectFit: 'cover', height: '420px', opacity: '0.85', transition: 'transform 0.5s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.8), transparent)' }}></div>
                  </div>
                  
                  {/* Tarjeta Flotante Animada (Glassmorphism) */}
                  <div className="floating-badge position-absolute shadow-lg" style={{ 
                    bottom: '-20px', 
                    [feat.reverse ? 'right' : 'left']: '20px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    padding: '15px 25px',
                    zIndex: 10
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className={`fs-3 ${feat.floatingColor}`}>
                        <i className={`bi ${feat.floatingIcon}`}></i>
                      </div>
                      <div>
                        <small className="text-white-50 d-block" style={{ fontSize: '0.75rem' }}>Sistema Activo</small>
                        <span className="fw-bold text-white">{feat.floatingText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="text-center mt-4" data-aos="zoom-in">
          <Link to="/#contacto" className="btn btn-premium-unique rounded-pill px-5 py-3 fw-bold text-white shadow-lg">
            SOLICITAR ACCESO DEMO <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;