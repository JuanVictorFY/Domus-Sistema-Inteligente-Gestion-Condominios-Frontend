const TimelineItem = ({ icon, title, description, date, color = 'info', last = false }) => (
  <div className="d-flex gap-3">
    <div className="d-flex flex-column align-items-center" style={{ width: 32, flexShrink: 0 }}>
      <div
        style={{ width: 32, height: 32, borderRadius: '50%', background: `var(--bs-${color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <i className={`bi ${icon} text-dark`} style={{ fontSize: '0.9rem' }}></i>
      </div>
      {!last && <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.1)', marginTop: 4, marginBottom: 4 }} />}
    </div>
    <div className={last ? 'pb-0' : 'pb-4'}>
      <p className="text-white fw-semibold mb-0">{title}</p>
      {description && <p className="text-secondary mb-1" style={{ fontSize: '0.85rem' }}>{description}</p>}
      {date && <small className="text-secondary opacity-75">{date}</small>}
    </div>
  </div>
);

const Timeline = ({ items = [] }) => (
  <div>
    {items.map((item, i) => (
      <TimelineItem key={i} {...item} last={i === items.length - 1} />
    ))}
  </div>
);

export { TimelineItem };
export default Timeline;
