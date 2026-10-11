// ===== ESCAPE HTML =====
// Cegah XSS — escape karakter berbahaya

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// Escape untuk atribut
export function escapeAttr(str) {
  return escapeHtml(str);
}

// Escape untuk URL
export function escapeUrl(str) {
  if (!str) return '';
  try {
    return encodeURI(str);
  } catch (e) {
    return '';
  }
}