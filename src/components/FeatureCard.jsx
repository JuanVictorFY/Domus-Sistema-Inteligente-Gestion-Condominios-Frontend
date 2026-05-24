import { useState } from 'react';

const FeatureCard = ({ icon, title, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Estilos dinámicos para la tarjeta principal (Glassmorphism oscuro)
  const cardStyle = {
    borderRadius: '24px',
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0, 212, 255, 0.4)' 
      : '0 10px 20px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)',
    cursor: 'pointer',
    height: '100%',
    backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)'
  };

  return (
    <div 
      className="card border-0 p-3 feature-card-item" 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body text-center d-flex flex-column justify-content-start align-items-center h-100">
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-4 rounded-circle icon-container" 
          style={{ 
            width: '65px', 
            height: '65px', 
            backgroundColor: isHovered ? '#0056b3' : 'rgba(0, 212, 255, 0.1)',
            color: isHovered ? '#fff' : '#00d4ff',
            border: isHovered ? 'none' : '1px solid rgba(0, 212, 255, 0.2)',
            transition: 'all 0.4s ease',
            boxShadow: isHovered ? '0 10px 20px rgba(0, 212, 255, 0.4)' : 'none'
          }}
        >
          <i className={`bi ${icon} fs-2`}></i>
        </div>

        <h5 className="fw-bold mb-3 text-white">{title}</h5>
        <p className="mb-0 text-white-50" style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;