// ===== TOAST — Notifikasi Singkat =====

let containerEl = null;

// ===== Init container =====
function ensureContainer() {
  if (containerEl) return containerEl;

  containerEl = document.createElement('div');
  containerEl.id = 'toastContainer';
  containerEl.style.cssText =
    'position:fixed;top:80px;right:20px;z-index:110;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:340px;';
  document.body.appendChild(containerEl);

  return containerEl;
}

// ===== Show toast =====
export function show(message, type, duration) {
  type = type || 'success';
  duration = duration || 3000;

  const container = ensureContainer();

  const colors = {
    success: { bg: '#10B981', icon: '✓' },
    error:   { bg: '#EF4444', icon: '✕' },
    warning: { bg: '#F59E0B', icon: '⚠' },
    info:    { bg: '#1E9BE0', icon: 'ℹ' }
  };

  const color = colors[type] || colors.success;

  const toast = document.createElement('div');
  toast.style.cssText =
    'background:' + color.bg + ';color:#fff;padding:12px 16px;border-radius:10px;' +
    'font-size:14px;font-weight:500;box-shadow:0 8px 30px rgba(0,0,0,.2);' +
    'display:flex;align-items:center;gap:10px;pointer-events:auto;' +
    'opacity:0;transform:translateX(30px);transition:opacity .3s ease,transform .3s ease;';

  toast.innerHTML =
    '<span style="font-weight:700;font-size:16px;flex-shrink:0;">' + color.icon + '</span>';

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(function() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto remove
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);

  console.log('[Toast] ' + type + ': ' + message);
}

// ===== Shortcuts =====
export function success(msg, duration) { show(msg, 'success', duration); }
export function error(msg, duration)   { show(msg, 'error', duration || 5000); }
export function warning(msg, duration) { show(msg, 'warning', duration); }
export function info(msg, duration)    { show(msg, 'info', duration); }

// ===== Helper =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== Expose =====
window.ArcaneToast = {
  show: show,
  success: success,
  error: error,
  warning: warning,
  info: info
};