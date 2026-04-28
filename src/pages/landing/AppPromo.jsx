const AppPromo = () => {
  return (
    <section id="app-promo" className="py-5 position-relative" style={{ background: '#0f172a' }}>
      <div className="container py-5 mt-4">
        <div className="row align-items-center g-5">
          
          <div className="col-lg-6" data-aos="fade-right">
            <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>App para Residentes</h6>
            <h2 className="display-4 fw-bold text-white mb-4">Lleva tu condominio en el bolsillo</h2>
            <p className="text-white-50 fs-5 lh-lg mb-5">
              Autoriza visitas, reserva áreas comunes, paga tus cuotas y recibe notificaciones importantes directamente en tu celular. La vida en comunidad, ahora es mucho más fácil.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <button className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-3 border-2 hover-cyan">
                <i className="bi bi-apple fs-3"></i>
                <div className="text-start">
                  <small className="d-block" style={{ fontSize: '0.7rem', lineHeight: '1' }}>Consíguelo en el</small>
                  <strong className="d-block" style={{ lineHeight: '1' }}>App Store</strong>
                </div>
              </button>
              <button className="btn btn-outline-light rounded-pill px-4 py-3 d-flex align-items-center gap-3 border-2 hover-cyan">
                <i className="bi bi-google-play fs-3"></i>
                <div className="text-start">
                  <small className="d-block" style={{ fontSize: '0.7rem', lineHeight: '1' }}>DISPONIBLE EN</small>
                  <strong className="d-block" style={{ lineHeight: '1' }}>Google Play</strong>
                </div>
              </button>
            </div>
          </div>

          <div className="col-lg-6 text-center" data-aos="fade-left">
            <div className="position-relative d-inline-block">
              {/* Phone frame */}
              <div className="position-relative mx-auto" style={{ width: '280px', height: '580px', background: '#000', borderRadius: '44px', padding: '12px', border: '3px solid #222', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.08), inset 0 0 2px rgba(255,255,255,0.1)' }}>
                {/* Notch */}
                <div className="position-absolute top-0 start-50 translate-middle-x" style={{ width: '100px', height: '22px', background: '#000', borderRadius: '0 0 14px 14px', zIndex: 10 }}></div>
                {/* Screen */}
                <div className="h-100 w-100 rounded-4 overflow-hidden position-relative" style={{ background: '#0f172a' }}>
                  {/* Status bar */}
                  <div className="d-flex justify-content-between align-items-center px-4 pt-2 pb-1" style={{ fontSize: '0.6rem' }}>
                    <span className="text-white fw-bold">9:41</span>
                    <div className="d-flex gap-1 align-items-center">
                      <i className="bi bi-reception-4 text-white" style={{ fontSize: '0.55rem' }}></i>
                      <i className="bi bi-wifi text-white" style={{ fontSize: '0.55rem' }}></i>
                      <i className="bi bi-battery-full text-white" style={{ fontSize: '0.55rem' }}></i>
                    </div>
                  </div>
                  
                  {/* Notification toast - aparece y desaparece */}
                  <div className="phone-notif-toast position-absolute start-0 end-0 mx-2" style={{ top: '28px', zIndex: 20 }}>
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'rgba(0,212,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.3)' }}>
                      <div className="rounded-circle bg-info d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px', minWidth: '20px' }}>
                        <i className="bi bi-check-lg text-dark" style={{ fontSize: '0.6rem' }}></i>
                      </div>
                      <small className="text-white" style={{ fontSize: '0.55rem' }}>Tu reserva de Parrillas fue aprobada ✓</small>
                    </div>
                  </div>

                  {/* App header - fijo */}
                  <div className="px-3 pt-2 pb-2" style={{ background: '#0f172a', position: 'relative', zIndex: 5 }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-buildings text-white" style={{ fontSize: '0.6rem' }}></i>
                      </div>
                      <span className="text-white fw-bold" style={{ fontSize: '0.7rem' }}>DOMUS</span>
                      <div className="ms-auto position-relative">
                        <i className="bi bi-bell text-white-50" style={{ fontSize: '0.75rem' }}></i>
                        <span className="phone-notif-badge position-absolute" style={{ top: '-3px', right: '-3px', width: '7px', height: '7px', background: '#ff4444', borderRadius: '50%' }}></span>
                      </div>
                    </div>
                    <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.8rem' }}>¡Hola, Residente!</h6>
                    <small className="text-white-50" style={{ fontSize: '0.58rem' }}>Bienvenido de vuelta a tu espacio</small>
                  </div>

                  {/* Scrollable content */}
                  <div className="phone-scroll-content px-3 pt-1">
                    {/* Estado de cuenta card */}
                    <div className="p-3 rounded-3 mb-2 text-center" style={{ background: 'linear-gradient(135deg, rgba(25,135,84,0.12), rgba(0,212,255,0.05))', border: '1px solid rgba(25,135,84,0.25)' }}>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                        <i className="bi bi-shield-check text-success" style={{ fontSize: '0.9rem' }}></i>
                        <small className="text-success fw-bold" style={{ fontSize: '0.65rem' }}>ESTADO DE CUENTA</small>
                      </div>
                      <strong className="text-white d-block" style={{ fontSize: '1.1rem' }}>$0.00</strong>
                      <small className="text-white-50" style={{ fontSize: '0.5rem' }}>¡Al día! Sin deudas pendientes</small>
                    </div>

                    {/* Quick actions grid */}
                    <div className="d-flex gap-2 mb-3">
                      <div className="flex-grow-1 p-2 rounded-3 text-center position-relative" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                        <i className="bi bi-credit-card text-info d-block mb-1" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-white-50" style={{ fontSize: '0.48rem' }}>Pagar Cuota</small>
                        {/* Tap indicator */}
                        <div className="phone-tap-indicator position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: '30px', height: '30px', background: 'rgba(0,212,255,0.3)', pointerEvents: 'none' }}></div>
                      </div>
                      <div className="flex-grow-1 p-2 rounded-3 text-center" style={{ background: 'rgba(25,135,84,0.06)', border: '1px solid rgba(25,135,84,0.15)' }}>
                        <i className="bi bi-person-check text-success d-block mb-1" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-white-50" style={{ fontSize: '0.48rem' }}>Nueva Visita</small>
                      </div>
                      <div className="flex-grow-1 p-2 rounded-3 text-center" style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)' }}>
                        <i className="bi bi-calendar-star text-warning d-block mb-1" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-white-50" style={{ fontSize: '0.48rem' }}>Reservar</small>
                      </div>
                      <div className="flex-grow-1 p-2 rounded-3 text-center" style={{ background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.15)' }}>
                        <i className="bi bi-exclamation-octagon text-danger d-block mb-1" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-white-50" style={{ fontSize: '0.48rem' }}>Reportar</small>
                      </div>
                    </div>

                    {/* Reservas section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-white fw-bold" style={{ fontSize: '0.6rem' }}>Mis Reservas</small>
                        <small className="text-info" style={{ fontSize: '0.5rem' }}>Ver todas →</small>
                      </div>
                      <div className="p-2 rounded-3 mb-1 d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', background: 'rgba(255,193,7,0.15)' }}>
                            <i className="bi bi-fire text-warning" style={{ fontSize: '0.6rem' }}></i>
                          </div>
                          <div>
                            <small className="text-white d-block" style={{ fontSize: '0.58rem' }}>Zona de Parrillas</small>
                            <small className="text-white-50" style={{ fontSize: '0.45rem' }}>Hoy, 18:00 - 22:00</small>
                          </div>
                        </div>
                        <span className="badge bg-success bg-opacity-25 text-success" style={{ fontSize: '0.42rem' }}>Aprobada</span>
                      </div>
                      <div className="p-2 rounded-3 mb-1 d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', background: 'rgba(0,212,255,0.15)' }}>
                            <i className="bi bi-water text-info" style={{ fontSize: '0.6rem' }}></i>
                          </div>
                          <div>
                            <small className="text-white d-block" style={{ fontSize: '0.58rem' }}>Piscina Techada</small>
                            <small className="text-white-50" style={{ fontSize: '0.45rem' }}>Mañana, 10:00 - 12:00</small>
                          </div>
                        </div>
                        <span className="badge bg-warning bg-opacity-25 text-warning" style={{ fontSize: '0.42rem' }}>Pendiente</span>
                      </div>
                    </div>

                    {/* Visitas section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-white fw-bold" style={{ fontSize: '0.6rem' }}>Visitas Autorizadas</small>
                        <span className="badge bg-info bg-opacity-25 text-info" style={{ fontSize: '0.42rem' }}>2 hoy</span>
                      </div>
                      <div className="p-2 rounded-3 mb-1 d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="rounded-circle bg-info bg-opacity-15 d-flex align-items-center justify-content-center" style={{ width: '26px', height: '26px', minWidth: '26px' }}>
                          <i className="bi bi-person-heart text-info" style={{ fontSize: '0.6rem' }}></i>
                        </div>
                        <div className="flex-grow-1">
                          <small className="text-white d-block" style={{ fontSize: '0.58rem' }}>Roberto Sánchez</small>
                          <small className="text-white-50" style={{ fontSize: '0.45rem' }}>Familiar • Hoy 15:00</small>
                        </div>
                        <div className="text-end">
                          <small className="text-white font-monospace fw-bold d-block" style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>8492</small>
                        </div>
                      </div>
                    </div>

                    {/* Comunicado */}
                    <div className="p-2 rounded-3 mb-2" style={{ background: 'rgba(220,53,69,0.05)', borderLeft: '3px solid #dc3545' }}>
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-megaphone text-danger" style={{ fontSize: '0.6rem' }}></i>
                        <div>
                          <small className="text-white fw-bold d-block" style={{ fontSize: '0.55rem' }}>Corte de agua programado</small>
                          <small className="text-white-50" style={{ fontSize: '0.45rem' }}>Mañana de 8am a 12pm por mantenimiento</small>
                        </div>
                      </div>
                    </div>

                    {/* Votación activa */}
                    <div className="p-2 rounded-3" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-danger bg-opacity-25 text-danger" style={{ fontSize: '0.4rem' }}>● Activa</span>
                        <small className="text-white" style={{ fontSize: '0.55rem' }}>Votación: Cambio de empresa</small>
                      </div>
                      <div className="progress rounded-pill" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                        <div className="progress-bar bg-info" style={{ width: '65%' }}></div>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-white-50" style={{ fontSize: '0.4rem' }}>A favor 65%</small>
                        <small className="text-white-50" style={{ fontSize: '0.4rem' }}>En contra 35%</small>
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav bar */}
                  <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-around align-items-center py-2 px-3" style={{ background: 'rgba(15,23,42,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    <i className="bi bi-house-door-fill text-info" style={{ fontSize: '0.85rem' }}></i>
                    <i className="bi bi-wallet2 text-white-50" style={{ fontSize: '0.85rem' }}></i>
                    <i className="bi bi-calendar-event text-white-50" style={{ fontSize: '0.85rem' }}></i>
                    <i className="bi bi-bell text-white-50" style={{ fontSize: '0.85rem' }}></i>
                    <i className="bi bi-person text-white-50" style={{ fontSize: '0.85rem' }}></i>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', zIndex: -1 }}></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppPromo;