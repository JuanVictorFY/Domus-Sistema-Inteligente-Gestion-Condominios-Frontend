const ProgressBar = ({ value = 0, max = 100, color = 'primary', label, showPercent = false, height = 8 }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      {(label || showPercent) && (
        <div className="d-flex justify-content-between mb-1">
          {label && <small className="text-secondary">{label}</small>}
          {showPercent && <small className="text-secondary">{percent.toFixed(0)}%</small>}
        </div>
      )}
      <div className="progress" style={{ height, borderRadius: height / 2, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div
          className={`progress-bar bg-${color}`}
          role="progressbar"
          style={{ width: `${percent}%`, borderRadius: height / 2, transition: 'width 0.4s ease' }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
