// ===== PAGE: KONTEN — Teks Situs (Owner) =====

import * as site from '../../data/site.js';

let siteData = null;

export async function init() {
  const el = document.querySelector('[data-page-content="konten"]');
  if (!el) return;

  console.log('[Konten] Init');

  siteData = await site.getAll();
  render(el);
}

function render(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Konten Situs' : 'Site Content';
  const desc = isId ? 'Kelola teks hero, section, footer, dan banner' : 'Manage hero, sections, footer, and banner text';

  el.innerHTML =
    '<h1>' + title + '</h1>' +
    '<p class="page-sub">' + desc + '</p>' +
    '<div id="kontenTabs" style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:12px;">' +
      tabBtn('hero', isId ? 'Hero' : 'Hero', true) +
      tabBtn('sections', isId ? 'Section' : 'Sections', false) +
      tabBtn('footer', isId ? 'Footer' : 'Footer', false) +
      tabBtn('welcome', isId ? 'Welcome' : 'Welcome', false) +
    '</div>' +
    '<div id="kontenBody"></div>';

  // Bind tabs
  document.querySelectorAll('#kontenTabs .konten-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#kontenTabs .konten-tab').forEach(function(b) {
        b.classList.remove('active');
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-mute)';
      });
      btn.classList.add('active');
      btn.style.borderBottom = '2px solid var(--blue)';
      btn.style.color = 'var(--blue)';
      renderTab(btn.dataset.tab);
    });
  });

  // Render tab pertama
  renderTab('hero');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function tabBtn(id, label, active) {
  const style = 'padding:8px 14px;background:none;border:none;cursor:pointer;font-size:14px;font-weight:600;' +
    (active
      ? 'color:var(--blue);border-bottom:2px solid var(--blue);'
      : 'color:var(--text-mute);border-bottom:none;');
  return '<button class="konten-tab' + (active ? ' active' : '') + '" data-tab="' + id + '" style="' + style + '">' + label + '</button>';
}

function renderTab(tab) {
  const body = document.getElementById('kontenBody');
  if (!body || !siteData) return;

  if (tab === 'hero') renderHero(body);
  else if (tab === 'sections') renderSections(body);
  else if (tab === 'footer') renderFooter(body);
  else if (tab === 'welcome') renderWelcome(body);
}

// ===== Hero =====
function renderHero(body) {
  const data = siteData.hero || site.DEFAULTS.hero;

  const fields = [
    { type: 'text',     name: 'badge_id',    label: 'Badge (ID)',    value: data.badge && data.badge.id },
    { type: 'text',     name: 'badge_en',    label: 'Badge (EN)',    value: data.badge && data.badge.en },
    { type: 'text',     name: 'title_id',    label: 'Judul (ID)',    value: data.title && data.title.id, required: true },
    { type: 'text',     name: 'title_en',    label: 'Judul (EN)',    value: data.title && data.title.en, required: true },
    { type: 'textarea', name: 'subtitle_id', label: 'Subtitle (ID)', value: data.subtitle && data.subtitle.id },
    { type: 'textarea', name: 'subtitle_en', label: 'Subtitle (EN)', value: data.subtitle && data.subtitle.en },
    { type: 'text',     name: 'cta_id',      label: 'Tombol CTA (ID)', value: data.cta && data.cta.id },
    { type: 'text',     name: 'cta_en',      label: 'Tombol CTA (EN)', value: data.cta && data.cta.en }
  ];

  body.innerHTML = buildForm('hero', fields, 'Simpan Hero');
}

// ===== Sections =====
function renderSections(body) {
  const data = siteData.sections || site.DEFAULTS.sections;
  const isId = (window.currentLang || 'id') === 'id';

  const sectionKeys = ['news', 'events', 'gallery'];
  const sectionLabels = {
    news: isId ? 'Berita' : 'News',
    events: isId ? 'Acara' : 'Events',
    gallery: isId ? 'Galeri' : 'Gallery'
  };

  let html = '';

  sectionKeys.forEach(function(key) {
    const sec = data[key] || {};
    html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:20px;">' +
      '<h3 style="font-family:var(--font-head);font-size:16px;margin-bottom:14px;">' + sectionLabels[key] + '</h3>' +
      '<div class="form-field" style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Judul (ID)</label>' +
        '<input type="text" name="' + key + '_title_id" value="' + esc(sec.title && sec.title.id) + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />' +
      '</div>' +
      '<div class="form-field" style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Judul (EN)</label>' +
        '<input type="text" name="' + key + '_title_en" value="' + esc(sec.title && sec.title.en) + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />' +
      '</div>' +
      '<div class="form-field" style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Deskripsi (ID)</label>' +
        '<textarea name="' + key + '_desc_id" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);min-height:70px;">' + esc(sec.desc && sec.desc.id) + '</textarea>' +
      '</div>' +
      '<div class="form-field" style="margin-bottom:12px;">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Deskripsi (EN)</label>' +
        '<textarea name="' + key + '_desc_en" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);min-height:70px;">' + esc(sec.desc && sec.desc.en) + '</textarea>' +
      '</div>' +
      '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">' +
        '<input type="checkbox" name="' + key + '_visible" ' + (sec.visible !== false ? 'checked' : '') + ' />' +
        '<span>' + (isId ? 'Tampilkan section ini' : 'Show this section') + '</span>' +
      '</label>' +
    '</div>';
  });

  html += '<button class="btn btn-primary" id="saveSectionsBtn" style="margin-top:8px;"><i data-lucide="save"></i> Simpan Section</button>';
  body.innerHTML = html;

  if (typeof lucide !== 'undefined') lucide.createIcons();

  document.getElementById('saveSectionsBtn').addEventListener('click', saveSections);
}

async function saveSections() {
  const isId = (window.currentLang || 'id') === 'id';

  try {
    const sections = {};
    ['news', 'events', 'gallery'].forEach(function(key) {
      sections[key] = {
        title: {
          id: getVal(key + '_title_id'),
          en: getVal(key + '_title_en')
        },
        desc: {
          id: getVal(key + '_desc_id'),
          en: getVal(key + '_desc_en')
        },
        visible: getCheck(key + '_visible')
      };
    });

    await site.setDocSite('sections', sections);
    window.ArcaneToast.success(isId ? 'Section disimpan.' : 'Sections saved.');
    siteData = await site.getAll();
  } catch (e) {
    console.error('[Konten] Save sections gagal:', e);
    window.ArcaneToast.error(isId ? 'Gagal menyimpan.' : 'Failed to save.');
  }
}

// ===== Footer =====
function renderFooter(body) {
  const data = siteData.footer || site.DEFAULTS.footer;

  const fields = [
    { type: 'text', name: 'tagline_id', label: 'Tagline (ID)', value: data.tagline && data.tagline.id },
    { type: 'text', name: 'tagline_en', label: 'Tagline (EN)', value: data.tagline && data.tagline.en },
    { type: 'text', name: 'rights_id',  label: 'Hak Cipta (ID)', value: data.rights && data.rights.id },
    { type: 'text', name: 'rights_en',  label: 'Hak Cipta (EN)', value: data.rights && data.rights.en }
  ];

  body.innerHTML = buildForm('footer', fields, 'Simpan Footer');
}

// ===== Welcome =====
function renderWelcome(body) {
  const data = siteData.welcome || site.DEFAULTS.welcome;

  const fields = [
    { type: 'text',     name: 'title_id',    label: 'Judul (ID)',    value: data.title && data.title.id },
    { type: 'text',     name: 'title_en',    label: 'Judul (EN)',    value: data.title && data.title.en },
    { type: 'textarea', name: 'subtitle_id', label: 'Subtitle (ID)', value: data.subtitle && data.subtitle.id },
    { type: 'textarea', name: 'subtitle_en', label: 'Subtitle (EN)', value: data.subtitle && data.subtitle.en }
  ];

  body.innerHTML = buildForm('welcome', fields, 'Simpan Welcome');
}

// ===== Form builder sederhana =====
function buildForm(docId, fields, submitLabel) {
  let html = '<form id="kontenForm" style="display:flex;flex-direction:column;gap:14px;">';

  fields.forEach(function(f) {
    html += '<div class="form-field">' +
      '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">' + esc(f.label) + '</label>';

    if (f.type === 'textarea') {
      html += '<textarea name="' + f.name + '" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);min-height:80px;resize:vertical;">' + esc(f.value) + '</textarea>';
    } else {
      html += '<input type="text" name="' + f.name + '" value="' + esc(f.value) + '" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);" />';
    }

    html += '</div>';
  });

  html += '<button type="submit" class="btn btn-primary" style="margin-top:8px;align-self:flex-start;">' +
    '<i data-lucide="save"></i> ' + esc(submitLabel) +
  '</button></form>';

  setTimeout(function() {
    const form = document.getElementById('kontenForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveForm(docId, fields);
      });
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);

  return html;
}

async function saveForm(docId, fields) {
  const isId = (window.currentLang || 'id') === 'id';

  try {
    const data = {};
    const grouped = {};

    fields.forEach(function(f) {
      const val = getVal(f.name);
      const parts = f.name.split('_');
      const field = parts[0];
      const lang = parts[1];

      if (!grouped[field]) grouped[field] = {};
      grouped[field][lang] = val;
    });

    // Convert grouped → object
    Object.keys(grouped).forEach(function(key) {
      data[key] = grouped[key];
    });

    await site.setDocSite(docId, data);
    window.ArcaneToast.success(isId ? 'Tersimpan.' : 'Saved.');
    siteData = await site.getAll();

    // Re-apply ke halaman publik
    if (window.ArcaneRenderPublic) {
      await window.ArcaneRenderPublic.renderAll();
    }
  } catch (e) {
    console.error('[Konten] Save gagal:', e);
    window.ArcaneToast.error(isId ? 'Gagal menyimpan.' : 'Failed to save.');
  }
}

// ===== Helpers =====
function getVal(name) {
  const el = document.querySelector('[name="' + name + '"]');
  return el ? el.value.trim() : '';
}

function getCheck(name) {
  const el = document.querySelector('[name="' + name + '"]');
  return el ? el.checked : false;
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