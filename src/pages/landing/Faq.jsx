import { useState } from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "¿Cuánto tiempo toma implementar Domus en mi edificio?", a: "El proceso es rapidísimo. En menos de 48 horas configuramos tu condominio, cargamos la base de datos de los residentes e instalamos los accesos para que comiencen a usar la App." },
    { q: "¿Es seguro el manejo de datos financieros y biométricos?", a: "Absolutamente. Utilizamos servidores encriptados de nivel bancario (AWS) y cumplimos con todas las normativas internacionales de protección de datos personales." },
    { q: "¿Mis residentes necesitan un teléfono moderno para usar la app?", a: "No. La app es súper ligera y compatible con el 99% de los dispositivos Android e iOS actuales. Para quienes no usan celular, el administrador puede gestionar todo manualmente." },
    { q: "¿Puedo probar el sistema antes de contratarlo?", a: "¡Sí! Ofrecemos una demo guiada gratuita y un periodo de prueba de 14 días para que la junta de propietarios apruebe el sistema con total confianza." },
    { q: "¿Qué pasa si se va la luz o el internet en el edificio?", a: "Nuestros sistemas de seguridad física tienen baterías de respaldo. En cuanto a la app, al estar en la nube, los datos están siempre a salvo y accesibles por datos móviles." }
  ];

  return (
    <section id="faq" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #081225 50%, #020617 100%)', overflow: 'hidden' }}>
      {/* Decorative glow */}
      <div className="position-absolute" style={{ top: '40%', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,86,179,0.05) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5" data-aos="fade-down">
          <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>Soporte e Información</h6>
          <h1 className="display-4 fw-bold text-white mb-4">Preguntas <span className="text-info">Frecuentes</span></h1>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: '600px' }}>
            Resolvemos tus dudas para que des el paso hacia la modernización de tu condominio.
          </p>
        </div>

        <div className="mx-auto" style={{ maxWidth: '800px' }} data-aos="fade-up">
          {faqs.map((faq, i) => (
            <div key={i} className="mb-3">
              <button 
                className="w-100 text-start px-4 py-4 rounded-4 border-0 d-flex justify-content-between align-items-center"
                style={{ 
                  background: openIndex === i ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  color: openIndex === i ? '#00d4ff' : '#fff',
                  transition: 'all 0.3s ease',
                  border: openIndex === i ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.1)'
                }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="fw-bold fs-5">{faq.q}</span>
                <i className={`bi bi-chevron-${openIndex === i ? 'up' : 'down'} fs-5`}></i>
              </button>
              
              {openIndex === i && (
                <div className="px-4 py-3 text-white-50 fs-5 lh-lg" style={{ animation: 'fadeInDown 0.3s ease-out' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;