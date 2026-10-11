// ===== I18N — Bilingual ID/EN =====

const STORAGE_KEY = 'arcane-lang';

// ===== Kamus =====
const DICT = {
  id: {
    // Navbar
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.news': 'Info',
    'nav.events': 'Acara',
    'nav.gallery': 'Galeri',
    'nav.login': 'Masuk',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',

    // Hero (fallback — kalau Firestore nggak ada)
    'hero.badge': 'Komunitas Informasi & Digital',
    'hero.title': 'Informasi. Kreativitas. Komunitas.',
    'hero.subtitle': 'ARCANE Community berbagi informasi sekolah dan menyediakan jasa digital untuk anggota maupun publik.',
    'hero.cta1': 'Lihat Berita',
    'hero.cta2': 'Tentang Kami',

    // Section
    'news.tag': 'Info Sekolah',
    'news.title': 'Berita & Informasi Terbaru',
    'news.desc': 'Update seputar kegiatan, pengumuman, dan informasi sekolah.',
    'news.empty': 'Belum ada berita.',
    'events.tag': 'Acara',
    'events.title': 'Acara Mendatang',
    'events.desc': 'Jadwal kegiatan dan acara ARCANE Community.',
    'events.empty': 'Belum ada acara.',
    'events.empty.desc': 'Acara akan muncul di sini kalau sudah ditambahkan.',
    'events.priority': 'Prioritas',
    'events.location.tba': 'Belum ditentukan',
    'gallery.tag': 'Galeri',
    'gallery.title': 'Momen & Karya',
    'gallery.desc': 'Dokumentasi kegiatan dan hasil karya ARCANE Community.',
    'gallery.empty': 'Belum ada gambar.',

    // Footer
    'footer.tagline': 'Informasi. Kreativitas. Komunitas.',
    'footer.rights': 'Hak cipta dilindungi.',

    // Welcome
    'welcome.sub': 'Selamat datang di ARCANE Community',

    // Dashboard
    'dash.title': 'Dashboard',
    'dash.statistik': 'Statistik',
    'dash.berita': 'Berita',
    'dash.acara': 'Acara',
    'dash.galeri': 'Galeri',
    'dash.konten': 'Konten',
    'dash.kategori': 'Kategori',
    'dash.pengguna': 'Pengguna',
    'dash.pengaturan': 'Pengaturan',
    'dash.aktivitas': 'Aktivitas',
    'dash.console': 'Console',
    'dash.web': 'Web Utama',
    'dash.logout': 'Logout',
    'dash.arsip': 'Arsip',

    // Statistik
    'stat.title': 'Statistik',
    'stat.desc': 'Ringkasan konten ARCANE Community',
    'stat.news': 'Berita',
    'stat.events': 'Acara',
    'stat.gallery': 'Gambar',

    // Form
    'form.add': 'Tambah',
    'form.edit': 'Edit',
    'form.save': 'Simpan',
    'form.cancel': 'Batal',
    'form.delete': 'Hapus',
    'form.archive': 'Arsipkan',
    'form.restore': 'Pulihkan',
    'form.confirm': 'Konfirmasi',
    'form.yes': 'Ya',
    'form.no': 'Tidak',

    // Toast
    'toast.saved': 'Berhasil disimpan.',
    'toast.archived': 'Berhasil diarsipkan.',
    'toast.restored': 'Berhasil dipulihkan.',
    'toast.deleted': 'Berhasil dihapus.',
    'toast.failed': 'Gagal. Coba lagi.',
    'toast.uploaded': 'Gambar berhasil diunggah.',

    // Console
    'console.title': 'Console Log',
    'console.desc': 'Log aktivitas & error sistem',
    'console.filter.all': 'Semua',
    'console.filter.success': 'Sukses',
    'console.filter.warning': 'Warning',
    'console.filter.error': 'Error',
    'console.clear': 'Clear',
    'console.empty': 'Belum ada log.',
    'console.detail': 'Klik untuk detail teknis →',
    'console.back': '← Kembali',
    'console.copy': '📋 Copy Error',

    // Login
    'login.title': 'ARCANE',
    'login.subtitle': 'Masuk untuk melanjutkan',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.btn': 'Masuk',
    'login.loading': 'Memproses...',
    'login.footer': 'Informasi. Kreativitas. Komunitas.'
  },

  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.news': 'News',
    'nav.events': 'Events',
    'nav.gallery': 'Gallery',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',

    'hero.badge': 'Info & Digital Community',
    'hero.title': 'Information. Creativity. Community.',
    'hero.subtitle': 'ARCANE Community shares school information and provides digital services for members and the public.',
    'hero.cta1': 'View News',
    'hero.cta2': 'About Us',

    'news.tag': 'School Info',
    'news.title': 'Latest News & Info',
    'news.desc': 'Updates on activities, announcements, and school information.',
    'news.empty': 'No news yet.',
    'events.tag': 'Events',
    'events.title': 'Upcoming Events',
    'events.desc': 'Schedule of ARCANE Community events and activities.',
    'events.empty': 'No events yet.',
    'events.empty.desc': 'Events will appear here once added.',
    'events.priority': 'Priority',
    'events.location.tba': 'TBA',
    'gallery.tag': 'Gallery',
    'gallery.title': 'Moments & Works',
    'gallery.desc': 'Documentation of ARCANE Community activities and works.',
    'gallery.empty': 'No images yet.',

    'footer.tagline': 'Information. Creativity. Community.',
    'footer.rights': 'All rights reserved.',

    'welcome.sub': 'Welcome to ARCANE Community',

    'dash.title': 'Dashboard',
    'dash.statistik': 'Statistics',
    'dash.berita': 'News',
    'dash.acara': 'Events',
    'dash.galeri': 'Gallery',
    'dash.konten': 'Content',
    'dash.kategori': 'Categories',
    'dash.pengguna': 'Users',
    'dash.pengaturan': 'Settings',
    'dash.aktivitas': 'Activity',
    'dash.console': 'Console',
    'dash.web': 'Main Web',
    'dash.logout': 'Logout',
    'dash.arsip': 'Archive',

    'stat.title': 'Statistics',
    'stat.desc': 'ARCANE Community content summary',
    'stat.news': 'News',
    'stat.events': 'Events',
    'stat.gallery': 'Images',

    'form.add': 'Add',
    'form.edit': 'Edit',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.delete': 'Delete',
    'form.archive': 'Archive',
    'form.restore': 'Restore',
    'form.confirm': 'Confirm',
    'form.yes': 'Yes',
    'form.no': 'No',

    'toast.saved': 'Saved successfully.',
    'toast.archived': 'Archived successfully.',
    'toast.restored': 'Restored successfully.',
    'toast.deleted': 'Deleted successfully.',
    'toast.failed': 'Failed. Try again.',
    'toast.uploaded': 'Image uploaded.',

    'console.title': 'Console Log',
    'console.desc': 'Activity & error log',
    'console.filter.all': 'All',
    'console.filter.success': 'Success',
    'console.filter.warning': 'Warning',
    'console.filter.error': 'Error',
    'console.clear': 'Clear',
    'console.empty': 'No logs yet.',
    'console.detail': 'Click for technical details →',
    'console.back': '← Back',
    'console.copy': '📋 Copy Error',

    'login.title': 'ARCANE',
    'login.subtitle': 'Sign in to continue',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.btn': 'Sign In',
    'login.loading': 'Processing...',
    'login.footer': 'Information. Creativity. Community.'
  }
};

// ===== State =====
let currentLang = 'id';

// ===== Get =====
export function getLang() {
  return currentLang;
}

// ===== Translate =====
export function t(key) {
  const dict = DICT[currentLang] || DICT.id;
  return dict[key] || (DICT.id[key] || key);
}

// ===== Apply bahasa =====
export function applyLang(lang) {
  if (!DICT[lang]) lang = 'id';

  currentLang = lang;
  window.currentLang = lang;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  // Translate elemen dengan data-i18n
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val) el.textContent = val;
  });

  // Translate placeholder
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    const key = el.dataset.i18nPh;
    const val = t(key);
    if (val) el.placeholder = val;
  });

  // Update tombol bahasa
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'id' ? 'EN' : 'ID';

  console.log('[i18n] Ganti ke: ' + lang);

  // Dispatch event
  window.dispatchEvent(new CustomEvent('lang-changed', {
    detail: { lang: lang }
  }));
}

// ===== Toggle =====
export function toggleLang() {
  applyLang(currentLang === 'id' ? 'en' : 'id');
}

// ===== Init =====
export function initLang() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  const browserLang = (navigator.language || 'id').toLowerCase();
  const detected = browserLang.startsWith('en') ? 'en' : 'id';
  const lang = saved || detected;

  currentLang = lang;
  window.currentLang = lang;
  document.documentElement.lang = lang;

  // Apply setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyLang(lang);
      bindToggle();
    });
  } else {
    applyLang(lang);
    bindToggle();
  }

  console.log('[i18n] Init: ' + lang);
}

function bindToggle() {
  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', toggleLang);
}

// ===== Expose =====
window.ArcaneI18n = {
  getLang: getLang,
  t: t,
  apply: applyLang,
  toggle: toggleLang,
  init: initLang,
  DICT: DICT
};

// Auto-init
initLang();