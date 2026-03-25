const StatCard = ({ icon, label, value, color = '#0dcaf0', trend, subtitle, onClick }) => (
  <div
    className={`card bg-dark border-secondary h-100 ${onClick ? 'cursor-pointer' : ''}`}
    style={{ borderRadius: 16, transition: 'transform 0.2s, box-shadow 0.2s', cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
    onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
    onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <div className="card-body d-flex align-items-center gap-3 p-4">
      <div style={{ background: `${color}1a`, borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`bi ${icon}`} style={{ fontSize: '1.5rem', color }}></i>
      </div>
      <div className="flex-grow-1 min-w-0">
        <p className="text-secondary mb-1" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
        <h3 className="text-white mb-0 fw-bold">{value}</h3>
        {subtitle && <p className="text-secondary mb-0" style={{ fontSize: '0.8rem' }}>{subtitle}</p>}
        {trend !== undefined && trend !== null && (
          <small className={`text-${trend > 0 ? 'success' : trend < 0 ? 'danger' : 'secondary'}`}>
            {trend !== 0 && <i className={`bi bi-arrow-${trend > 0 ? 'up' : 'down'}`}></i>}
            {trend === 0 ? 'Sin cambios' : ` ${Math.abs(trend)}% este mes`}
          </small>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;
