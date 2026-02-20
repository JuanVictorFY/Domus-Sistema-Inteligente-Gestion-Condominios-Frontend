export const required = (v) => (v === undefined || v === null || String(v).trim() === '' ? 'Este campo es obligatorio.' : null);
export const minLength = (n) => (v) => (String(v).trim().length < n ? `Mínimo ${n} caracteres.` : null);
export const maxLength = (n) => (v) => (String(v).trim().length > n ? `Máximo ${n} caracteres.` : null);
export const isEmail   = (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v?.trim()) ? null : 'Ingresa un correo válido.');
export const isPhone   = (v) => (/^[\d\s\+\-\(\)]{7,15}$/.test(v?.trim()) ? null : 'Número de teléfono no válido.');

export const validate = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (fields) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, { value, rules }]) => [key, validate(value, rules)])
  );

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const isStrongPassword = (v) =>
  v?.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v)
    ? null
    : 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';

export const isPositive = (v) =>
  Number(v) > 0 ? null : 'El valor debe ser mayor a cero.';

export const isDate = (v) =>
  v && !isNaN(new Date(v).getTime()) ? null : 'Ingresa una fecha válida.';

export const matches = (field, message) => (v, values) =>
  v === values?.[field] ? null : message || `No coincide con ${field}.`;

export const isUrl = (v) => {
  try { new URL(v); return null; }
  catch { return 'Ingresa una URL válida.'; }
};
