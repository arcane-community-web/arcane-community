// ===== THEME — Dark/Light Mode ARCANE =====
// Toggle tema + auto-detect OS preference
// Tersimpan di localStorage

(function() {
  'use strict';

  const STORAGE_KEY = 'arcane-theme';

  // ===== Get tema sekarang =====
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  // ===== Set tema =====
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    updateIcon(theme);
    console.log('[Theme] Ganti ke: ' + theme);
  }

  // ===== Update ikon =====
  function updateIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Toggle =====
  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);

    // Re-render log biar warnanya sesuai tema
    setTimeout(function() {
      if (typeof window.renderLogs === 'function') window.renderLogs();
    }, 50);
  }

  // ===== Init =====
  function init() {
    // Cek saved / OS preference
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    // Set awal
    document.documentElement.setAttribute('data-theme', theme);

    // Bind toggle
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Update ikon setelah DOM siap
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { updateIcon(theme); });
    } else {
      updateIcon(theme);
    }

    console.log('[Theme] Init: ' + theme);
  }

  // ===== Auto-init =====
  init();

  // ===== Expose =====
  window.ArcaneTheme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme
  };
})();