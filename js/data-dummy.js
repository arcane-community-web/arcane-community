// ===== DATA DUMMY — ARCANE =====
// Sumber data sementara (Tahap 1)
// Nanti diganti dengan Firestore (Tahap 5)

(function() {
  'use strict';

  // ===== Konfigurasi =====
  const CATEGORIES = {
    sosial:  { label: 'Sosial',  color: '#8B5CF6', icon: 'users' },
    liburan: { label: 'Liburan', color: '#10B981', icon: 'sun' },
    project: { label: 'Project', color: '#F59E0B', icon: 'briefcase' },
    event:   { label: 'Event',   color: '#EF4444', icon: 'trophy' }
  };

  const PRIORITIES = {
    5: { color: '#EF4444' },
    4: { color: '#F97316' },
    3: { color: '#1E9BE0' },
    2: { color: '#10B981' },
    1: { color: '#9CA3AF' }
  };

  // ===== Data =====
  const NEWS = [
    { id: 1, title_id: 'Pembukaan Pendaftaran Anggota Baru', title_en: 'New Member Registration Open', date: '2026-10-01',
      excerpt_id: 'ARCANE Community membuka pendaftaran anggota baru untuk periode 2026/2027.',
      excerpt_en: 'ARCANE Community opens new member registration for 2026/2027.' },
    { id: 2, title_id: 'Workshop Editing Video Dasar', title_en: 'Basic Video Editing Workshop', date: '2026-09-20',
      excerpt_id: 'Belajar dasar editing video untuk konten sekolah bersama tim ARCANE.',
      excerpt_en: 'Learn the basics of video editing for school content with the ARCANE team.' },
    { id: 3, title_id: 'Kolaborasi Desain Logo Sekolah', title_en: 'School Logo Design Collaboration', date: '2026-09-05',
      excerpt_id: 'Tim desain ARCANE berkolaborasi membuat logo untuk kegiatan sekolah.',
      excerpt_en: 'The ARCANE design team collaborates on a logo for a school event.' },
    { id: 4, title_id: 'Pelatihan Public Speaking', title_en: 'Public Speaking Training', date: '2026-08-15',
      excerpt_id: 'Pelatihan public speaking untuk anggota baru ARCANE Community.',
      excerpt_en: 'Public speaking training for new ARCANE Community members.' },
    { id: 5, title_id: 'Rekrutmen Tim Kreatif', title_en: 'Creative Team Recruitment', date: '2026-08-01',
      excerpt_id: 'ARCANE membuka rekrutmen untuk tim kreatif konten digital.',
      excerpt_en: 'ARCANE opens recruitment for the digital content creative team.' }
  ];

  const EVENTS = [
    { id: 1, title_id: 'Rapat Anggota Bulanan', title_en: 'Monthly Member Meeting',
      start: '2026-10-15T19:00', end: '2026-10-15T21:00',
      category: 'sosial', priority: 5, location: 'Aula Sekolah', maps_url: 'https://maps.google.com',
      description_id: 'Rapat rutin bulanan untuk membahas program kerja dan evaluasi kegiatan.',
      description_en: 'Monthly routine meeting to discuss work programs and evaluate activities.' },
    { id: 2, title_id: 'Update KPA & KTA 2026', title_en: 'KPA & KTA Update 2026',
      start: '2026-10-20T10:00', end: '2026-10-20T12:00',
      category: 'project', priority: 4, location: 'Online (Zoom)', maps_url: '',
      description_id: 'Update Ketentuan Pokok Arcane (KPA) dan Ketentuan Turunan Arcane (KTA).',
      description_en: 'Update of Arcane Main Rules (KPA) and Arcane Derivative Rules (KTA).' },
    { id: 3, title_id: 'Lomba Konten Sekolah', title_en: 'School Content Competition',
      start: '2026-11-10T08:00', end: '2026-11-12T17:00',
      category: 'event', priority: 3, location: 'Gedung Serbaguna', maps_url: 'https://maps.google.com',
      description_id: 'Lomba konten kreatif antar kelas. Peserta bebas membuat video, poster, dll.',
      description_en: 'Creative content competition between classes.' },
    { id: 4, title_id: 'Trip Bareng Anggota', title_en: 'Member Trip Together',
      start: '2026-12-25T08:00', end: '2026-12-27T18:00',
      category: 'liburan', priority: 2, location: 'Pantai Anyer', maps_url: 'https://maps.google.com',
      description_id: 'Trip bareng anggota ARCANE. Santai, main, dan bonding antar anggota.',
      description_en: 'Trip with ARCANE members. Relax, play, and bond between members.' },
    { id: 5, title_id: 'Kumpul Santai', title_en: 'Casual Hangout',
      start: '2026-10-30T16:00', end: '2026-10-30T18:00',
      category: 'sosial', priority: 1, location: 'Kafe Kota', maps_url: '',
      description_id: 'Kumpul santai tanpa agenda khusus. Sekadar ngobrol dan sharing.',
      description_en: 'Casual hangout without specific agenda. Just chat and share.' }
  ];

  const GALLERY = [
    { id: 1, src: 'https://picsum.photos/seed/arcane1/400/400', caption_id: 'Workshop Desain', caption_en: 'Design Workshop' },
    { id: 2, src: 'https://picsum.photos/seed/arcane2/400/400', caption_id: 'Rapat Anggota', caption_en: 'Member Meeting' },
    { id: 3, src: 'https://picsum.photos/seed/arcane3/400/400', caption_id: 'Proyek Video', caption_en: 'Video Project' },
    { id: 4, src: 'https://picsum.photos/seed/arcane4/400/400', caption_id: 'Kegiatan Sekolah', caption_en: 'School Activity' },
    { id: 5, src: 'https://picsum.photos/seed/arcane5/400/400', caption_id: 'Kolaborasi Tim', caption_en: 'Team Collaboration' }
  ];

  // ===== Helper =====
  function getLang() {
    return window.currentLang || 'id';
  }

  function getField(item, field) {
    const lang = getLang();
    return item[field + '_' + lang] || item[field + '_id'] || '';
  }

  // ===== Expose =====
  window.ArcaneData = {
    categories: CATEGORIES,
    priorities: PRIORITIES,
    news: NEWS,
    events: EVENTS,
    gallery: GALLERY,
    getTitle:       function(item) { return getField(item, 'title'); },
    getExcerpt:     function(item) { return getField(item, 'excerpt'); },
    getDescription: function(item) { return getField(item, 'description'); },
    getCaption:     function(item) { return getField(item, 'caption'); }
  };

  console.log('[Data] Dummy loaded — ' + NEWS.length + ' berita, ' + EVENTS.length + ' acara, ' + GALLERY.length + ' gambar');
})();