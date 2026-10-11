// ===== PAGE: AKTIVITAS — Log Aktivitas (Owner) =====

import * as activity from '../../data/activity.js';
import { escapeHtml } from '../../utils/escape.js';

export async function init() {
  const el = document.querySelector('[data-page-content="aktivitas"]');
  if (!el) return;

  console.log('[Aktivitas] Init');

  renderShell(el);
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Log Aktivitas' : 'Activity Log';
  const desc = isId ? 'Siapa mengubah apa dan kapan' : 'Who changed what and when';

  el.innerHTML =
    '<div class="page-header">' +
      '<div>' +
        '<h1>' + title + '</h1>' +
        '<p class="page-sub">' + desc + '</p>' +
      '</div>' +
      '<button class="btn btn-ghost" id="refreshActivity"><i data-lucide="refresh-cw"></i> Refresh</button>' +
    '</div>' +
    '<div id="activityList" class="admin-list"></div>';

  document.getElementById('refreshActivity').addEventListener('click', reload);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

export async function reload() {
  const list = document.getElementById('activityList');
  if (!list) return;

  const items = await activity.list(100);
  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + (isId ? 'Belum ada aktivitas.' : 'No activity yet.') + '</p>';
    return;
  }

  list.innerHTML = items.map(function(item) {
    const time = formatTime(item.timestamp);
    const actionLabel = activity.actionLabel(item.action, window.currentLang);

    return '<div class="admin-item">' +
      '<div class="admin-item-info" style="flex:1;">' +
        '<h4 style="font-size:14px;">' +
          '<strong>' + escapeHtml(item.username || '?') + '</strong> · ' +
          escapeHtml(actionLabel) + ' ' +
          '<code style="font-size:12px;color:var(--blue);">' + escapeHtml(item.collection) + '</code>' +
          (item.docTitle ? ' — ' + escapeHtml(item.docTitle) : '') +
        '</h4>' +
        '<p style="font-size:12px;">' + escapeHtml(time) + ' · ' + escapeHtml(item.docId || '') + '</p>' +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const isId = (window.currentLang || 'id') === 'id';
  return d.toLocaleString(isId ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}