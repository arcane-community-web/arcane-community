// ===== LANG — Bilingual ID/EN ARCANE =====
// Translate elemen dengan data-i18n
// Tersimpan di localStorage

(function() {
  'use strict';

  const STORAGE_KEY = 'arcane-lang';

  // ===== Kamus =====
  const translations = {
    id: {
      // Navbar
      'nav.home': 'Beranda',
      'nav.about': 'Tentang',
      'nav.services': 'Layanan',
      'nav.news': 'Info',
      'nav.events': 'Acara',
      'nav.gallery': 'Galeri',
      'nav.login': 'Masuk',

      // Hero
      'hero.badge': 'Komunitas Informasi & Digital',
      'hero.title': 'Informasi. Kreativitas. Komunitas.',
      'hero.subtitle': 'ARCANE Community berbagi informasi sekolah dan menyediakan jasa digital untuk anggota maupun publik.',
      'hero.cta1': 'Lihat Berita',
      'hero.cta2': 'Tentang Kami',

      // Berita
      'news.tag': 'Info Sekolah',
      'news.title': 'Berita & Informasi Terbaru',
      'news.desc': 'Update seputar kegiatan, pengumuman, dan informasi sekolah.',

      // Acara
      'events.tag': 'Acara',
      'events.title': 'Acara Mendatang',
      'events.desc': 'Jadwal kegiatan dan acara ARCANE Community.',
      'events.empty.title': 'Belum Ada Acara',
      'events.empty.desc': 'Acara akan muncul di sini kalau sudah ditambahkan.',
      'events.priority': 'Prioritas',
      'events.location.tba': 'Belum ditentukan',

      // Galeri
      'gallery.tag': 'Galeri',
      'gallery.title': 'Momen & Karya',
      'gallery.desc': 'Dokumentasi kegiatan dan hasil karya ARCANE Community.',

      // Footer
      'footer.tagline': 'Informasi. Kreativitas. Komunitas.',
      'footer.rights': 'Hak cipta dilindungi.',

      // Dashboard
      'dash.title': 'Dashboard',
      'dash.statistik': 'Statistik',
      'dash.berita': 'Berita',
      'dash.acara': 'Acara',
      'dash.galeri': 'Galeri',
      'dash.pengaturan': 'Pengaturan',
      'dash.console': 'Console',
      'dash.web': 'Web Utama',
      'dash.logout': 'Logout',

      // Statistik
      'stat.title': 'Statistik',
      'stat.desc': 'Ringkasan konten ARCANE Community',
      'stat.news': 'Berita',
      'stat.events': 'Acara',
      'stat.gallery': 'Gambar',

      // Berita (admin)
      'admin.news.title': 'Berita',
      'admin.news.desc': 'Kelola berita ARCANE Community',
      'admin.news.add': 'Tambah Berita',
      'admin.news.empty': 'Belum ada berita.',

      // Acara (admin)
      'admin.events.title': 'Acara',
      'admin.events.desc': 'Kelola acara ARCANE Community',
      'admin.events.add': 'Tambah Acara',
      'admin.events.empty': 'Belum ada acara.',

      // Galeri (admin)
      'admin.gallery.title': 'Galeri',
      'admin.gallery.desc': 'Kelola galeri ARCANE Community',
      'admin.gallery.add': 'Upload Gambar',
      'admin.gallery.empty': 'Belum ada gambar.',

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

      // Modal
      'modal.cancel': 'Batal',
      'modal.save': 'Simpan',
      'modal.delete': 'Hapus',
      'modal.confirm': 'Konfirmasi',

      // Welcome
      'welcome.title': 'Welcome',
      'welcome.sub': 'Selamat datang di ARCANE Community'
    },

    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.news': 'News',
      'nav.events': 'Events',
      'nav.gallery': 'Gallery',
      'nav.login': 'Login',

      // Hero
      'hero.badge': 'Info & Digital Community',
      'hero.title': 'Information. Creativity. Community.',
      'hero.subtitle': 'ARCANE Community shares school information and provides digital services for members and the public.',
      'hero.cta1': 'View News',
      'hero.cta2': 'About Us',

      // Berita
      'news.tag': 'School Info',
      'news.title': 'Latest News & Info',
      'news.desc': 'Updates on activities, announcements, and school information.',

      // Acara
      'events.tag': 'Events',
      'events.title': 'Upcoming Events',
      'events.desc': 'Schedule of ARCANE Community events and activities.',
      'events.empty.title': 'No Events Yet',
      'events.empty.desc': 'Events will appear here once added.',
      'events.priority': 'Priority',
      'events.location.tba': 'TBA',

      // Galeri
      'gallery.tag': 'Gallery',
      'gallery.title': 'Moments & Works',
      'gallery.desc': 'Documentation of ARCANE Community activities and works.',

      // Footer
      'footer.tagline': 'Information. Creativity. Community.',
      'footer.rights': 'All rights reserved.',

      // Dashboard
      'dash.title': 'Dashboard',
      'dash.statistik': 'Statistics',
      'dash.berita': 'News',
      'dash.acara': 'Events',
      'dash.galeri': 'Gallery',
      'dash.pengaturan': 'Settings',
      'dash.console': 'Console',
      'dash.web': 'Main Web',
      'dash.logout': 'Logout',

      // Statistik
      'stat.title': 'Statistics',
      'stat.desc': 'ARCANE Community content summary',
      'stat.news': 'News',
      'stat.events': 'Events',
      'stat.gallery': 'Images',

      // Berita (admin)
      'admin.news.title': 'News',
      'admin.news.desc': 'Manage ARCANE Community news',
      'admin.news.add': 'Add News',
      'admin.news.empty': 'No news yet.',

      // Acara (admin)
      'admin.events.title': 'Events',
      'admin.events.desc': 'Manage ARCANE Community events',
      'admin.events.add': 'Add Event',
      'admin.events.empty': 'No events yet.',

      // Galeri (admin)
      'admin.gallery.title': 'Gallery',
      'admin.gallery.desc': 'Manage ARCANE Community gallery',
      'admin.gallery.add': 'Upload Image',
      'admin.gallery.empty': 'No images yet.',

      // Console
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

      // Modal
      'modal.cancel': 'Cancel',
      'modal.save': 'Save',
      'modal.delete': 'Delete',
      'modal.confirm': 'Confirm',

      // Welcome
      'welcome.title': 'Welcome',
      'welcome.sub': 'Welcome to ARCANE Community'
    }
  };

  // ===== Get bahasa sekarang =====
  function getLang() {
    return window.currentLang || 'id';
  }

  // ===== Translate =====
  function t(key) {
    const lang = getLang();
    return (translations[lang] && translations[lang][key]) || 
           (translations.id && translations.id[key]) || 
           key;
  }

  // ===== Apply bahasa =====
  function applyLang(lang) {
    if (!translations[lang]) lang = 'id';

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

    // Translate placeholder dengan data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      const key = el.dataset.i18nPh;
      const val = t(key);
      if (val) el.placeholder = val;
    });

    // Update tombol bahasa
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'id' ? 'EN' : 'ID';

    console.log('[Lang] Ganti ke: ' + lang);

    // Re-render konten dinamis
    if (typeof window.ArcaneRenderPublic === 'object') {
      window.ArcaneRenderPublic.renderAll();
    }
    if (typeof window.ArcaneRenderAdmin === 'object') {
      window.ArcaneRenderAdmin.renderAll();
    }
    if (typeof window.renderLogs === 'function') {
      window.renderLogs();
    }
  }

  // ===== Toggle bahasa =====
  function toggleLang() {
    const current = getLang();
    applyLang(current === 'id' ? 'en' : 'id');
  }

  // ===== Init =====
  function init() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    // Auto-detect dari browser
    const browserLang = (navigator.language || 'id').toLowerCase();
    const detected = browserLang.startsWith('en') ? 'en' : 'id';

    const lang = saved || detected;

    window.currentLang = lang;

    // Apply setelah DOM siap
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { applyLang(lang); });
    } else {
      applyLang(lang);
    }

    // Bind toggle
    document.addEventListener('DOMContentLoaded', function() {
      const btn = document.getElementById('langToggle');
      if (btn) btn.addEventListener('click', toggleLang);
    });

    console.log('[Lang] Init: ' + lang);
  }

  // ===== Auto-init =====
  init();

  // ===== Expose =====
  window.ArcaneLang = {
    get: getLang,
    set: applyLang,
    toggle: toggleLang,
    t: t
  };
})();