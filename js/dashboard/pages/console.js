// ===== PAGE: CONSOLE — Console Log Teknis (Owner) =====

import { escapeHtml } from '../../utils/escape.js';

let currentFilter = 'all';

export async function init() {
  const el = document.querySelector('[data-page-content="console"]');
  if (!el) return;

  console.log('[Console] Init');

  renderShell(el);
  renderLogs();
  updateBadge();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';

  el.innerHTML =
    '<h1 data-i18n="console.title">Console Log</h1>' +
    '<p class="page-sub" data-i18n="console.desc">Log aktivitas & error sistem</p>' +
    '<div class="log-filter">' +
      '<button class="log-filter-btn active" data-filter="all" data-i18n="console.filter.all">Semua</button>' +
      '<button class="log-filter-btn" data-filter="success" data-i18n="console.filter.success">Sukses</button>' +
      '<button class="log-filter-btn" data-filter="warning" data-i18n="console.filter.warning">Warning</button>' +
      '<button class="log-filter-btn" data-filter="error" data-i18n="console.filter.error">Error</button>' +
      '<button class="log-clear-btn" id="clearLogs" data-i18n="console.clear">Clear</button>' +
    '</div>' +
    '<div class="log-list" id="logList"></div>';

  // Bind filter
  document.querySelectorAll('.log-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.log-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderLogs();
    });
  });

  // Bind clear
  const clearBtn = document.getElementById('clearLogs');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      const isId = (window.currentLang || 'id') === 'id';
      window.ArcaneModal.confirm(
        isId ? 'Hapus semua log?' : 'Clear all logs?',
        function() {
          if (window.ArcaneLogger) window.ArcaneLogger.clear();
          renderLogs();
          updateBadge();
        }
      );
    });
  }
}

// ===== Render logs =====
export function renderLogs() {
  const list = document.getElementById('logList');
  if (!list) return;

  let filtered = window.ArcaneLogger ? window.ArcaneLogger.getAll() : [];
  if (currentFilter !== 'all') {
    filtered = filtered.filter(function(l) { return l.type === currentFilter; });
  }

  if (!filtered.length) {
    const isId = (window.currentLang || 'id') === 'id';
    list.innerHTML = '<p class="log-empty">' + (isId ? 'Belum ada log.' : 'No logs yet.') + '</p>';
    return;
  }

  filtered = filtered.slice().reverse();

  list.innerHTML = filtered.map(function(log) {
    const icon = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : '✅';
    const isId = (window.currentLang || 'id') === 'id';
    const hint = log.type !== 'success'
      ? '<span class="log-hint">' + (isId ? 'Klik untuk detail teknis →' : 'Click for technical details →') + '</span>'
      : '';

    return '<div class="log-item ' + log.type + '" data-id="' + log.id + '">' +
      '<span class="log-time">' + escapeHtml(log.time) + '</span>' +
      '<span class="log-icon">' + icon + '</span>' +
      '<span class="log-message">' + escapeHtml(log.friendly) + '</span>' +
      hint +
    '</div>';
  }).join('');

  list.querySelectorAll('.log-item').forEach(function(item) {
    item.addEventListener('click', function() {
      const id = parseFloat(item.dataset.id);
      const log = window.ArcaneLogger.getAll().find(function(l) { return l.id === id; });
      if (log) showDetail(log);
    });
  });
}

function showDetail(log) {
  const list = document.getElementById('logList');
  if (!list) return;

  const t = log.technical || {};
  const errType = (t.message && t.message.split(':')[0]) || (log.type === 'error' ? 'Error' : 'Info');
  const isId = (window.currentLang || 'id') === 'id';

  list.innerHTML =
    '<div class="log-detail">' +
      '<span class="error-type">' + escapeHtml(errType) + '</span>\n' +
      escapeHtml(t.message || 'N/A') + '\n\n' +
      '<span class="label">Waktu:</span>     <span class="value">' + escapeHtml(log.time) + '</span>\n' +
      '<span class="label">Tipe:</span>      <span class="value">' + escapeHtml(log.type) + '</span>\n' +
      '<span class="label">File:</span>      <span class="value">' + escapeHtml(t.file || 'N/A') + '</span>\n' +
      '<span class="label">Line:</span>      <span class="value">' + (t.line || 'N/A') + '</span>\n\n' +
      '<span class="label">Stack Trace:</span>\n' +
      '<span class="value">' + escapeHtml(t.stack || 'N/A') + '</span>' +
    '</div>' +
    '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">' +
      '<button class="modal-btn primary" id="copyErrBtn">📋 Copy Error</button>' +
      '<button class="modal-btn ghost" id="backLogsBtn">← ' + (isId ? 'Kembali' : 'Back') + '</button>' +
    '</div>';

  const copyBtn = document.getElementById('copyErrBtn');
  const backBtn = document.getElementById('backLogsBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const text = '[ARCANE Error]\n' +
        'Waktu: ' + log.time + '\n' +
        'Tipe: ' + log.type + '\n' +
        'Pesan: ' + (t.message || 'N/A') + '\n' +
        'File: ' + (t.file || 'N/A') + '\n' +
        'Line: ' + (t.line || 'N/A') + '\n\n' +
        'Stack:\n' + (t.stack || 'N/A');

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          window.ArcaneToast.success('✅ Copied!');
        }).catch(function() {
          alert(text);
        });
      } else {
        alert(text);
      }
    });
  }

  if (backBtn) backBtn.addEventListener('click', renderLogs);
}

// ===== Badge =====
export function updateBadge() {
  const badge = document.getElementById('logBadge');
  if (!badge) return;

  const count = window.ArcaneLogger ? window.ArcaneLogger.countError() : 0;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

// ===== Expose buat logger =====
window.renderLogs = renderLogs;
window.updateLogBadge = updateBadge;