// ===== PAGE: ACARA =====

import * as events from '../../data/events.js';
import * as categories from '../../data/categories.js';
import { escapeHtml } from '../../utils/escape.js';
import { safeUrl } from '../../utils/url.js';

let items = [];
let cats = [];

export async function init() {
  const el = document.querySelector('[data-page-content="acara"]');
  if (!el) return;

  console.log('[Acara] Init');

  cats = await categories.list();
  renderShell(el);
  bindEvents();
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Acara' : 'Events';
  const desc = isId ? 'Kelola acara ARCANE Community' : 'Manage ARCANE Community events';
  const addLabel = isId ? 'Tambah Acara' : 'Add Event';

  el.innerHTML =
    '<div class="page-header">' +
      '<div>' +
        '<h1 data-i18n="admin.events.title">' + title + '</h1>' +
        '<p class="page-sub" data-i18n="admin.events.desc">' + desc + '</p>' +
      '</div>' +
      '<button class="btn btn-primary" id="addEventBtn">' +
        '<i data-lucide="plus"></i> <span data-i18n="admin.events.add">' + addLabel + '</span>' +
      '</button>' +
    '</div>' +
    '<div class="admin-list" id="adminEventsList"></div>';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function bindEvents() {
  const addBtn = document.getElementById('addEventBtn');
  if (addBtn) addBtn.addEventListener('click', function() { openForm(); });
}

export async function reload() {
  const list = document.getElementById('adminEventsList');
  if (!list) return;

  try {
    items = await events.list({ includeArchived: false });
  } catch (e) {
    console.error('[Acara] Load gagal:', e);
    items = [];
  }

  render();
}

function render() {
  const list = document.getElementById('adminEventsList');
  if (!list) return;

  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    const empty = isId ? 'Belum ada acara.' : 'No events yet.';
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + empty + '</p>';
    return;
  }

  // Sort by priority + date
  const sorted = events.sortByPriority(items);

  list.innerHTML = sorted.map(function(item, index) {
    const title = item.title ? (item.title[window.currentLang] || item.title.id) : '';
    const cat = findCat(item.categoryId);
    const catLabel = cat ? (cat.name[window.currentLang] || cat.name.id) : '';
    const catColor = cat ? cat.color : '#EF4444';
    const prio = Number(item.priority) || 3;

    return '<div class="admin-item reveal" style="--index:' + index + ';">' +
      '<div class="admin-item-info" style="flex:1;">' +
        '<h4>' + escapeHtml(title) + '</h4>' +
        '<p>' +
          '<span style="display:inline-block;padding:2px 8px;border-radius:12px;background:' + escapeHtml(catColor) + ';color:#fff;font-size:11px;font-weight:600;margin-right:6px;">' + escapeHtml(catLabel) + '</span>' +
          'Prioritas ' + prio +
        '</p>' +
      '</div>' +
      '<div class="admin-item-actions">' +
        '<button class="edit-event" data-id="' + escapeHtml(item.id) + '" title="Edit"><i data-lucide="pencil"></i></button>' +
        '<button class="delete-event danger" data-id="' + escapeHtml(item.id) + '" title="Arsipkan"><i data-lucide="archive"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  list.querySelectorAll('.edit-event').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      const item = items.find(function(i) { return i.id === id; });
      if (item) openForm(item);
    });
  });

  list.querySelectorAll('.delete-event').forEach(function(btn) {
    btn.addEventListener('click', function() {
      confirmArchive(btn.dataset.id);
    });
  });

  if (window.ArcaneReveal) window.ArcaneReveal.observe(list.querySelectorAll('.reveal'));
}

// ===== Form =====
function openForm(item) {
  const isId = (window.currentLang || 'id') === 'id';
  const isEdit = !!item;
  const title = isEdit
    ? (isId ? 'Edit Acara' : 'Edit Event')
    : (isId ? 'Tambah Acara' : 'Add Event');

  const catOptions = cats.map(function(c) {
    return { value: c.id, label: c.name[window.currentLang] || c.name.id };
  });

  const prioOptions = [5, 4, 3, 2, 1].map(function(p) {
    return { value: String(p), label: String(p) };
  });

  const fields = [
    { type: 'text',           name: 'title_id',       label: 'Judul (ID)',       value: item ? (item.title && item.title.id) : '', required: true },
    { type: 'text',           name: 'title_en',       label: 'Judul (EN)',       value: item ? (item.title && item.title.en) : '', required: true },
    { type: 'datetime-local', name: 'start',          label: 'Mulai',            value: item ? toLocalInput(item.start) : '', required: true },
    { type: 'datetime-local', name: 'end',            label: 'Selesai',          value: item ? toLocalInput(item.end) : '' },
    { type: 'textarea',       name: 'description_id', label: 'Deskripsi (ID)',   value: item ? (item.description && item.description.id) : '' },
    { type: 'textarea',       name: 'description_en', label: 'Deskripsi (EN)',   value: item ? (item.description && item.description.en) : '' },
    { type: 'select',         name: 'category',       label: 'Kategori',         value: item ? item.categoryId : '', options: catOptions, required: true },
    { type: 'select',         name: 'priority',       label: 'Prioritas (1-5)',  value: item ? String(item.priority || 3) : '3', options: prioOptions, required: true },
    { type: 'text',           name: 'location',       label: 'Lokasi',           value: item ? item.location : '', placeholder: 'Aula Sekolah' },
    { type: 'url',            name: 'maps_url',       label: 'Link Google Maps', value: item ? item.mapsUrl : '', placeholder: 'https://maps.app.goo.gl/...' }
  ];

  const formHtml = window.ArcaneForm ? window.ArcaneForm.build(fields) : '';

  window.ArcaneModal.open(title, formHtml, async function() {
    if (window.ArcaneForm) {
      const v = window.ArcaneForm.validate();
      if (!v.valid) {
        window.ArcaneToast.error(v.errors[0]);
        return;
      }
    }

    const formData = window.ArcaneForm ? window.ArcaneForm.getData() : {};
    const data = events.formatData(formData);

    try {
      if (isEdit) {
        await events.update(item.id, data);
      } else {
        await events.add(data);
      }
      window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.saved') : 'Tersimpan.');
      window.ArcaneModal.close();
      await reload();
    } catch (e) {
      console.error('[Acara] Save gagal:', e);
      window.ArcaneToast.error(window.ArcaneI18n ? window.ArcaneI18n.t('toast.failed') : 'Gagal.');
    }
  });

  if (window.ArcaneForm) window.ArcaneForm.focusFirst();
}

function confirmArchive(id) {
  const isId = (window.currentLang || 'id') === 'id';
  const msg = isId ? 'Arsipkan acara ini?' : 'Archive this event?';

  window.ArcaneModal.confirm(msg, async function() {
    try {
      await events.archive(id);
      window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.archived') : 'Diarsipkan.');
      await reload();
    } catch (e) {
      console.error('[Acara] Archive gagal:', e);
      window.ArcaneToast.error(window.ArcaneI18n ? window.ArcaneI18n.t('toast.failed') : 'Gagal.');
    }
  }, { confirmLabel: isId ? 'Arsipkan' : 'Archive' });
}

// ===== Helpers =====
function findCat(id) {
  return cats.find(function(c) { return c.id === id; }) || null;
}

function toLocalInput(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}