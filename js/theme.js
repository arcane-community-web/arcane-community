// ===== THEME — Dark/Light Mode =====

const STORAGE_KEY = 'arcane-theme';
const root = document.documentElement;
let currentTheme = 'light';

// ===== Get =====
export function getTheme() {
  return currentTheme;
}

// ===== Set =====
export function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') theme = 'light';

  root.setAttribute('data-theme', theme);
  currentTheme = theme;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {}

  updateIcon(theme);

  console.log('[Theme] Ganti ke: ' + theme);

  // Dispatch event
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: theme }
  }));
}

// ===== Update icon =====
function updateIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;

  icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');

  if (typeof lucide !== 'undefined') {
    try {
      lucide.createIcons();
    } catch (e) {}
  }
}

// ===== Toggle =====
export function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');

  // Re-render log biar warnanya sesuai tema
  setTimeout(function() {
    if (typeof window.renderLogs === 'function') {
      try { window.renderLogs(); } catch (e) {}
    }
  }, 50);
}

// ===== Init =====
export function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = saved || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', theme);
  currentTheme = theme;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateIcon(theme);
      bindToggle();
    });
  } else {
    updateIcon(theme);
    bindToggle();
  }

  console.log('[Theme] Init: ' + theme);
}

function bindToggle() {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);
}

// ===== Expose =====
window.ArcaneTheme = {
  get: getTheme,
  set: setTheme,
  toggle: toggleTheme,
  init: initTheme
};

// Auto-init
initTheme();