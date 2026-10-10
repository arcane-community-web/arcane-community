// ===== LANG — Bilingual ID/EN ARCANE =====
// Translate elemen data-i18n

(function() {
  'use strict';

  const STORAGE_KEY = 'arcane-lang';

  // ===== Kamus =====
  const DICT = {
    id: {
      'nav.home': 'Beranda',
      'nav.about': 'Tentang',
      'nav.services': 'Layanan',
      'nav.news': 'Info',
      'nav.events': 'Acara',
      'nav.gallery': 'Galeri',
      'nav.login': 'Masuk',
      'hero.badge': 'Komunitas Informasi & Digital',
      'hero.title': 'Informasi. Kreativitas. Komunitas.',
      'hero.subtitle': 'ARCANE Community berbagi informasi sekolah dan menyediakan jasa digital untuk anggota maupun publik.',
      'hero.cta1': 'Lihat Berita',
      'hero.cta2': 'Tentang Kami',
      'news.tag': 'Info Sekolah',
      'news.title': 'Berita & Informasi Terbaru',
      'news.desc': 'Update seputar kegiatan, pengumuman, dan informasi sekolah.',
      'events.tag': 'Acara',
      'events.title': 'Acara Mendatang',
      'events.desc': 'Jadwal kegiatan dan acara ARCANE Community.',
      'events.empty.title': 'Belum Ada Acara',
      'events.empty.desc': 'Acara akan muncul di sini kalau sudah ditambahkan.',
      'events.priority': 'Prioritas',
      'events.location.tba': 'Belum ditentukan',
      'gallery.tag': 'Galeri',
      'gallery.title': 'Momen & Karya',
      'gallery.desc': 'Dokumentasi kegiatan dan hasil karya ARCANE Community.',
      'footer.tagline': 'Informasi. Kreativitas. Komunitas.',
      'footer.rights': 'Hak cipta dilindungi.',
      'dash.title': 'Dashboard',
      'dash.statistik': 'Statistik',
      'dash.berita': 'Berita',
      'dash.acara': 'Acara',
      'dash.galeri': 'Galeri',
      'dash.pengaturan': 'Pengaturan',
      'dash.console': 'Console',
      'dash.web': 'Web Utama',
      'dash.logout': 'Logout',
      'stat.title': 'Statistik',
      'stat.desc': 'Ringkasan konten ARCANE Community',
      'stat.news': 'Berita',
      'stat.events': 'Acara',
      'stat.gallery': 'Gambar',
      'admin.news.title': 'Berita',
      'admin.news.desc': 'Kelola berita ARCANE Community',
      'admin.news.add': 'Tambah Berita',
      'admin.news.empty': 'Belum ada berita.',
      'admin.events.title': 'Acara',
      'admin.events.desc': 'Kelola acara ARCANE Community',
      'admin.events.add': 'Tambah Acara',
      'admin.events.empty': 'Belum ada acara.',
      'admin.gallery.title': 'Galeri',
      'admin.gallery.desc': 'Kelola galeri ARCANE Community',
      'admin.gallery.add': 'Upload Gambar',
      'admin.gallery.empty': 'Belum ada gambar.',
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
      'modal.cancel': 'Batal',
      'modal.save': 'Simpan',
      'welcome.sub': 'Selamat datang di ARCANE Community'
    },
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.news': 'News',
      'nav.events': 'Events',
      'nav.gallery': 'Gallery',
      'nav.login': 'Login',
      'hero.badge': 'Info & Digital Community',
      'hero.title': 'Information. Creativity. Community.',
      'hero.subtitle': 'ARCANE Community shares school information and provides digital services for members and the public.',
      'hero.cta1': 'View News',
      'hero.cta2': 'About Us',
      'news.tag': 'School Info',
      'news.title': 'Latest News & Info',
      'news.desc': 'Updates on activities, announcements, and school information.',
      'events.tag': 'Events',
      'events.title': 'Upcoming Events',
      'events.desc': 'Schedule of ARCANE Community events and activities.',
      'events.empty.title': 'No Events Yet',
      'events.empty.desc': 'Events will appear here once added.',
      'events.priority': 'Priority',
      'events.location.tba': 'TBA',
      'gallery.tag': 'Gallery',
      'gallery.title': 'Moments & Works',
      'gallery.desc': 'Documentation of ARCANE Community activities and works.',
      'footer.tagline': 'Information. Creativity. Community.',
      'footer.rights': 'All rights reserved.',
      'dash.title': 'Dashboard',
      'dash.statistik': 'Statistics',
      'dash.berita': 'News',
      'dash.acara': 'Events',
      'dash.galeri': 'Gallery',
      'dash.pengaturan': 'Settings',
      'dash.console': 'Console',
      'dash.web': 'Main Web',
      'dash.logout': 'Logout',
      'stat.title': 'Statistics',
      'stat.desc': 'ARCANE Community content summary',
      'stat.news': 'News',
      'stat.events': 'Events',
      'stat.gallery': 'Images',
      'admin.news.title': 'News',
      'admin.news.desc': 'Manage ARCANE Community news',
      'admin.news.add': 'Add News',
      'admin.news.empty': 'No news yet.',
      'admin.events.title': 'Events',
      'admin.events.desc': 'Manage ARCANE Community events',
      'admin.events.add': 'Add Event',
      'admin.events.empty': 'No events yet.',
      'admin.gallery.title': 'Gallery',
      'admin.gallery.desc': 'Manage ARCANE Community gallery',
      'admin.gallery.add': 'Upload Image',
      'admin.gallery.empty': 'No images yet.',
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
      'modal.cancel': 'Cancel',
      'modal.save': 'Save',
      'welcome.sub': 'Welcome to ARCANE Community'
    }
  };

  // ===== Get bahasa =====
  function get() {
    return window.currentLang || 'id';
  }

  // ===== Translate =====
  function t(key) {
    const lang = get();
    return (DICT[lang] && DICT[lang][key]) || (DICT.id && DICT.id[key]) || key;
  }

  // ===== Apply =====
  function apply(lang) {
    if (!DICT[lang]) lang = 'id';

    window.currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const val = t(el.dataset.i18n);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      const val = t(el.dataset.i18nPh);
      if (val) el.placeholder = val;
    });

    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'id' ? 'EN' : 'ID';

    console.log('[Lang] Ganti ke: ' + lang);

    // Re-render konten dinamis
    if (window.ArcaneRenderPublic) window.ArcaneRenderPublic.renderAll();
    if (window.ArcaneRenderAdmin) window.ArcaneRenderAdmin.renderAll();
    if (typeof window.renderLogs === 'function') window.renderLogs();
  }

  // ===== Toggle =====
  function toggle() {
    apply(get() === 'id' ? 'en' : 'id');
  }

  // ===== Init =====
  function init() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    const browserLang = (navigator.language || 'id').toLowerCase();
    const detected = browserLang.startsWith('en') ? 'en' : 'id';
    const lang = saved || detected;

    window.currentLang = lang;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { apply(lang); });
    } else {
      apply(lang);
    }

    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('langToggle')?.addEventListener('click', toggle);
    });

    console.log('[Lang] Init: ' + lang);
  }

  init();

  window.ArcaneLang = { get: get, set: apply, toggle: toggle, t: t };
})();