// ===== RENDER PUBLIC — Halaman Publik =====

import { escapeHtml } from '../utils/escape.js';
import { safeUrl } from '../utils/url.js';
import { formatDate, formatEventDate } from '../utils/dates.js';
import { observeReveal, observeLazyImages } from './reveal.js';
import * as site from '../data/site.js';
import * as categories from '../data/categories.js';

// ===== State =====
let siteData = null;
let categoriesData = [];

// ===== Get lang helper =====
function lang() {
  return window.currentLang || 'id';
}

function tr(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] || obj.id || obj.en || '';
}

// ===== Init =====
export async function init() {
  siteData = await site.getAll();
  categoriesData = await categories.list();

  // Apply teks situs
  applyHero(siteData.hero);
  applySections(siteData.sections);
  applyFooter(siteData.footer);
  applySettings(siteData.settings);

  console.log('[RenderPublic] Init OK');
}

// ===== Render semua =====
export async function renderAll(news, events, gallery) {
  if (!siteData) await init();

  renderNews(news || []);
  renderEvents(events || []);
  renderGallery(gallery || []);

  applyHero(siteData.hero);
  applySections(siteData.sections);
  applyFooter(siteData.footer);
  applySettings(siteData.settings);

  observeReveal();
  observeLazyImages();

  console.log('[RenderPublic] Render OK');
}

// ===== Apply Hero =====
function applyHero(hero) {
  if (!hero) return;

  const badge = document.querySelector('[data-i18n="hero.badge"]');
  const title = document.querySelector('[data-i18n="hero.title"]');
  const subtitle = document.querySelector('[data-i18n="hero.subtitle"]');
  const cta1 = document.querySelector('[data-i18n="hero.cta1"]');

  if (badge) badge.textContent = tr(hero.badge);
  if (title) title.textContent = tr(hero.title);
  if (subtitle) subtitle.textContent = tr(hero.subtitle);
  if (cta1) cta1.textContent = tr(hero.cta);
}

// ===== Apply Sections =====
function applySections(sections) {
  if (!sections) return;

  ['news', 'events', 'gallery'].forEach(function(key) {
    const sec = sections[key];
    if (!sec) return;

    // Title
    const titleEl = document.querySelector('[data-i18n="' + key + '.title"]');
    if (titleEl) titleEl.textContent = tr(sec.title);

    // Desc
    const descEl = document.querySelector('[data-i18n="' + key + '.desc"]');
    if (descEl) descEl.textContent = tr(sec.desc);

    // Visibility
    const sectionEl = document.querySelector('[data-section="' + key + '"]');
    if (sectionEl) {
      if (sec.visible === false) {
        sectionEl.style.display = 'none';
      } else {
        sectionEl.style.display = '';
      }
    }
  });
}

// ===== Apply Footer =====
function applyFooter(footer) {
  if (!footer) return;

  const tagline = document.querySelector('[data-i18n="footer.tagline"]');
  const rights = document.querySelector('[data-i18n="footer.rights"]');

  if (tagline) tagline.textContent = tr(footer.tagline);
  if (rights) rights.textContent = tr(footer.rights);
}

// ===== Apply Settings =====
function applySettings(settings) {
  if (!settings) return;

  // Update title
  if (settings.siteName) {
    document.title = settings.siteName + ' — ' + (settings.tagline || '');
  }
}

// ===== Render Berita =====
function renderNews(items) {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  if (!items || !items.length) {
    const empty = window.ArcaneI18n ? window.ArcaneI18n.t('news.empty') : 'Belum ada berita.';
    grid.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;grid-column:1/-1;">' + escapeHtml(empty) + '</p>';
    return;
  }

  // Sort by date desc
  const sorted = items.slice().sort(function(a, b) {
    const dA = a.date || 0;
    const dB = b.date || 0;
    return dB - dA;
  });

  grid.innerHTML = sorted.map(function(item, index) {
    const title = tr(item.title);
    const excerpt = tr(item.excerpt);
    const dateStr = formatDate(item.date, lang());
    const thumb = item.thumbnail ? safeUrl(item.thumbnail) : '';

    return '<article class="news-card reveal" style="--index:' + index + ';">' +
      (thumb ? '<div class="news-thumb"><img data-src="' + escapeHtml(thumb) + '" alt="' + escapeHtml(title) + '" class="lazy-img" /></div>' : '') +
      '<div class="news-body">' +
        '<span class="news-date">' + escapeHtml(dateStr) + '</span>' +
        '<h3>' + escapeHtml(title) + '</h3>' +
        '<p>' + escapeHtml(excerpt) + '</p>' +
        (item.url ? '<a href="' + escapeHtml(safeUrl(item.url)) + '" target="_blank" rel="noopener" class="news-link">→</a>' : '') +
      '</div>' +
    '</article>';
  }).join('');
}

// ===== Render Acara =====
function renderEvents(items) {
  const list = document.getElementById('eventsList');
  if (!list) return;

  const now = Date.now();
  const upcoming = (items || []).filter(function(item) {
    const endDate = item.end || item.start;
    return endDate >= now;
  }).sort(function(a, b) {
    const pA = Number(a.priority) || 3;
    const pB = Number(b.priority) || 3;
    if (pA !== pB) return pB - pA;
    return (a.start || 0) - (b.start || 0);
  });

  if (!upcoming.length) {
    const titleEmpty = window.ArcaneI18n ? window.ArcaneI18n.t('events.empty') : 'Belum Ada Acara';
    const descEmpty = window.ArcaneI18n ? window.ArcaneI18n.t('events.empty.desc') : 'Acara akan muncul di sini.';
    list.innerHTML = '<div class="events-empty reveal">' +
      '<i data-lucide="calendar-x"></i>' +
      '<h3>' + escapeHtml(titleEmpty) + '</h3>' +
      '<p>' + escapeHtml(descEmpty) + '</p>' +
    '</div>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  list.innerHTML = upcoming.map(function(item, index) {
    const cat = findCategory(item.categoryId);
    const catColor = cat ? cat.color : '#EF4444';
    const catLabel = cat ? tr(cat.name) : 'Event';
    const catIcon = cat ? cat.icon : 'calendar';
    const prio = Number(item.priority) || 3;
    const prioColor = getPriorityColor(prio);
    const title = tr(item.title);
    const desc = tr(item.description);
    const dateStr = formatEventDate(item.start, item.end, lang());
    const prioLabel = window.ArcaneI18n ? window.ArcaneI18n.t('events.priority') : 'Prioritas';
    const tbaLabel = window.ArcaneI18n ? window.ArcaneI18n.t('events.location.tba') : 'Belum ditentukan';

    const locationHtml = item.location
      ? (item.mapsUrl && safeUrl(item.mapsUrl) !== '#'
          ? '<a href="' + escapeHtml(safeUrl(item.mapsUrl)) + '" target="_blank" rel="noopener">' + escapeHtml(item.location) + '</a>'
          : '<span>' + escapeHtml(item.location) + '</span>')
      : '<span style="font-style:italic;opacity:.7;">' + escapeHtml(tbaLabel) + '</span>';

    return '<div class="event-card reveal" style="--index:' + index + ';">' +
      '<div class="event-header" style="background:' + escapeHtml(catColor) + ';">' +
        '<h3><i data-lucide="' + escapeHtml(catIcon) + '"></i> ' + escapeHtml(title) + '</h3>' +
      '</div>' +
      '<div class="event-body">' +
        '<div class="event-meta">' +
          '<div class="event-meta-row"><i data-lucide="calendar"></i><span>' + dateStr + '</span></div>' +
          '<div class="event-meta-row"><i data-lucide="tag"></i><span class="event-category-badge" style="background:' + escapeHtml(catColor) + ';">' + escapeHtml(catLabel) + '</span></div>' +
          '<div class="event-location-row">' +
            '<div class="event-location"><i data-lucide="map-pin"></i>' + locationHtml + '</div>' +
            '<span class="event-priority" style="color:' + escapeHtml(prioColor) + ';"><i data-lucide="alert-circle"></i> ' + escapeHtml(prioLabel) + ': ' + prio + '</span>' +
          '</div>' +
        '</div>' +
        (desc ? '<p class="event-desc">' + escapeHtml(desc) + '</p>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ===== Render Galeri =====
function renderGallery(items) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  if (!items || !items.length) {
    const empty = window.ArcaneI18n ? window.ArcaneI18n.t('gallery.empty') : 'Belum ada gambar.';
    grid.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;grid-column:1/-1;">' + escapeHtml(empty) + '</p>';
    return;
  }

  grid.innerHTML = items.map(function(item, index) {
    const caption = tr(item.caption);
    const thumb = safeUrl(item.thumbUrl);
    const full = safeUrl(item.fullUrl || item.thumbUrl);

    return '<div class="gallery-item reveal" style="--index:' + index + ';" data-src="' + escapeHtml(full) + '">' +
      '<img data-src="' + escapeHtml(thumb) + '" alt="' + escapeHtml(caption) + '" class="lazy-img" />' +
      '<div class="gallery-overlay">' + escapeHtml(caption) + '</div>' +
    '</div>';
  }).join('');

  // Bind lightbox
  grid.querySelectorAll('.gallery-item').forEach(function(el) {
    el.addEventListener('click', function() {
      openLightbox(el.dataset.src);
    });
  });
}

// ===== Lightbox =====
export function openLightbox(src) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!box || !img || !src) return;

  img.src = src;
  box.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  box.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Init lightbox events =====
export function initLightbox() {
  const closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  const box = document.getElementById('lightbox');
  if (box) {
    box.addEventListener('click', function(e) {
      if (e.target === box) closeLightbox();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ===== Helpers =====
function findCategory(id) {
  if (!id) return null;
  return categoriesData.find(function(c) { return c.id === id; }) || null;
}

function getPriorityColor(prio) {
  const map = {
    5: '#EF4444',
    4: '#F97316',
    3: '#1E9BE0',
    2: '#10B981',
    1: '#9CA3AF'
  };
  return map[prio] || map[3];
}

// ===== Expose =====
window.ArcaneRenderPublic = {
  init: init,
  renderAll: renderAll,
  openLightbox: openLightbox,
  closeLightbox: closeLightbox,
  initLightbox: initLightbox
};