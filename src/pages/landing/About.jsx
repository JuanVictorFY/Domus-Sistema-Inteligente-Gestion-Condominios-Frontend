import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const About = () => {
  const stats = [
    { target: 500, prefix: "+", suffix: "", label: "Condominios Activos" },
    { target: 15, prefix: "", suffix: "k+", label: "Residentes Felices" },
    { target: 99.9, prefix: "", suffix: "%", label: "Uptime del Sistema" },
    { target: 24, prefix: "", suffix: "/7", label: "Soporte Dedicado" }
  ];

  return (
    <section id="about" className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #081225 50%, #020617 100%)', overflow: 'hidden' }}>
      {/* Decorative orbs */}
      <div className="position-absolute" style={{ top: '20%', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div className="position-absolute" style={{ bottom: '10%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,86,179,0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        
        {/* Historia / Misión */}
        <div className="row align-items-center g-5 mb-5 pb-5">
          <div className="col-lg-6" data-aos="fade-right">
            <h6 className="text-info fw-bold text-uppercase mb-3" style={{ letterSpacing: '3px' }}>Nuestra Misión</h6>
            <h1 className="display-4 fw-bold text-white mb-4">Construyendo el futuro de la <span className="text-info">convivencia.</span></h1>
            <p className="text-white-50 fs-5 lh-lg mb-4">
              Domus nació al ver cómo los administradores de edificios luchaban con la morosidad y la falta de herramientas tecnológicas. Creemos que tu hogar debe ser un lugar de paz, no de estrés administrativo.
            </p>
            <p className="text-white-50 fs-5 lh-lg">
              Nuestro equipo está formado por expertos en seguridad, desarrollo de software y bienes raíces, unidos por una sola visión: crear el sistema más seguro, intuitivo y poderoso del mercado inmobiliario.
            </p>
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <div className="position-relative p-1 rounded-5" style={{ background: 'linear-gradient(45deg, #0056b3, #00d4ff)' }}>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" 
                alt="Equipo Domus" 
                className="img-fluid rounded-5"
                style={{ opacity: '0.9' }}
              />
            </div>
          </div>
        </div>

        {/* Estadísticas de Impacto - Animadas */}
        <div className="row g-4 mt-3">
          {stats.map((stat, i) => (
            <div className="col-md-3 col-6" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
              <div className="text-center p-4 rounded-4" style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 className="display-5 fw-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                  <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                </h2>
                <span className="text-info text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
