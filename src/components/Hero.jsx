import { useState, useEffect } from 'react';

const heroImages = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2000',
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container position-relative overflow-hidden" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Background images with crossfade */}
      {heroImages.map((img, index) => (
        <div
          key={index}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url('${img}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentImage === index ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            animation: currentImage === index ? 'heroZoom 12s ease-in-out infinite alternate' : 'none',
            zIndex: 0
          }}
        />
      ))}

      {/* Dark overlay with gradient */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(2,6,23,0.85) 80%, #020617 100%)',
        zIndex: 1
      }} />

      {/* Floating particles */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1, pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="position-absolute rounded-circle" style={{
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            background: 'rgba(0, 212, 255, 0.4)',
            left: `${15 + i * 14}%`,
            bottom: '0',
            animation: `particleFloat ${8 + i * 3}s linear infinite`,
            animationDelay: `${i * 2}s`
          }} />
        ))}
      </div>

      {/* Content */}
      <div className="container text-center text-white hero-inner-content position-relative" style={{ zIndex: 2 }}>
        <div className="mb-4" data-aos="fade-down" data-aos-delay="100">
          <span className="badge rounded-pill px-4 py-2 fw-bold" style={{ 
            background: 'rgba(0, 212, 255, 0.1)', 
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00d4ff',
            fontSize: '0.85rem',
            letterSpacing: '2px'
          }}>
            SISTEMA INTELIGENTE DE GESTIÓN
          </span>
        </div>

        <h1 className="display-1 fw-bold mb-4" data-aos="fade-down" data-aos-delay="200" style={{ lineHeight: '1.1' }}>
          Eleva el diseño y control <br/>
          <span style={{ 
            background: 'linear-gradient(90deg, #00d4ff, #0056b3, #00d4ff)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'textShimmer 4s linear infinite'
          }}>de tu condominio</span>
        </h1>
        
        <p className="lead fs-4 mb-5 opacity-75 mx-auto" style={{ maxWidth: '700px' }} data-aos="fade-up" data-aos-delay="300">
          Un sistema de gestión moderno y eficiente para administradores y residentes
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x pb-4" style={{ zIndex: 2, animation: 'float 2s ease-in-out infinite' }}>
        <i className="bi bi-chevron-double-down text-white-50 fs-4"></i>
      </div>
    </div>
  );
};

export default Hero;
