const COLORS = ['#0dcaf0', '#198754', '#ffc107', '#0d6efd', '#6f42c1', '#fd7e14'];

const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

const colorFor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const Avatar = ({ name, size = 36, className = '' }) => {
  const color = colorFor(name);
  return (
    <div
      className={className}
      style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color, flexShrink: 0 }}
    >
      {initials(name)}
    </div>
  );
};

export default Avatar;
