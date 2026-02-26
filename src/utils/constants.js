export const ROLES = {
  ADMIN: 'admin',
  RESIDENTE: 'residente',
  SEGURIDAD: 'seguridad',
};

export const TICKET_STATUSES = {
  Pendiente:   { label: 'Pendiente',   color: 'warning' },
  'En proceso':{ label: 'En proceso',  color: 'info'    },
  Resuelto:    { label: 'Resuelto',    color: 'success' },
  Cerrado:     { label: 'Cerrado',     color: 'secondary' },
};

export const RESERVATION_STATUSES = {
  Pendiente:  { label: 'Pendiente',  color: 'warning' },
  Aprobada:   { label: 'Aprobada',   color: 'success' },
  Rechazada:  { label: 'Rechazada',  color: 'danger'  },
  Cancelada:  { label: 'Cancelada',  color: 'secondary' },
};

export const PRIORITIES = {
  Alta:  { label: 'Alta',  color: 'danger'  },
  Media: { label: 'Media', color: 'warning' },
  Baja:  { label: 'Baja',  color: 'info'    },
};

export const NAV_LINKS = [
  { to: '/',         label: 'Inicio'   },
  { to: '/#features',label: 'Funciones'},
  { to: '/#steps',   label: 'Cómo usar'},
  { to: '/#pricing', label: 'Precios'  },
  { to: '/#contact', label: 'Contacto' },
];

export const USER_STATUSES = {
  ACTIVO:   { label: 'Activo',   color: 'success'   },
  INACTIVO: { label: 'Inactivo', color: 'secondary' },
  PENDIENTE:{ label: 'Pendiente',color: 'warning'   },
};

export const DOCUMENT_TYPES = {
  Reglamento: { label: 'Reglamento', icon: 'bi-shield-fill-check' },
  Acta:       { label: 'Acta',       icon: 'bi-file-earmark-text' },
  Circular:   { label: 'Circular',   icon: 'bi-envelope-paper'    },
  Contrato:   { label: 'Contrato',   icon: 'bi-file-earmark-lock' },
  Otro:       { label: 'Otro',       icon: 'bi-file-earmark'      },
};

export const MAINTENANCE_STATUSES = {
  PENDIENTE:   { label: 'Pendiente',   color: 'warning'   },
  EN_PROCESO:  { label: 'En proceso',  color: 'info'      },
  COMPLETADO:  { label: 'Completado',  color: 'success'   },
  CANCELADO:   { label: 'Cancelado',   color: 'secondary' },
};

export const PAGINATION_DEFAULTS = { page: 1, limit: 10, maxPages: 100 };
