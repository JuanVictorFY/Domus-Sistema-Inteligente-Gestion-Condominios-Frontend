const PREFIX = 'domus_';

const key = (k) => `${PREFIX}${k}`;

export const storage = {
  get: (k, fallback = null) => {
    try { const v = localStorage.getItem(key(k)); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (k, v) => { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch {} },
  remove: (k) => { try { localStorage.removeItem(key(k)); } catch {} },
  has: (k) => localStorage.getItem(key(k)) !== null,
  keys: () => Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).map((k) => k.slice(PREFIX.length)),
  clear: () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
  getWithExpiry: (k) => {
    try {
      const item = localStorage.getItem(key(k));
      if (!item) return null;
      const { value, expiry } = JSON.parse(item);
      if (Date.now() > expiry) { localStorage.removeItem(key(k)); return null; }
      return value;
    } catch { return null; }
  },
  setWithExpiry: (k, v, ttlMs) => {
    try {
      localStorage.setItem(key(k), JSON.stringify({ value: v, expiry: Date.now() + ttlMs }));
    } catch {}
  },
};
