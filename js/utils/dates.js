// ===== FORMAT TANGGAL =====
// Bilingual ID/EN

const LOCALES = {
  id: 'id-ID',
  en: 'en-US'
};

export function getLocale(lang) {
  return LOCALES[lang] || LOCALES.id;
}

// Format tanggal panjang — "15 Oktober 2026"
export function formatDate(date, lang) {
  if (!date) return '';
  const d = toDate(date);
  if (!d) return '';
  return d.toLocaleDateString(getLocale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Format tanggal pendek — "15 Okt 2026"
export function formatDateShort(date, lang) {
  if (!date) return '';
  const d = toDate(date);
  if (!d) return '';
  return d.toLocaleDateString(getLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format waktu — "19:00"
export function formatTime(date) {
  if (!date) return '';
  const d = toDate(date);
  if (!d) return '';
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Format tanggal + waktu acara
export function formatEventDate(start, end, lang) {
  if (!start) return '';
  const s = toDate(start);
  if (!s) return '';

  const dateStr = formatDateShort(s, lang);
  const timeStr = formatTime(s);

  if (!end) {
    return `<strong>${dateStr}</strong>, ${timeStr}`;
  }

  const e = toDate(end);
  if (!e) return `<strong>${dateStr}</strong>, ${timeStr}`;

  const endDateStr = formatDateShort(e, lang);
  const endTimeStr = formatTime(e);

  // Kalau tanggal sama
  if (dateStr === endDateStr) {
    return `<strong>${dateStr}</strong>, ${timeStr} - ${endTimeStr}`;
  }

  // Kalau beda hari
  return `<strong>${dateStr} - ${endDateStr}</strong>, ${timeStr} - ${endTimeStr}`;
}

// Timestamp relatif — "3 hari lalu"
export function timeAgo(date, lang) {
  if (!date) return '';
  const d = toDate(date);
  if (!d) return '';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const isId = (lang || 'id') === 'id';

  if (seconds < 60) return isId ? 'baru saja' : 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isId ? `${minutes} menit lalu` : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isId ? `${hours} jam lalu` : `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return isId ? `${days} hari lalu` : `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return isId ? `${months} bulan lalu` : `${months}mo ago`;

  const years = Math.floor(months / 12);
  return isId ? `${years} tahun lalu` : `${years}y ago`;
}

// Helper: convert ke Date
function toDate(date) {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (date.toDate && typeof date.toDate === 'function') {
    // Firestore Timestamp
    return date.toDate();
  }
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

// Cek apakah tanggal sudah lewat
export function isPast(date) {
  const d = toDate(date);
  if (!d) return false;
  return d < new Date();
}