const STATUS_MAP = {
  ACTIVO:          { label: 'Activo',        cls: 'bg-success' },
  PENDIENTE:       { label: 'Pendiente',     cls: 'bg-warning text-dark' },
  INACTIVO:        { label: 'Inactivo',      cls: 'bg-secondary' },
  Pendiente:       { label: 'Pendiente',     cls: 'bg-warning text-dark' },
  Aprobada:        { label: 'Aprobada',      cls: 'bg-success' },
  Rechazada:       { label: 'Rechazada',     cls: 'bg-danger' },
  Cancelada:       { label: 'Cancelada',     cls: 'bg-secondary' },
  CONFIRMADA:      { label: 'Confirmada',    cls: 'bg-success' },
  'En Recepción':  { label: 'En Recepción',  cls: 'bg-info text-dark' },
  Entregado:       { label: 'Entregado',     cls: 'bg-success' },
  ENTREGADO:       { label: 'Entregado',     cls: 'bg-success' },
  DEVUELTO:        { label: 'Devuelto',      cls: 'bg-secondary' },
  Activa:          { label: 'Activa',        cls: 'bg-success' },
  Cerrada:         { label: 'Cerrada',       cls: 'bg-secondary' },
  Ingresó:         { label: 'Ingresó',       cls: 'bg-primary' },
  Salió:           { label: 'Salió',         cls: 'bg-dark border border-secondary' },
  'En proceso':    { label: 'En proceso',    cls: 'bg-info text-dark' },
  EN_PROCESO:      { label: 'En proceso',    cls: 'bg-info text-dark' },
  Resuelto:        { label: 'Resuelto',      cls: 'bg-success' },
  COMPLETADO:      { label: 'Completado',    cls: 'bg-success' },
  CANCELADO:       { label: 'Cancelado',     cls: 'bg-secondary' },
  Disponible:      { label: 'Disponible',    cls: 'bg-success' },
  Mantenimiento:   { label: 'Mantenimiento', cls: 'bg-danger' },
  Alta:            { label: 'Alta',          cls: 'bg-danger' },
  Media:           { label: 'Media',         cls: 'bg-warning text-dark' },
  Baja:            { label: 'Baja',          cls: 'bg-info text-dark' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: status, cls: 'bg-secondary' };
  return (
    <span className={`badge rounded-pill ${config.cls}`} style={{ fontSize: '0.75rem' }}>
      {config.label}
    </span>
  );
}
