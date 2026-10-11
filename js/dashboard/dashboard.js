// ===== DASHBOARD — Cangkang & Navigasi =====

import { getMenuForRole } from './permissions.js';
import { getUser, getUserData, getRole } from '../auth.js';
import * as sidebar from '../ui/sidebar.js';
import { escapeHtml } from '../utils/escape.js';

// ===== State =====
let currentPage = 'statistik';
let pageModules = {};

// ===== Init =====
export async function init() {
  const role = getRole();
  const userData = getUserData();

  if (!role || !userData) {
    console.warn('[Dashboard] User tidak login');
    return;
  }

  console.log('[Dashboard] Init — role: ' + role);

  // Tampilkan info user di header
  updateUserInfo(userData);

  // Render menu sesuai role
  renderMenu(role);

  // Bind navigasi
  bindNavigation();

  // Bind brand & back to web
  bindBrand();

  // Load halaman pertama
  await loadPage(currentPage);

  // Tandai dashboard visible
  const dashEl = document.getElementById('dashboard');
  if (dashEl) dashEl.classList.add('visible');
}

// ===== Update user info =====
function updateUserInfo(userData) {
  const el = document.getElementById('adminUser');
  if (el) {
    const roleDisplay = {
      owner: 'ArcZeyn',
      operator: 'Operator',
      member: 'Member'
    }[userData.role] || userData.role;

    el.textContent = userData.username + ' (' + roleDisplay + ')';
  }
}

// ===== Render menu =====
function renderMenu(role) {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  const menuItems = getMenuForRole(role);

  nav.innerHTML = menuItems.map(function(item) {
    const label = window.ArcaneI18n ? window.ArcaneI18n.t(item.i18n) : item.page;
    const active = item.page === currentPage ? ' active' : '';

    return '<button class="sidebar-nav-item' + active + '" data-page="' + escapeHtml(item.page) + '">' +
      '<i data-lucide="' + escapeHtml(item.icon) + '"></i> ' +
      '<span data-i18n="' + escapeHtml(item.i18n) + '">' + escapeHtml(label) + '</span>' +
      (item.page === 'console' ? '<span class="log-badge" id="logBadge"></span>' : '') +
    '</button>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  console.log('[Dashboard] Menu rendered — ' + menuItems.length + ' item');
}

// ===== Navigasi =====
function bindNavigation() {
  document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) goTo(page);
    });
  });
}

// ===== Brand & back to web =====
function bindBrand() {
  const brand = document.getElementById('brandHome');
  if (brand) {
    brand.addEventListener('click', function(e) {
      e.preventDefault();
      goTo('home');
    });
  }

  const backBtn = document.getElementById('backToWeb');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      goTo('home');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (window.ArcaneAuth) window.ArcaneAuth.logout();
    });
  }
}

// ===== Navigasi halaman =====
export async function goTo(page) {
  console.log('[Dashboard] Navigasi: ' + page);

  // Kalau 'home' — tutup sidebar & tampilkan web publik
  if (page === 'home') {
    closeAllPages();
    const homePage = document.querySelector('[data-page-content="home"]');
    if (homePage) homePage.classList.add('active');
    sidebar.close();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Update active menu
  document.querySelectorAll('.sidebar-nav-item').forEach(function(i) {
    i.classList.remove('active');
    if (i.dataset.page === page) i.classList.add('active');
  });

  // Tutup semua halaman
  closeAllPages();

  // Tampilkan halaman
  const pageEl = document.querySelector('[data-page-content="' + page + '"]');
  if (pageEl) pageEl.classList.add('active');

  // Load module halaman
  await loadPage(page);

  // Scroll ke atas
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Kalau mobile — tutup sidebar
  if (window.innerWidth <= 768) {
    setTimeout(function() { sidebar.close(); }, 200);
  }

  // Update current page
  currentPage = page;
}

function closeAllPages() {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
}

// ===== Load page module =====
async function loadPage(page) {
  try {
    // Cek module udah ke-load
    if (!pageModules[page]) {
      const module = await import('./pages/' + page + '.js');
      pageModules[page] = module;
    }

    // Kalau ada fungsi init — panggil
    const mod = pageModules[page];
    if (mod && typeof mod.init === 'function') {
      await mod.init();
    }
  } catch (e) {
    console.error('[Dashboard] Load page "' + page + '" gagal:', e);
    const pageEl = document.querySelector('[data-page-content="' + page + '"]');
    if (pageEl) {
      pageEl.innerHTML =
        '<div style="padding:40px;text-align:center;color:var(--text-mute);">' +
          '<p>Gagal memuat halaman.</p>' +
          '<p style="font-size:12px;margin-top:8px;">' + escapeHtml(e.message) + '</p>' +
        '</div>';
    }
  }
}

// ===== Reload current page =====
export async function reload() {
  await loadPage(currentPage);
}

// ===== Get current page =====
export function getCurrentPage() {
  return currentPage;
}

// ===== Expose =====
window.ArcaneDashboard = {
  init: init,
  goTo: goTo,
  reload: reload,
  getCurrentPage: getCurrentPage
};