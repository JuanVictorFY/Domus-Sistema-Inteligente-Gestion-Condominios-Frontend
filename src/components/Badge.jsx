const COLOR_MAP = {
  success:   { bg: 'rgba(25,135,84,0.2)',  text: '#198754', border: '#198754' },
  danger:    { bg: 'rgba(220,53,69,0.2)',  text: '#dc3545', border: '#dc3545' },
  warning:   { bg: 'rgba(255,193,7,0.2)',  text: '#ffc107', border: '#ffc107' },
  info:      { bg: 'rgba(13,202,240,0.2)', text: '#0dcaf0', border: '#0dcaf0' },
  secondary: { bg: 'rgba(108,117,125,0.2)',text: '#6c757d', border: '#6c757d' },
  primary:   { bg: 'rgba(13,110,253,0.2)', text: '#0d6efd', border: '#0d6efd' },
};

const Badge = ({ label, color = 'secondary', size = 'sm' }) => {
  const c = COLOR_MAP[color] || COLOR_MAP.secondary;
  const fontSize = size === 'xs' ? '0.65rem' : '0.75rem';
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 20, padding: '3px 10px', fontSize, fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
};

export default Badge;
