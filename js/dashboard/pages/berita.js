// ===== PAGE: BERITA =====

import * as news from '../../data/news.js';
import { escapeHtml } from '../../utils/escape.js';
import { safeUrl } from '../../utils/url.js';
import { getRole } from '../../auth.js';

let items = [];

export async function init() {
  const el = document.querySelector('[data-page-content="berita"]');
  if (!el) return;

  console.log('[Berita] Init');

  renderShell(el);
  bindEvents();
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Berita' : 'News';
  const desc = isId ? 'Kelola berita ARCANE Community' : 'Manage ARCANE Community news';
  const addLabel = isId ? 'Tambah Berita' : 'Add News';

  el.innerHTML =
    '<div class="page-header">' +
      '<div>' +
        '<h1 data-i18n="admin.news.title">' + title + '</h1>' +
        '<p class="page-sub" data-i18n="admin.news.desc">' + desc + '</p>' +
      '</div>' +
      '<button class="btn btn-primary" id="addNewsBtn">' +
        '<i data-lucide="plus"></i> <span data-i18n="admin.news.add">' + addLabel + '</span>' +
      '</button>' +
    '</div>' +
    '<div class="admin-list" id="adminNewsList"></div>';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function bindEvents() {
  const addBtn = document.getElementById('addNewsBtn');
  if (addBtn) addBtn.addEventListener('click', function() { openForm(); });
}

export async function reload() {
  const list = document.getElementById('adminNewsList');
  if (!list) return;

  try {
    items = await news.list({ includeArchived: false });
  } catch (e) {
    console.error('[Berita] Load gagal:', e);
    items = [];
  }

  render();
}

function render() {
  const list = document.getElementById('adminNewsList');
  if (!list) return;

  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    const empty = isId ? 'Belum ada berita.' : 'No news yet.';
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + empty + '</p>';
    return;
  }

  list.innerHTML = items.map(function(item, index) {
    const title = item.title ? (item.title[window.currentLang] || item.title.id) : '';
    const dateStr = formatDate(item.date, window.currentLang);
    const thumb = item.thumbnail ? safeUrl(item.thumbnail) : '';

    return '<div class="admin-item reveal" style="--index:' + index + ';">' +
      (thumb ? '<img src="' + escapeHtml(thumb) + '" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:8px;flex-shrink:0;" />' : '') +
      '<div class="admin-item-info" style="flex:1;">' +
        '<h4>' + escapeHtml(title) + '</h4>' +
        '<p>' + escapeHtml(dateStr) + '</p>' +
      '</div>' +
      '<div class="admin-item-actions">' +
        '<button class="edit-news" data-id="' + escapeHtml(item.id) + '" title="Edit"><i data-lucide="pencil"></i></button>' +
        '<button class="delete-news danger" data-id="' + escapeHtml(item.id) + '" title="Arsipkan"><i data-lucide="archive"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Bind edit & archive
  list.querySelectorAll('.edit-news').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      const item = items.find(function(i) { return i.id === id; });
      if (item) openForm(item);
    });
  });

  list.querySelectorAll('.delete-news').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      confirmArchive(id);
    });
  });

  if (window.ArcaneReveal) window.ArcaneReveal.observe(list.querySelectorAll('.reveal'));
}

// ===== Form =====
function openForm(item) {
  const isId = (window.currentLang || 'id') === 'id';
  const isEdit = !!item;

  const title = isEdit
    ? (isId ? 'Edit Berita' : 'Edit News')
    : (isId ? 'Tambah Berita' : 'Add News');

  const fields = [
    { type: 'text',     name: 'title_id',   label: 'Judul (ID)',    value: item ? (item.title && item.title.id) : '', required: true },
    { type: 'text',     name: 'title_en',   label: 'Judul (EN)',    value: item ? (item.title && item.title.en) : '', required: true },
    { type: 'date',     name: 'date',       label: 'Tanggal',       value: item ? toDateInput(item.date) : todayInput(), required: true },
    { type: 'textarea', name: 'excerpt_id', label: 'Ringkasan (ID)', value: item ? (item.excerpt && item.excerpt.id) : '', required: true },
    { type: 'textarea', name: 'excerpt_en', label: 'Ringkasan (EN)', value: item ? (item.excerpt && item.excerpt.en) : '', required: true },
    { type: 'url',      name: 'thumbnail',  label: 'URL Gambar',    value: item ? item.thumbnail : '', placeholder: 'https://...' },
    { type: 'url',      name: 'url',        label: 'Link Berita',   value: item ? item.url : '', placeholder: 'https://...' }
  ];

  const formHtml = window.ArcaneForm ? window.ArcaneForm.build(fields) : '';

  window.ArcaneModal.open(title, formHtml, async function() {
    // Validate
    if (window.ArcaneForm) {
      const v = window.ArcaneForm.validate();
      if (!v.valid) {
        window.ArcaneToast.error(v.errors[0]);
        return;
      }
    }

    const formData = window.ArcaneForm ? window.ArcaneForm.getData() : {};
    const data = news.formatData(formData);

    try {
      if (isEdit) {
        await news.update(item.id, data);
        window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.saved') : 'Tersimpan.');
      } else {
        await news.add(data);
        window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.saved') : 'Tersimpan.');
      }
      window.ArcaneModal.close();
      await reload();
    } catch (e) {
      console.error('[Berita] Save gagal:', e);
      window.ArcaneToast.error(window.ArcaneI18n ? window.ArcaneI18n.t('toast.failed') : 'Gagal.');
    }
  });

  if (window.ArcaneForm) window.ArcaneForm.focusFirst();
}

// ===== Archive =====
function confirmArchive(id) {
  const isId = (window.currentLang || 'id') === 'id';
  const msg = isId ? 'Arsipkan berita ini?' : 'Archive this news?';

  window.ArcaneModal.confirm(msg, async function() {
    try {
      await news.archive(id);
      window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.archived') : 'Diarsipkan.');
      await reload();
    } catch (e) {
      console.error('[Berita] Archive gagal:', e);
      window.ArcaneToast.error(window.ArcaneI18n ? window.ArcaneI18n.t('toast.failed') : 'Gagal.');
    }
  }, { confirmLabel: isId ? 'Arsipkan' : 'Archive' });
}

// ===== Helpers =====
function formatDate(date, lang) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function toDateInput(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toISOString().slice(0, 10);
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}