const SIZES = { xs: '1rem', sm: '1.25rem', md: '2rem', lg: '3rem', xl: '4rem' };

export function Spinner({ size = 'md', text, color = 'info', inline = false, grow = false }) {
  const cls = grow ? 'spinner-grow' : 'spinner-border';
  const style = { width: SIZES[size] || SIZES.md, height: SIZES[size] || SIZES.md };
  if (inline) {
    return <span className={`${cls} ${cls}-sm text-${color}`} role="status" style={style} aria-hidden="true" />;
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-4">
      <div className={`${cls} text-${color}`} style={style} role="status" aria-label="Cargando" />
      {text && <span className="text-secondary small">{text}</span>}
    </div>
  );
}

export default Spinner;
