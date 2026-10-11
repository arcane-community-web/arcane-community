// ===== REVEAL — Fade-up + Lazy Load =====

let revealObserver = null;
let lazyObserver = null;
let initialized = false;

// ===== Init =====
export function initReveal() {
  if (initialized) return;
  initialized = true;

  if (!revealObserver && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  }

  if (!lazyObserver && 'IntersectionObserver' in window) {
    lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
  }
}

// ===== Observe elemen reveal =====
export function observeReveal(elements) {
  if (!revealObserver) initReveal();

  const els = elements || document.querySelectorAll('.reveal:not(.reveal-visible)');

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('reveal-visible'); });
    return;
  }

  els.forEach(function (el) {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// ===== Observe lazy image =====
export function observeLazyImages(elements) {
  if (!lazyObserver) initReveal();

  const imgs = elements || document.querySelectorAll('img[data-src]');

  if (!('IntersectionObserver' in window)) {
    imgs.forEach(function (img) {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    });
    return;
  }

  imgs.forEach(function (img) {
    lazyObserver.observe(img);
  });
}

// ===== Reset =====
export function resetReveal(container) {
  const root = container || document;
  root.querySelectorAll('.reveal-visible').forEach(function (el) {
    el.classList.remove('reveal-visible');
  });
  root.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.remove('reveal');
  });
}

// ===== Auto-init =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}

// ===== Expose =====
window.ArcaneReveal = {
  init: initReveal,
  observe: observeReveal,
  observeLazy: observeLazyImages,
  reset: resetReveal
};