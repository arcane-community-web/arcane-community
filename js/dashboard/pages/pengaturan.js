// ===== PAGE: PENGATURAN — Pengaturan Situs (Owner) =====

import * as site from '../../data/site.js';

export async function init() {
  const el = document.querySelector('[data-page-content="pengaturan"]');
  if (!el) return;

  console.log('[Pengaturan] Init');

  const data = await site.getDocSite('settings');
  render(el, data || site.DEFAULTS.settings);
}

function render(el, data) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Pengaturan Situs' : 'Site Settings';
  const desc = isId ? 'Nama web, tagline, dan versi' : 'Site name, tagline, and version';

  el.innerHTML =
    '<h1>' + title + '</h1>' +
    '<p class="page-sub">' + desc + '</p>' +
    '<form id="settingsForm" style="display:flex;flex-direction:column;gap:14px;max-width:500px;">' +
      '<div>' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">' + (isId ? 'Nama Web' : 'Site Name') + '</label>' +
        '<input type="text" name="siteName" value="' + esc(data.siteName) + '" required style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />' +
      '</div>' +
      '<div>' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Tagline</label>' +
        '<input type="text" name="tagline" value="' + esc(data.tagline) + '" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />' +
      '</div>' +
      '<div>' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">' + (isId ? 'Versi' : 'Version') + '</label>' +
        '<input type="text" name="version" value="' + esc(data.version) + '" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />' +
      '</div>' +
      '<button type="submit" class="btn btn-primary" style="align-self:flex-start;margin-top:8px;">' +
        '<i data-lucide="save"></i> ' + (isId ? 'Simpan' : 'Save') +
      '</button>' +
    '</form>';

  if (typeof lucide !== 'undefined') lucide.createIcons();

  const form = document.getElementById('settingsForm');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = {
      siteName: (fd.get('siteName') || '').trim(),
      tagline: (fd.get('tagline') || '').trim(),
      version: (fd.get('version') || '').trim()
    };

    try {
      await site.setDocSite('settings', payload);
      window.ArcaneToast.success(isId ? 'Tersimpan.' : 'Saved.');
      document.title = payload.siteName + ' — ' + payload.tagline;
    } catch (err) {
      console.error('[Pengaturan] Save gagal:', err);
      window.ArcaneToast.error(isId ? 'Gagal menyimpan.' : 'Failed.');
    }
  });
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}