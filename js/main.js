// ===== MAIN — Entry Point Publik =====

import './logger.js';
import './theme.js';
import './i18n.js';

import { auth, db } from './firebase.js';
import { getUser, getUserData, getRole, isLoggedIn, logout, ready } from './auth.js';
import * as sidebar from './ui/sidebar.js';
import { initModal } from './ui/modal.js';
import { initReveal, observeReveal, observeLazyImages } from './ui/reveal.js';
import * as renderPublic from './ui/render-public.js';
import * as news from './data/news.js';
import * as events from './data/events.js';
import * as gallery from './data/gallery.js';
import * as site from './data/site.js';
import * as categories from './data/categories.js';

// ===== Init =====
async function init() {
  console.log('[Main] Init');

  // 1. Init UI modules
  sidebar.initSidebar();
  initModal();
  initReveal();
  renderPublic.initLightbox();

  // 2. Init render publik (load site data)
  await renderPublic.init();

  // 3. Bind sidebar nav (menu dashboard)
  bindSidebarNav();

  // 4. Bind logout
  bindLogout();

  // 5. Tunggu auth siap
  await ready();

  const user = getUser();
  const userData = getUserData();

  // 6. Kalau belum login — redirect
  if (!user) {
    console.log('[Main] Belum login — redirect');
    window.location.href = 'login.html';
    return;
  }

  // 7. Cek active
  if (userData && userData.active === false) {
    console.log('[Main] Akun nonaktif — logout');
    await logout();
    return;
  }

  console.log('[Main] Login: ' + userData.username + ' (' + userData.role + ')');

  // 8. Setup dashboard
  await setupDashboard(userData);

  // 9. Welcome banner
  showWelcomeBanner(userData.username, userData.role);

  // 10. Load & render data publik
  await loadAndRenderPublic();

  // 11. Listen perubahan bahasa — re-render
  window.addEventListener('lang-changed', async function() {
    console.log('[Main] Bahasa berubah — re-render');
    await renderPublic.renderAll();

    // Re-apply text dari site
    await renderPublic.init();
  });

  // 12. Listen perubahan theme
  window.addEventListener('theme-changed', function() {
    // Log re-render handled di theme.js
  });

  console.log('[Main] Siap');
}

// ===== Setup dashboard =====
async function setupDashboard(userData) {
  // Tampilkan tombol dashboard (buat owner & operator)
  const dashBtn = document.getElementById('toggleSidebar');
  if (dashBtn) {
    if (userData.role === 'owner' || userData.role === 'operator') {
      dashBtn.style.display = 'flex';
    } else {
      dashBtn.style.display = 'none';
    }
  }

  // Init dashboard module
  try {
    const dashboard = await import('./dashboard/dashboard.js');
    await dashboard.init();
  } catch (e) {
    console.error('[Main] Dashboard init gagal:', e);
  }

  // Bind sidebar nav — dashboard loaded
  bindSidebarNav();
}

// ===== Bind sidebar nav =====
function bindSidebarNav() {
  document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(function(item) {
    // Skip kalau udah pernah bind
    if (item.dataset.bound === 'yes') return;
    item.dataset.bound = 'yes';

    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = item.dataset.page;

      // Kalau 'home' — tutup sidebar & tampilkan home
      if (page === 'home') {
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        const home = document.querySelector('[data-page-content="home"]');
        if (home) home.classList.add('active');
        sidebar.close();
        return;
      }

      // Kalau dashboard page — panggil dashboard
      if (window.ArcaneDashboard && typeof window.ArcaneDashboard.goTo === 'function') {
        window.ArcaneDashboard.goTo(page);
      }
    });
  });

  // Bind back to web
  const backBtn = document.getElementById('backToWeb');
  if (backBtn && !backBtn.dataset.bound) {
    backBtn.dataset.bound = 'yes';
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
      const home = document.querySelector('[data-page-content="home"]');
      if (home) home.classList.add('active');
      sidebar.close();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Bind brand
  const brand = document.getElementById('brandHome');
  if (brand && !brand.dataset.bound) {
    brand.dataset.bound = 'yes';
    brand.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
      const home = document.querySelector('[data-page-content="home"]');
      if (home) home.classList.add('active');
      sidebar.close();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===== Bind logout =====
function bindLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn && !logoutBtn.dataset.bound) {
    logoutBtn.dataset.bound = 'yes';
    logoutBtn.addEventListener('click', function() {
      logout();
    });
  }

  const sidebarLogout = document.getElementById('sidebarLogout');
  if (sidebarLogout && !sidebarLogout.dataset.bound) {
    sidebarLogout.dataset.bound = 'yes';
    sidebarLogout.addEventListener('click', function() {
      logout();
    });
  }
}

// ===== Load & render data publik =====
async function loadAndRenderPublic() {
  try {
    const [newsList, eventsList, galleryList] = await Promise.all([
      news.list({ includeArchived: false }).catch(function() { return []; }),
      events.list({ includeArchived: false }).catch(function() { return []; }),
      gallery.list({ includeArchived: false }).catch(function() { return []; })
    ]);

    await renderPublic.renderAll(newsList, eventsList, galleryList);

    console.log('[Main] Data publik rendered — ' +
      newsList.length + ' berita, ' +
      eventsList.length + ' acara, ' +
      galleryList.length + ' gambar');
  } catch (e) {
    console.error('[Main] Load data publik gagal:', e);
    // Tetap render dengan data kosong
    await renderPublic.renderAll([], [], []);
  }
}

// ===== Welcome banner =====
function showWelcomeBanner(username, role) {
  const banner = document.getElementById('welcomeBanner');
  if (!banner) return;

  // Cek udah pernah muncul di sesi ini
  if (sessionStorage.getItem('arcane-welcome-shown') === 'yes') {
    banner.remove();
    return;
  }

  const usernameEl = document.getElementById('welcomeUsername');
  const roleEl = document.getElementById('welcomeRole');
  const roleDisplay = { owner: 'ArcZeyn', operator: 'Operator', member: 'Member' }[role] || role;

  if (usernameEl) usernameEl.textContent = username;

  if (role === 'owner') {
    if (roleEl) roleEl.style.display = 'none';
  } else {
    if (roleEl) {
      roleEl.textContent = '(' + roleDisplay + ')';
      roleEl.style.display = 'inline-block';
    }
  }

  sessionStorage.setItem('arcane-welcome-shown', 'yes');

  setTimeout(function() { banner.classList.add('visible'); }, 100);
  setTimeout(function() {
    banner.classList.remove('visible');
    setTimeout(function() { banner.remove(); }, 600);
  }, 3000);
}

// ===== Jalankan =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===== Expose =====
window.ArcaneMain = {
  init: init,
  loadAndRenderPublic: loadAndRenderPublic
};