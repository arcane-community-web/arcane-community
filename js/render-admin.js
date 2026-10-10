// ===== RENDER ADMIN — Dashboard =====
// Render list admin (berita, acara, galeri) + statistik

(function() {
  'use strict';

  function $(sel) { return document.querySelector(sel); }

  // ===== Statistik =====
  function renderStats() {
    const data = window.ArcaneData;
    if (!data) return;

    const elNews = $('#statNews');
    const elEvents = $('#statEvents');
    const elGallery = $('#statGallery');

    if (elNews) elNews.textContent = data.news.length;
    if (elEvents) elEvents.textContent = data.events.length;
    if (elGallery) elGallery.textContent = data.gallery.length;
  }

  // ===== Admin News =====
  function renderAdminNews() {
    const list = $('#adminNewsList');
    if (!list) return;

    const data = window.ArcaneData;
    if (!data) return;

    if (!data.news.length) {
      list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + (window.ArcaneLang ? window.ArcaneLang.t('admin.news.empty') : 'Belum ada berita.') + '</p>';
      return;
    }

    list.innerHTML = data.news.map(function(item) {
      return '<div class="admin-item">' +
        '<div class="admin-item-info">' +
          '<h4>' + item.title_id + '</h4>' +
          '<p>' + item.date + '</p>' +
        '</div>' +
        '<div class="admin-item-actions">' +
          '<button class="edit-news" data-id="' + item.id + '"><i data-lucide="pencil"></i></button>' +
          '<button class="delete-news danger" data-id="' + item.id + '"><i data-lucide="trash-2"></i></button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Bind edit/delete
    list.querySelectorAll('.edit-news').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof window.editNews === 'function') window.editNews(Number(btn.dataset.id));
      });
    });
    list.querySelectorAll('.delete-news').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof window.deleteNews === 'function') window.deleteNews(Number(btn.dataset.id));
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Admin Events =====
  function renderAdminEvents() {
    const list = $('#adminEventsList');
    if (!list) return;

    const data = window.ArcaneData;
    if (!data) return;

    if (!data.events.length) {
      list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + (window.ArcaneLang ? window.ArcaneLang.t('admin.events.empty') : 'Belum ada acara.') + '</p>';
      return;
    }

    list.innerHTML = data.events.map(function(item) {
      const cat = data.categories[item.category] || data.categories.event;
      const prio = Number(item.priority) || 3;
      return '<div class="admin-item">' +
        '<div class="admin-item-info">' +
          '<h4>' + item.title_id + '</h4>' +
          '<p>' + cat.label + ' • Prioritas ' + prio + '</p>' +
        '</div>' +
        '<div class="admin-item-actions">' +
          '<button class="edit-event" data-id="' + item.id + '"><i data-lucide="pencil"></i></button>' +
          '<button class="delete-event danger" data-id="' + item.id + '"><i data-lucide="trash-2"></i></button>' +
        '</div>' +
      '</div>';
    }).join('');

    list.querySelectorAll('.edit-event').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof window.editEvent === 'function') window.editEvent(Number(btn.dataset.id));
      });
    });
    list.querySelectorAll('.delete-event').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof window.deleteEvent === 'function') window.deleteEvent(Number(btn.dataset.id));
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Admin Gallery =====
  function renderAdminGallery() {
    const list = $('#adminGalleryList');
    if (!list) return;

    const data = window.ArcaneData;
    if (!data) return;

    if (!data.gallery.length) {
      list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;grid-column:1/-1;">' + (window.ArcaneLang ? window.ArcaneLang.t('admin.gallery.empty') : 'Belum ada gambar.') + '</p>';
      return;
    }

    list.innerHTML = data.gallery.map(function(item) {
      return '<div class="admin-gallery-item">' +
        '<img src="' + item.src + '" alt="' + item.caption_id + '" loading="lazy" />' +
        '<button class="delete-gallery" data-id="' + item.id + '"><i data-lucide="trash-2"></i></button>' +
      '</div>';
    }).join('');

    list.querySelectorAll('.delete-gallery').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (typeof window.deleteGallery === 'function') window.deleteGallery(Number(btn.dataset.id));
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Render Semua =====
  function renderAll() {
    console.log('[Render Admin] Mulai');
    renderStats();
    renderAdminNews();
    renderAdminEvents();
    renderAdminGallery();
    console.log('[Render Admin] Selesai');
  }

  // ===== Expose =====
  window.ArcaneRenderAdmin = {
    renderAll: renderAll,
    renderStats: renderStats,
    renderNews: renderAdminNews,
    renderEvents: renderAdminEvents,
    renderGallery: renderAdminGallery
  };
})();