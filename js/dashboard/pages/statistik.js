// ===== PAGE: STATISTIK =====

import * as news from '../../data/news.js';
import * as events from '../../data/events.js';
import * as gallery from '../../data/gallery.js';
import * as users from '../../data/users.js';
import { getUserData, getRole } from '../../auth.js';

export async function init() {
  const el = document.querySelector('[data-page-content="statistik"]');
  if (!el) return;

  console.log('[Statistik] Init');

  // Ambil data paralel
  const [newsList, eventsList, galleryList] = await Promise.all([
    safeList(news.list),
    safeList(events.list),
    safeList(gallery.list)
  ]);

  // Statistik user (owner only)
  let userStats = null;
  if (getRole() === 'owner') {
    userStats = await users.getStats();
  }

  render(el, {
    news: newsList.length,
    events: eventsList.length,
    gallery: galleryList.length,
    upcoming: events.filterUpcoming(eventsList).length,
    userStats: userStats
  });
}

function render(el, stats) {
  const isId = (window.currentLang || 'id') === 'id';

  const labels = {
    news: isId ? 'Berita' : 'News',
    events: isId ? 'Acara' : 'Events',
    gallery: isId ? 'Gambar' : 'Images',
    upcoming: isId ? 'Acara Mendatang' : 'Upcoming',
    users: isId ? 'Pengguna' : 'Users',
    owner: 'Owner',
    operator: 'Operator',
    member: 'Member',
    active: isId ? 'Aktif' : 'Active',
    inactive: isId ? 'Nonaktif' : 'Inactive',
    title: isId ? 'Statistik' : 'Statistics',
    desc: isId ? 'Ringkasan konten ARCANE Community' : 'ARCANE Community content summary'
  };

  let userCardHtml = '';

  if (stats.userStats) {
    userCardHtml = 
      '<div class="stat-card reveal">' +
        '<i data-lucide="users"></i>' +
        '<div>' +
          '<span class="stat-num">' + stats.userStats.total + '</span>' +
          '<span class="stat-label">' + labels.users + '</span>' +
          '<div style="font-size:11.5px;color:var(--text-mute);margin-top:6px;line-height:1.5;">' +
            'Owner: ' + stats.userStats.owner + ' · ' +
            'Operator: ' + stats.userStats.operator + ' · ' +
            'Member: ' + stats.userStats.member +
            '<br>' +
            labels.active + ': ' + stats.userStats.active + ' · ' +
            labels.inactive + ': ' + stats.userStats.inactive +
          '</div>' +
        '</div>' +
      '</div>';
  }

  el.innerHTML =
    '<h1 data-i18n="stat.title">' + labels.title + '</h1>' +
    '<p class="page-sub" data-i18n="stat.desc">' + labels.desc + '</p>' +
    '<div class="stats-grid">' +
      '<div class="stat-card reveal">' +
        '<i data-lucide="newspaper"></i>' +
        '<div>' +
          '<span class="stat-num">' + stats.news + '</span>' +
          '<span class="stat-label" data-i18n="stat.news">' + labels.news + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="stat-card reveal">' +
        '<i data-lucide="calendar-days"></i>' +
        '<div>' +
          '<span class="stat-num">' + stats.events + '</span>' +
          '<span class="stat-label" data-i18n="stat.events">' + labels.events + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="stat-card reveal">' +
        '<i data-lucide="image"></i>' +
        '<div>' +
          '<span class="stat-num">' + stats.gallery + '</span>' +
          '<span class="stat-label" data-i18n="stat.gallery">' + labels.gallery + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="stat-card reveal">' +
        '<i data-lucide="clock"></i>' +
        '<div>' +
          '<span class="stat-num">' + stats.upcoming + '</span>' +
          '<span class="stat-label">' + labels.upcoming + '</span>' +
        '</div>' +
      '</div>' +
      userCardHtml +
    '</div>';

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Trigger reveal
  if (window.ArcaneReveal) window.ArcaneReveal.observe(el.querySelectorAll('.reveal'));
}

// ===== Helper: Safe list =====
async function safeList(fn) {
  try {
    return await fn() || [];
  } catch (e) {
    console.warn('[Statistik] List gagal:', e.message);
    return [];
  }
}