// ===== Page Transition =====
// Intersep semua link internal, bikin fade out dulu sebelum pindah

document.addEventListener('DOMContentLoaded', () => {
  // Preload halaman tujuan
  const links = document.querySelectorAll('a[href$=".html"]');
  links.forEach(link => {
    const href = link.getAttribute('href');

    // Preload pas hover (desktop) atau sentuh (mobile)
    link.addEventListener('mouseenter', () => preloadPage(href), { once: true });
    link.addEventListener('touchstart', () => preloadPage(href), { once: true, passive: true });

    // Transisi pas klik
    link.addEventListener('click', (e) => {
      // Skip kalau link external, target _blank, atau ada modifier key
      if (
        link.target === '_blank' ||
        link.hostname !== window.location.hostname ||
        e.metaKey || e.ctrlKey || e.shiftKey
      ) return;

      e.preventDefault();
      transitionTo(href);
    });
  });
});

// Preload halaman — pakai <link rel="prefetch">
function preloadPage(href) {
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Transisi keluar → pindah halaman
function transitionTo(href) {
  document.body.classList.add('page-exit');
  setTimeout(() => {
    window.location.href = href;
  }, 300);
}