// ===== RENDER PUBLIC — Web Publik =====
// Render berita, acara, galeri di halaman web publik

(function() {
  'use strict';

  function $(sel) { return document.querySelector(sel); }

  // ===== Format Tanggal Acara =====
  function formatEventDate(start, end) {
    const lang = window.currentLang || 'id';
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false };

    const startDateStr = start.toLocaleDateString(locale, opts);
    const startTimeStr = start.toLocaleTimeString(locale, timeOpts);

    if (!end) {
      return '<strong>' + startDateStr + '</strong>, ' + startTimeStr;
    }

    const endDateStr = end.toLocaleDateString(locale, opts);
    const endTimeStr = end.toLocaleTimeString(locale, timeOpts);

    if (startDateStr === endDateStr) {
      return '<strong>' + startDateStr + '</strong>, ' + startTimeStr + ' - ' + endTimeStr;
    }
    return '<strong>' + startDateStr + ' - ' + endDateStr + '</strong>';
  }

  // ===== Format Tanggal Berita =====
  function formatNewsDate(dateStr) {
    const lang = window.currentLang || 'id';
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return new Date(dateStr).toLocaleDateString(locale, {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // ===== Render Berita =====
  function renderNews() {
    const grid = $('#newsGrid');
    if (!grid) return;

    const data = window.ArcaneData;
    if (!data) return;

    grid.innerHTML = data.news.map(function(item) {
      const title = data.getTitle(item);
      const excerpt = data.getExcerpt(item);
      const dateStr = formatNewsDate(item.date);

      return '<article class="news-card">' +
        '<div class="news-body">' +
          '<span class="news-date">' + dateStr + '</span>' +
          '<h3>' + title + '</h3>' +
          '<p>' + excerpt + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  // ===== Render Acara =====
  function renderEvents() {
    const list = $('#eventsList');
    if (!list) return;

    const data = window.ArcaneData;
    if (!data) return;

    const now = new Date();
    const upcoming = data.events.filter(function(item) {
      const endDate = item.end ? new Date(item.end) : new Date(item.start);
      return endDate >= now;
    }).sort(function(a, b) {
      const pA = Number(a.priority) || 3;
      const pB = Number(b.priority) || 3;
      if (pA !== pB) return pB - pA;
      return new Date(a.start) - new Date(b.start);
    });

    if (!upcoming.length) {
      list.innerHTML = '<div class="events-empty">' +
        '<i data-lucide="calendar-x"></i>' +
        '<h3>Belum Ada Acara</h3>' +
        '<p>Acara akan muncul di sini kalau sudah ditambahkan.</p>' +
      '</div>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    list.innerHTML = upcoming.map(function(item) {
      const cat = data.categories[item.category] || data.categories.event;
      const prio = Number(item.priority) || 3;
      const prioColor = (data.priorities[prio] || data.priorities[3]).color;
      const startDate = new Date(item.start);
      const endDate = item.end ? new Date(item.end) : null;
      const dateStr = formatEventDate(startDate, endDate);
      const title = data.getTitle(item);
      const desc = data.getDescription(item);

      const locationHtml = item.location
        ? (item.maps_url
            ? '<a href="' + item.maps_url + '" target="_blank" rel="noopener">' + item.location + '</a>'
            : '<span>' + item.location + '</span>')
        : '<span style="font-style: italic; opacity: .7;">Belum ditentukan</span>';

      return '<div class="event-card">' +
        '<div class="event-header" style="background: ' + cat.color + ';">' +
          '<h3><i data-lucide="' + cat.icon + '"></i> ' + title + '</h3>' +
        '</div>' +
        '<div class="event-body">' +
          '<div class="event-meta">' +
            '<div class="event-meta-row"><i data-lucide="calendar"></i><span>' + dateStr + '</span></div>' +
            '<div class="event-meta-row"><i data-lucide="tag"></i><span class="event-category-badge" style="background: ' + cat.color + ';">' + cat.label + '</span></div>' +
            '<div class="event-location-row">' +
              '<div class="event-location"><i data-lucide="map-pin"></i>' + locationHtml + '</div>' +
              '<span class="event-priority" style="color: ' + prioColor + ';"><i data-lucide="alert-circle"></i> Prioritas: ' + prio + '</span>' +
            '</div>' +
          '</div>' +
          (desc ? '<p class="event-desc">' + desc + '</p>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Render Galeri =====
  function renderGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;

    const data = window.ArcaneData;
    if (!data) return;

    grid.innerHTML = data.gallery.map(function(item) {
      const caption = data.getCaption(item);
      return '<div class="gallery-item" data-src="' + item.src + '">' +
        '<img src="' + item.src + '" alt="' + caption + '" loading="lazy" />' +
        '<div class="gallery-overlay">' + caption + '</div>' +
      '</div>';
    }).join('');

    // Bind lightbox
    grid.querySelectorAll('.gallery-item').forEach(function(el) {
      el.addEventListener('click', function() {
        const box = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        if (box && img) {
          img.src = el.dataset.src;
          box.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // ===== Render Semua =====
  function renderAll() {
    console.log('[Render Public] Mulai');
    renderNews();
    renderEvents();
    renderGallery();
    console.log('[Render Public] Selesai');
  }

  // ===== Expose =====
  window.ArcaneRenderPublic = {
    renderAll: renderAll,
    renderNews: renderNews,
    renderEvents: renderEvents,
    renderGallery: renderGallery
  };
})();