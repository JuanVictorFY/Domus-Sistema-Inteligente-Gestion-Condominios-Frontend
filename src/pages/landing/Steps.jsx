const Steps = () => {
  const steps = [
    { num: "01", title: "Configuración Inicial", desc: "Nuestro equipo crea el perfil de tu condominio y carga la base de datos de los residentes en menos de 24 horas." },
    { num: "02", title: "Onboarding Digital", desc: "Se envían invitaciones automáticas por correo y WhatsApp para que los residentes descarguen la App." },
    { num: "03", title: "Operación en Piloto Automático", desc: "Administra cobros, accesos y reservas desde tu panel central mientras la plataforma hace el trabajo pesado." }
  ];

  return (
    <section id="how-it-works" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #162033 50%, #0f172a 100%)', overflow: 'hidden' }}>
      {/* Decorative glow */}
      <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div className="container py-5 mt-4 position-relative" style={{ zIndex: 1 }}>
        
        <div className="text-center mb-5 pb-3" data-aos="fade-down">
          <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>Implementación sin estrés</h6>
          <h2 className="display-4 fw-bold text-white mb-4">¿Cómo empezar a usar <span className="text-info">Domus?</span></h2>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: '600px' }}>
            Migrar de tu sistema actual o de usar Excels a nuestra plataforma es un proceso guiado, rápido y 100% digital.
          </p>
        </div>

        <div className="row g-4 mt-2 relative">
          {/* Línea conectora (solo visible en escritorio) */}
          <div className="d-none d-lg-block position-absolute top-50 start-50 translate-middle w-75" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)', zIndex: 0 }}></div>

          {steps.map((step, i) => (
            <div className="col-lg-4" key={i} data-aos="fade-up" data-aos-delay={i * 200}>
              <div className="card h-100 border-0 p-4 p-md-5 bg-transparent position-relative overflow-hidden text-center text-lg-start" style={{ zIndex: 1 }}>
                
                {/* Número gigante de fondo */}
                <div className="step-huge-number position-absolute text-white" style={{ opacity: '0.03', fontSize: '8rem', fontWeight: '900', top: '-20px', right: '10px', lineHeight: '1', userSelect: 'none' }}>
                  {step.num}
                </div>

                <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-4 position-relative" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', boxShadow: '0 10px 20px rgba(0, 212, 255, 0.3)' }}>
                  <span className="text-white fw-bold fs-5">{step.num}</span>
                </div>
                
                <h4 className="text-white fw-bold mb-3 relative" style={{ zIndex: 2 }}>{step.title}</h4>
                <p className="text-white-50 lh-lg mb-0 relative" style={{ zIndex: 2 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;