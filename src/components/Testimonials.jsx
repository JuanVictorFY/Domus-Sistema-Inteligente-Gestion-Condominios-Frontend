import Slider from "react-slick";

const SlickSlider = Slider.default ? Slider.default : Slider;

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Administrador, Torre Horizonte",
      quote: "Gracias a Domus, la morosidad de nuestro edificio bajó un 40% en solo tres meses. La transparencia financiera es increíble.",
      rating: 5
    },
    {
      name: "Laura Giraldo",
      role: "Residente, Condominio Los Pinos",
      quote: "Reservar el área de parrillas nunca fue tan fácil. Antes era un dolor de cabeza en el grupo de WhatsApp, ahora lo hago en segundos.",
      rating: 5
    },
    {
      name: "Miguel Torres",
      role: "Jefe de Seguridad, Residencial Altos",
      quote: "El control biométrico nos ha dado una tranquilidad invaluable. Sabemos exactamente quién entra y sale en tiempo real.",
      rating: 5
    },
    {
      name: "Ana Lucía Ríos",
      role: "Presidenta de Junta",
      quote: "La comunicación con los vecinos mejoró drásticamente. Las notificaciones de incidencias llegan a todos de inmediato y todo queda registrado.",
      rating: 5
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false, // Ocultamos flechas aquí para un diseño más limpio
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section id="testimonios" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0d1b2a 50%, #020617 100%)', overflow: 'hidden' }}>
      {/* Decorative glow */}
      <div className="position-absolute top-0 end-0" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5" data-aos="fade-down">
          <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '4px' }}>Casos de Éxito</h6>
          <h2 className="display-4 fw-bold text-white mb-4">Lo que dicen <span className="text-info">nuestros clientes</span></h2>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: '700px' }}>
            Comunidades reales que han transformado su gestión y seguridad gracias a la tecnología de Domus.
          </p>
        </div>

        <div className="testimonial-carousel" data-aos="fade-up" data-aos-delay="200">
          <SlickSlider {...settings}>
            {testimonials.map((t, i) => (
              <div key={i} className="px-3 py-4 h-100 w-100">
                <div className="testimonial-card p-4 d-flex flex-column h-100">
                  <div className="mb-3 text-info">
                    {[...Array(t.rating)].map((_, index) => (
                      <i key={index} className="bi bi-star-fill me-1"></i>
                    ))}
                  </div>
                  <p className="fst-italic text-white mb-4 flex-grow-1" style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: '0.95' }}>"{t.quote}"</p>
                  <div className="d-flex align-items-center mt-auto pt-3 border-top border-light border-opacity-25">
                    <div className="avatar-circle me-3 shadow">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-0">{t.name}</h6>
                      <small className="text-info" style={{ fontSize: '0.8rem' }}>{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </SlickSlider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;