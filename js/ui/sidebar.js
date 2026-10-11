// ===== SIDEBAR — Overlay Dashboard =====

let sidebarEl = null;
let backdropEl = null;
let toggleBtn = null;
let initialized = false;

// ===== Init =====
export function initSidebar() {
  sidebarEl = document.getElementById('sidebar');
  backdropEl = document.getElementById('sidebarBackdrop');
  toggleBtn = document.getElementById('toggleSidebar');

  // Toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggle();
    });
  }

  // Close button
  const closeBtn = document.getElementById('closeSidebar');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      close();
    });
  }

  // Backdrop
  if (backdropEl) {
    backdropEl.addEventListener('click', close);
  }

  // ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarEl && sidebarEl.classList.contains('open')) {
      close();
    }
  });

  console.log('[Sidebar] Init');
}

// ===== Open =====
export function open() {
  if (!sidebarEl) return;
  sidebarEl.classList.add('open');
  if (backdropEl) backdropEl.classList.add('open');
  if (toggleBtn) toggleBtn.classList.add('active');
  sidebarEl.setAttribute('aria-hidden', 'false');
  console.log('[Sidebar] Buka');
}

// ===== Close =====
export function close() {
  if (!sidebarEl) return;
  sidebarEl.classList.remove('open');
  if (backdropEl) backdropEl.classList.remove('open');
  if (toggleBtn) toggleBtn.classList.remove('active');
  sidebarEl.setAttribute('aria-hidden', 'true');
  console.log('[Sidebar] Tutup');
}

// ===== Toggle =====
export function toggle() {
  if (!sidebarEl) return;
  if (sidebarEl.classList.contains('open')) {
    close();
  } else {
    open();
  }
}

// ===== Is open =====
export function isOpen() {
  return sidebarEl ? sidebarEl.classList.contains('open') : false;
}

// ===== Expose =====
window.ArcaneSidebar = {
  init: initSidebar,
  open: open,
  close: close,
  toggle: toggle,
  isOpen: isOpen
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebar);
} else {
  initSidebar();
}