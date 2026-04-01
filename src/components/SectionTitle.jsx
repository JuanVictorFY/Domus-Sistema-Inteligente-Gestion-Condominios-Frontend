const SectionTitle = ({ title, subtitle, center = false }) => (
  <div className={`mb-5 ${center ? 'text-center' : ''}`}>
    <h2 className="fw-bold text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>{title}</h2>
    {subtitle && (
      <p className="text-secondary" style={{ maxWidth: center ? 560 : '100%', margin: center ? '0 auto' : 0, fontSize: '1.05rem' }}>
        {subtitle}
      </p>
    )}
    <div style={{ width: 48, height: 4, background: 'linear-gradient(90deg,#0056b3,#00d4ff)', borderRadius: 2, marginTop: 12, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }} />
  </div>
);

export default SectionTitle;
