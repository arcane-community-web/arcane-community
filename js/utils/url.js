// ===== VALIDASI URL =====
// Tolak URL berbahaya (javascript:, data:, dll)

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();

  // Cek protocol
  for (const bad of BLOCKED_PROTOCOLS) {
    if (trimmed.toLowerCase().startsWith(bad)) return false;
  }

  // URL relatif (tanpa protocol) — izinkan
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;

  // Cek protocol yang diizinkan
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch (e) {
    // Bukan URL valid — tapi mungkin relative path
    return !trimmed.includes(':');
  }
}

export function safeUrl(url) {
  return isValidUrl(url) ? url : '#';
}

// Bersihkan URL (trim + remove trailing slash)
export function cleanUrl(url) {
  if (!url) return '';
  return String(url).trim();
}