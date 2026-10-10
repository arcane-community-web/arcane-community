// ===== RENDER PUBLIC — Web Publik =====
// Render berita, acara, galeri + lazy load + scroll reveal

(function() {
  'use strict';

  function $(sel) { return document.querySelector(sel); }

  // ===== Lazy Load Gambar — Intersection Observer =====
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(function(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
      return;
    }

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });

    images.forEach(function(img) { observer.observe(img); });
  }

  // ===== Scroll Reveal =====
  function initScrollReveal() {
    const elements = document.querySelectorAll('.section, .section-head, .news-card, .event-card, .gallery-item');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function(el) { el.classList.add('reveal-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function(el) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      observer.observe(el);
    });
  }

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

    grid.innerHTML = data.news.map(function(item, index) {
      const title = data.getTitle(item);
      const excerpt = data.getExcerpt(item);
      const dateStr = formatNewsDate(item.date);

      return '<article class="news-card reveal" style="--index: ' + index + ';">' +
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
      const emptyTitle = window.ArcaneLang ? window.ArcaneLang.t('events.empty.title') : 'Belum Ada Acara';
      const emptyDesc = window.ArcaneLang ? window.ArcaneLang.t('events.empty.desc') : 'Acara akan muncul di sini.';
      list.innerHTML = '<div class="events-empty reveal">' +
        '<i data-lucide="calendar-x"></i>' +
        '<h3>' + emptyTitle + '</h3>' +
        '<p>' + emptyDesc + '</p>' +
      '</div>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    list.innerHTML = upcoming.map(function(item, index) {
      const cat = data.categories[item.category] || data.categories.event;
      const prio = Number(item.priority) || 3;
      const prioColor = (data.priorities[prio] || data.priorities[3]).color;
      const startDate = new Date(item.start);
      const endDate = item.end ? new Date(item.end) : null;
      const dateStr = formatEventDate(startDate, endDate);
      const title = data.getTitle(item);
      const desc = data.getDescription(item);
      const prioLabel = window.ArcaneLang ? window.ArcaneLang.t('events.priority') : 'Prioritas';

      const locationHtml = item.location
        ? (item.maps_url
            ? '<a href="' + item.maps_url + '" target="_blank" rel="noopener">' + item.location + '</a>'
            : '<span>' + item.location + '</span>')
        : '<span style="font-style: italic; opacity: .7;">Belum ditentukan</span>';

      return '<div class="event-card reveal" style="--index: ' + index + ';">' +
        '<div class="event-header" style="background: ' + cat.color + ';">' +
          '<h3><i data-lucide="' + cat.icon + '"></i> ' + title + '</h3>' +
        '</div>' +
        '<div class="event-body">' +
          '<div class="event-meta">' +
            '<div class="event-meta-row"><i data-lucide="calendar"></i><span>' + dateStr + '</span></div>' +
            '<div class="event-meta-row"><i data-lucide="tag"></i><span class="event-category-badge" style="background: ' + cat.color + ';">' + cat.label + '</span></div>' +
            '<div class="event-location-row">' +
              '<div class="event-location"><i data-lucide="map-pin"></i>' + locationHtml + '</div>' +
              '<span class="event-priority" style="color: ' + prioColor + ';"><i data-lucide="alert-circle"></i> ' + prioLabel + ': ' + prio + '</span>' +
            '</div>' +
          '</div>' +
          (desc ? '<p class="event-desc">' + desc + '</p>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Render Galeri — Lazy Load + Reveal =====
  function renderGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;

    const data = window.ArcaneData;
    if (!data) return;

    grid.innerHTML = data.gallery.map(function(item, index) {
      const caption = data.getCaption(item);
      return '<div class="gallery-item reveal" style="--index: ' + index + ';" data-src="' + item.src + '">' +
        '<img data-src="' + item.src + '" alt="' + caption + '" class="lazy-img" />' +
        '<div class="gallery-overlay">' + caption + '</div>' +
      '</div>';
    }).join('');

    // Lazy load
    lazyLoadImages();

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
    initScrollReveal();   // ← Scroll reveal
    console.log('[Render Public] Selesai');
  }

  // ===== Expose =====
  window.ArcaneRenderPublic = {
    renderAll: renderAll,
    renderNews: renderNews,
    renderEvents: renderEvents,
    renderGallery: renderGallery,
    lazyLoadImages: lazyLoadImages,
    initScrollReveal: initScrollReveal
  };
})();