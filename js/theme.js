// ===== Dark Mode =====
(function initTheme() {
  const saved = localStorage.getItem('arcane-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon(theme);
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Init Lucide setelah ikon theme di-set
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
})();

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('arcane-theme', next);
  updateThemeIcon(next);

  // Re-render kalender (warna FullCalendar ikut berubah)
  setTimeout(() => {
    if (typeof loadEvents === 'function' && window._arcaneCalendar) {
      loadEvents();
    }
    // Re-trigger reveal
    document.querySelectorAll('.reveal.visible').forEach(el => el.classList.remove('visible'));
    if (typeof observeReveal === 'function') setTimeout(observeReveal, 100);
  }, 50);
}