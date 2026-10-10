// ===== THEME — Dark/Light Mode ARCANE =====
// Toggle tema + auto-detect OS preference

(function() {
  'use strict';

  const STORAGE_KEY = 'arcane-theme';
  const root = document.documentElement;
  let currentTheme = 'light';

  // ===== Get =====
  function get() {
    return root.getAttribute('data-theme') || 'light';
  }

  // ===== Set =====
  function set(theme) {
    root.setAttribute('data-theme', theme);
    currentTheme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateIcon(theme);
    console.log('[Theme] Ganti ke: ' + theme);
  }

  // ===== Update icon =====
  function updateIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // ===== Toggle =====
  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
    setTimeout(function() {
      if (typeof window.renderLogs === 'function') window.renderLogs();
    }, 50);
  }

  // ===== Init =====
  function init() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    root.setAttribute('data-theme', theme);
    currentTheme = theme;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        updateIcon(theme);
        document.getElementById('themeToggle')?.addEventListener('click', toggle);
      });
    } else {
      updateIcon(theme);
      document.getElementById('themeToggle')?.addEventListener('click', toggle);
    }

    console.log('[Theme] Init: ' + theme);
  }

  init();

  window.ArcaneTheme = { get: get, set: set, toggle: toggle };
})();