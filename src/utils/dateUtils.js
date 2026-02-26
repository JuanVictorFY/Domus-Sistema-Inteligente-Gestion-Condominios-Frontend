const LOCALE = 'es-PE';

export const formatDate = (date) =>
  new Date(date).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatRelative = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return 'Ahora mismo';
  if (mins  < 60)  return `Hace ${mins} min`;
  if (hours < 24)  return `Hace ${hours}h`;
  if (days  < 7)   return `Hace ${days} días`;
  return formatDate(date);
};

export const isExpired = (date) => new Date(date) < new Date();

export const isFuture = (date) => new Date(date) > new Date();

export const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export const toInputDate = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatMonth = (date) =>
  new Date(date).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });

export const daysBetween = (a, b) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.round((new Date(b) - new Date(a)) / msPerDay));
};

// Relative time
export const getRelativeTime = (date) => { const diff = Date.now() - new Date(date); const days = Math.floor(diff / 86400000); return days === 0 ? "hoy" : days === 1 ? "ayer" : `hace ${days} dias`; };
