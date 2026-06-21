export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function paginate(page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return { page: p, limit: l, offset: (p - 1) * l };
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export function calculateScore(items, weights) {
  let total = 0;
  let maxTotal = 0;
  for (const [key, value] of Object.entries(items)) {
    total += (value || 0) * (weights[key] || 1);
    maxTotal += 100 * (weights[key] || 1);
  }
  return Math.round((total / maxTotal) * 100);
}

export function formatDate(date) {
  return new Date(date).toISOString();
}
