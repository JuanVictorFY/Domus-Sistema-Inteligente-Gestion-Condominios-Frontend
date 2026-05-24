const Integrations = () => {
  const tools = [
    { name: "WhatsApp", desc: "Notificaciones y recordatorios de pago automáticos.", icon: "bi-whatsapp", color: "#25D366" },
    { name: "AWS Security", desc: "Tus datos protegidos en la nube más segura del mundo.", icon: "bi-cloud-check", color: "#FF9900" },
    { name: "Stripe / Bancos", desc: "Pagos con tarjeta de crédito, débito y transferencias.", icon: "bi-credit-card", color: "#635BFF" },
    { name: "Biometría", desc: "Conexión directa con cámaras y torniquetes inteligentes.", icon: "bi-fingerprint", color: "#00d4ff" }
  ];

  return (
    <section id="integrations" className="py-5 position-relative" style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          <div className="col-lg-5" data-aos="fade-right">
            <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>Ecosistema Conectado</h6>
            <h2 className="display-4 fw-bold text-white mb-4">Integraciones que <span className="text-info">potencian tu gestión</span></h2>
            <p className="text-white-50 fs-5 lh-lg mb-4">
              Domus no es una isla. Nos conectamos con el software y hardware de nivel mundial que ya utilizas para crear una experiencia completamente automatizada.
            </p>
            <a href="/#contacto" className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold hover-cyan transition-all">
              Ver todas las integraciones <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

          <div className="col-lg-7" data-aos="fade-left">
            <div className="row g-4">
              {tools.map((tool, i) => (
                <div className="col-md-6" key={i}>
                  <div className="p-4 rounded-4 h-100 position-relative overflow-hidden integration-card" style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s ease'
                  }}>
                    {/* Resplandor del color de la marca */}
                    <div className="position-absolute top-0 end-0 rounded-circle" style={{
                      width: '100px', height: '100px', background: `radial-gradient(circle, ${tool.color}30 0%, transparent 70%)`, transform: 'translate(30%, -30%)'
                    }}></div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="d-flex justify-content-center align-items-center rounded-3 me-3" style={{ width: '45px', height: '45px', background: `${tool.color}15` }}>
                        <i className={`bi ${tool.icon} fs-4`} style={{ color: tool.color }}></i>
                      </div>
                      <h5 className="text-white fw-bold mb-0">{tool.name}</h5>
                    </div>
                    <p className="text-white-50 small mb-0 lh-lg">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Integrations;