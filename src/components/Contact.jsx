import { useState } from 'react';
import api from '../api';

const Contact = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const inputStyle = (fieldName) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeft: focusedField === fieldName 
      ? '4px solid #00d4ff' 
      : '4px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    transition: 'all 0.4s ease',
    padding: '16px 20px',
    fontSize: '0.95rem'
  });

  return (
    <section id="contacto" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0a1628 50%, #020617 100%)', overflow: 'hidden' }}>
      {/* Decorative glow */}
      <div className="position-absolute" style={{ top: '30%', left: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row g-5 align-items-center">
          
          <div className="col-lg-5 text-start" data-aos="fade-right">
            <h6 className="text-info fw-bold tracking-widest mb-3" style={{ letterSpacing: '3px' }}>CONTACTO VIP</h6>
            <h2 className="display-4 fw-bold text-white mb-4">Hablemos de tu próximo <span className="text-info">gran proyecto.</span></h2>
            <p className="text-white-50 mb-5">
              Nuestro equipo de expertos está listo para diseñar una solución a la medida de tu condominio.
            </p>
          </div>

          <div className="col-lg-7" data-aos="fade-left">
            <div className="p-4 p-md-5 rounded-5" style={{
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}>
              <form className="row g-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                if (!name || !email || !message) { alert('Completa todos los campos'); return; }
                setSending(true);
                try {
                  await api.post('/contact', { name, email, message });
                  setSent(true);
                  e.target.reset();
                } catch (err) {
                  alert(err.response?.data?.error || 'Error al enviar mensaje');
                } finally { setSending(false); }
              }}>
                {sent && <div className="col-12"><div className="alert alert-success bg-transparent border-success text-success text-center rounded-3"><i className="bi bi-check-circle-fill me-2"></i>¡Mensaje enviado exitosamente! Te responderemos pronto.</div></div>}
                <div className="col-md-6 text-start">
                  <label className="text-white-50 small fw-bold mb-2 text-uppercase">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    maxLength={50}
                    className="form-control text-white shadow-none" 
                    placeholder="Ej. Juan Pérez"
                    style={inputStyle('nombre')}
                    onFocus={() => setFocusedField('nombre')}
                    onBlur={() => setFocusedField(null)}
                    onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').slice(0, 50); }}
                  />
                </div>
                <div className="col-md-6 text-start">
                  <label className="text-white-50 small fw-bold mb-2 text-uppercase">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    maxLength={100}
                    className="form-control text-white shadow-none" 
                    placeholder="juan@empresa.com"
                    style={inputStyle('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="col-12 text-start">
                  <label className="text-white-50 small fw-bold mb-2 text-uppercase">Mensaje</label>
                  <textarea 
                    name="message"
                    required
                    maxLength={500}
                    className="form-control text-white shadow-none" 
                    rows="4" 
                    placeholder="Cuéntanos sobre tu condominio... (máx. 500 caracteres)"
                    style={inputStyle('mensaje')}
                    onFocus={() => setFocusedField('mensaje')}
                    onBlur={() => setFocusedField(null)}
                  ></textarea>
                </div>
                
                <div className="col-12 text-end mt-4">
                  <button type="submit" disabled={sending} className="btn-elite-minimal border-0 shadow-none">
                    {sending ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                    <i className={`bi ${sending ? 'bi-hourglass-split' : 'bi-send'} ms-2`}></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;