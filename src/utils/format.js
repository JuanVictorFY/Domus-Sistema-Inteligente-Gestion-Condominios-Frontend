export const formatCurrency = (amount, currency = 'PEN') =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount);

export const formatNumber = (n) =>
  new Intl.NumberFormat('es-PE').format(n);

export const truncate = (str, max = 80) =>
  str?.length > max ? str.slice(0, max) + '...' : str;

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export const initials = (name) =>
  name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

export const pluralize = (count, singular, plural) =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural}`;

export const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

export const bytesToHuman = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});

export const sortBy = (arr, key, direction = 'asc') => {
  const sorted = [...arr].sort((a, b) => {
    const va = typeof key === 'function' ? key(a) : a[key];
    const vb = typeof key === 'function' ? key(b) : b[key];
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
};

export const downloadCSV = (data, filename = 'reporte') => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) => Object.values(row).map((v) => `"${v ?? ''}"`).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
