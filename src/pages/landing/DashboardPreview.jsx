import { useState, useEffect } from 'react';

const DashboardPreview = () => {
  const [step, setStep] = useState(0);

  // Controlador de la secuencia de animación
  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev >= 7 ? 0 : prev + 1));
    }, 1500); // Avanza un paso cada 1.5 segundos
    return () => clearInterval(timer);
  }, []);

  // Coordenadas del cursor virtual para cada paso
  const cursorPositions = [
    { top: '250px', left: '50%', active: false }, // 0: Reposo al centro
    { top: '155px', left: '120px', active: false }, // 1: Mover al menú "Finanzas"
    { top: '155px', left: '120px', active: true },  // 2: Clic en menú
    { top: '65px', left: 'calc(100% - 130px)', active: false }, // 3: Mover a "Exportar"
    { top: '65px', left: 'calc(100% - 130px)', active: true },  // 4: Clic en "Exportar"
    { top: '340px', left: '50%', active: false }, // 5: Mover a "Descargar PDF" (Modal)
    { top: '340px', left: '50%', active: true },  // 6: Clic en "Descargar PDF"
    { top: '400px', left: '50%', active: false }, // 7: Terminar y mostrar Toast
  ];

  const currentPos = cursorPositions[step];
  const activeTab = step >= 2 ? 'Finanzas' : 'Panel';
  const showModal = step >= 4 && step <= 6;
  const showToast = step === 7;

  return (
    <section id="dashboard-preview" className="py-5 position-relative" style={{ background: '#0f172a' }}>
      <div className="container py-5 text-center">
        <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }} data-aos="fade-down">Administración Centralizada</h6>
        <h2 className="display-4 fw-bold text-white mb-5" data-aos="fade-up">Todo el control en una sola pantalla</h2>
        
        <div className="position-relative mx-auto mt-5" style={{ maxWidth: '1000px' }} data-aos="zoom-in" data-aos-delay="200">
          {/* Resplandor de fondo */}
          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
          
          {/* Simulación de Ventana de Navegador */}
          <div className="position-relative rounded-4 overflow-hidden shadow-lg border" style={{ zIndex: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#0f172a' }}>
            
            {/* Cabecera del Navegador (Botones de Mac) */}
            <div className="d-flex align-items-center px-4 py-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: '#020617' }}>
              <div className="d-flex gap-2">
                <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ff5f56' }}></div>
                <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ffbd2e' }}></div>
                <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#27c93f' }}></div>
              </div>
            </div>
            
            {/* --- ANIMACIÓN INTERACTIVA DEL DASHBOARD --- */}
            <div className="d-flex text-start position-relative rounded-bottom-4" style={{ height: '500px', backgroundColor: '#020617', overflow: 'hidden', overflowX: 'auto' }}>
              <style>
                {`
                  @keyframes ping-click {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
                  }
                `}
              </style>
              
              {/* Sidebar Simulado */}
              <div className="p-3 border-end d-none d-md-block" style={{ width: '240px', borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 1 }}>
                <div className="d-flex align-items-center mb-5 mt-2 px-2">
                   <div className="d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '10px' }}>
                      <i className="bi bi-buildings-fill text-white small"></i>
                   </div>
                   <span className="fw-bold text-white fs-5">DOMUS</span>
                </div>
                <div className={`p-3 mb-2 rounded-3 transition-all ${activeTab === 'Panel' ? 'bg-info bg-opacity-10 text-info fw-bold' : 'text-white-50'}`}><i className="bi bi-grid-1x2-fill me-3"></i> Panel de Control</div>
                <div className={`p-3 mb-2 rounded-3 transition-all ${activeTab === 'Finanzas' ? 'bg-info bg-opacity-10 text-info fw-bold' : 'text-white-50'}`}><i className="bi bi-wallet2 me-3"></i> Finanzas y Cobros</div>
                <div className="p-3 mb-2 rounded-3 text-white-50"><i className="bi bi-people-fill me-3"></i> Directorio Residentes</div>
                <div className="p-3 mb-2 rounded-3 text-white-50"><i className="bi bi-shield-shaded me-3"></i> Monitor Seguridad</div>
              </div>

              {/* Contenido Principal Simulado */}
              <div className="p-4 p-md-5 flex-grow-1 position-relative w-100">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
                  <div>
                    <h4 className="text-white fw-bold mb-1 transition-all">{activeTab === 'Panel' ? 'Panel de Control' : 'Finanzas y Cobros'}</h4>
                    <span className="text-white-50 small">Administración Central</span>
                  </div>
                  {activeTab === 'Finanzas' && (
                    <div style={{ animation: 'fadeInDown 0.3s ease' }}>
                      <button className={`btn btn-premium-unique rounded-pill text-white px-4 py-2 small fw-bold shadow transition-all`} style={{ transform: step === 4 ? 'scale(0.95)' : 'scale(1)' }}>
                        <i className="bi bi-file-earmark-pdf me-2"></i> Exportar Reporte
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === 'Panel' && (
                   <div className="row g-4" style={{ animation: 'fadeInDown 0.4s ease' }}>
                      <div className="col-6"><div className="service-card-elite p-4 h-100"><div className="text-info mb-3"><i className="bi bi-bank fs-4"></i></div><h6 className="text-white-50 small text-uppercase">Recaudación</h6><h3 className="text-white mb-0">$12,450</h3></div></div>
                      <div className="col-6"><div className="service-card-elite p-4 h-100"><div className="text-warning mb-3"><i className="bi bi-exclamation-circle fs-4"></i></div><h6 className="text-white-50 small text-uppercase">Morosidad</h6><h3 className="text-white mb-0">3 Dptos</h3></div></div>
                      <div className="col-12"><div className="service-card-elite p-4 mt-2"><div className="d-flex justify-content-between"><h6 className="text-white mb-0">Últimas Transacciones</h6></div><div className="mt-3 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between"><span className="text-white-50 small">Dpto 402 - Mantenimiento</span><span className="text-success small fw-bold">+$150.00</span></div></div></div>
                   </div>
                )}

                {activeTab === 'Finanzas' && (
                   <div className="row g-4" style={{ animation: 'fadeInDown 0.4s ease' }}>
                      <div className="col-4"><div className="service-card-elite p-3"><h6 className="text-white-50 small">Ingresos Totales</h6><h5 className="text-white mb-0">$15,200</h5></div></div>
                      <div className="col-4"><div className="service-card-elite p-3"><h6 className="text-white-50 small">Egresos Totales</h6><h5 className="text-white mb-0">$4,850</h5></div></div>
                      <div className="col-4"><div className="service-card-elite p-3 border-info border-opacity-25"><h6 className="text-info small">Fondo Reserva</h6><h5 className="text-white mb-0">$32,500</h5></div></div>
                      <div className="col-12 mt-3">
                        <div className="service-card-elite p-0 overflow-auto">
                          <table className="table table-dark mb-0 bg-transparent text-white-50 align-middle" style={{ minWidth: '550px' }}>
                            <thead><tr><th className="py-3 px-4 border-secondary text-white">Residente</th><th className="py-3 border-secondary text-white">Unidad</th><th className="py-3 text-end px-4 border-secondary text-white">Deuda</th></tr></thead>
                            <tbody>
                              <tr><td className="py-3 px-4 d-flex align-items-center"><div className="avatar-circle me-3" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>CM</div><span className="text-white">Carlos Mendoza</span></td><td className="py-3">Dpto 801</td><td className="py-3 text-end px-4 text-danger fw-bold">$300.00</td></tr>
                              <tr><td className="py-3 px-4 d-flex align-items-center"><div className="avatar-circle me-3" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>AR</div><span className="text-white">Ana Ríos</span></td><td className="py-3">Dpto 305</td><td className="py-3 text-end px-4 text-danger fw-bold">$150.00</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                   </div>
                )}

                {/* Modal Simulado */}
                {showModal && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(5px)', zIndex: 10, animation: 'fadeInDown 0.3s ease' }}>
                     <div className="card border-info p-4 text-center shadow-lg" style={{ width: '320px', borderRadius: '24px', background: '#0f172a', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', background: 'rgba(0,212,255,0.1)' }}>
                          <i className="bi bi-file-earmark-pdf-fill text-info fs-2"></i>
                        </div>
                        <h5 className="text-white fw-bold">Exportar Reporte</h5>
                        <p className="text-white-50 small mb-4">Se generará un documento PDF con los registros actuales.</p>
                        <button className="btn btn-info rounded-pill py-2 fw-bold text-dark w-100 transition-all" style={{ transform: step === 6 ? 'scale(0.95)' : 'scale(1)' }}>Descargar PDF</button>
                     </div>
                  </div>
                )}

                {/* Toast Simulado */}
                {showToast && (
                  <div className="position-absolute top-0 end-0 m-4 px-4 py-3 bg-success bg-opacity-25 text-success border border-success border-opacity-50 rounded-pill shadow-lg d-flex align-items-center" style={{ zIndex: 11, animation: 'fadeInDown 0.4s ease' }}>
                     <i className="bi bi-check-circle-fill fs-5 me-2"></i> <span className="fw-bold">PDF Generado Exitosamente</span>
                  </div>
                )}
              </div>

              {/* Cursor Simulado Animado */}
              <div 
                className="position-absolute d-none d-md-block"
                style={{
                  top: currentPos.top,
                  left: currentPos.left,
                  transition: 'top 1s cubic-bezier(0.25, 1, 0.5, 1), left 1s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s ease',
                  zIndex: 9999,
                  transform: currentPos.active ? 'scale(0.85)' : 'scale(1)',
                  pointerEvents: 'none'
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                  <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35a.5.5 0 0 0-.85-.14z" fill="white" stroke="#0f172a" strokeWidth="1.5" />
                </svg>
                {currentPos.active && (
                  <div className="position-absolute top-0 start-0 bg-info rounded-circle opacity-50" style={{ width: '40px', height: '40px', transform: 'translate(-10px, -10px)', animation: 'ping-click 0.5s ease-out forwards' }}></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;