// ===== PAGE: KATEGORI — Kategori & Prioritas Acara (Owner) =====

import * as categories from '../../data/categories.js';
import { escapeHtml } from '../../utils/escape.js';

let items = [];

export async function init() {
  const el = document.querySelector('[data-page-content="kategori"]');
  if (!el) return;

  console.log('[Kategori] Init');

  renderShell(el);
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Kategori & Prioritas' : 'Categories & Priorities';
  const desc = isId ? 'Kelola kategori dan warna acara' : 'Manage event categories and colors';
  const addLabel = isId ? 'Tambah Kategori' : 'Add Category';

  el.innerHTML =
    '<div class="page-header">' +
      '<div>' +
        '<h1>' + title + '</h1>' +
        '<p class="page-sub">' + desc + '</p>' +
      '</div>' +
      '<button class="btn btn-primary" id="addCatBtn">' +
        '<i data-lucide="plus"></i> ' + addLabel +
      '</button>' +
    '</div>' +
    '<div class="admin-list" id="catList"></div>' +
    '<h2 style="font-family:var(--font-head);font-size:18px;margin:30px 0 14px;">' +
      (isId ? 'Prioritas' : 'Priorities') +
    '</h2>' +
    '<div id="prioList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;"></div>';

  document.getElementById('addCatBtn').addEventListener('click', function() { openForm(); });
}

export async function reload() {
  items = await categories.list();
  renderList();
  renderPriorities();

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderList() {
  const list = document.getElementById('catList');
  if (!list) return;

  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">' + (isId ? 'Belum ada kategori.' : 'No categories.') + '</p>';
    return;
  }

  list.innerHTML = items.map(function(item) {
    const nameId = item.name && item.name.id ? item.name.id : '';
    const nameEn = item.name && item.name.en ? item.name.en : '';

    return '<div class="admin-item">' +
      '<div class="admin-item-info" style="flex:1;display:flex;align-items:center;gap:12px;">' +
        '<div style="width:36px;height:36px;border-radius:10px;background:' + escapeHtml(item.color) + ';display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;">' +
          '<i data-lucide="' + escapeHtml(item.icon) + '"></i>' +
        '</div>' +
        '<div>' +
          '<h4>' + escapeHtml(nameId) + ' / ' + escapeHtml(nameEn) + '</h4>' +
          '<p>' + escapeHtml(item.id) + ' · ' + escapeHtml(item.color) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="admin-item-actions">' +
        '<button class="edit-cat" data-id="' + escapeHtml(item.id) + '"><i data-lucide="pencil"></i></button>' +
        '<button class="delete-cat danger" data-id="' + escapeHtml(item.id) + '"><i data-lucide="trash-2"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  list.querySelectorAll('.edit-cat').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = items.find(function(i) { return i.id === btn.dataset.id; });
      if (item) openForm(item);
    });
  });

  list.querySelectorAll('.delete-cat').forEach(function(btn) {
    btn.addEventListener('click', function() {
      confirmDelete(btn.dataset.id);
    });
  });
}

function renderPriorities() {
  const el = document.getElementById('prioList');
  if (!el) return;

  const isId = (window.currentLang || 'id') === 'id';

  const prios = [5, 4, 3, 2, 1];
  const colors = { 5: '#EF4444', 4: '#F97316', 3: '#1E9BE0', 2: '#10B981', 1: '#9CA3AF' };
  const labels = {
    id: { 5: 'Sangat Penting', 4: 'Penting', 3: 'Normal', 2: 'Biasa', 1: 'Santai' },
    en: { 5: 'Critical', 4: 'Important', 3: 'Normal', 2: 'Low', 1: 'Casual' }
  };

  el.innerHTML = prios.map(function(p) {
    const label = labels[window.currentLang][p];
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:10px;">' +
      '<div style="width:32px;height:32px;border-radius:50%;background:' + colors[p] + ';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;">' + p + '</div>' +
      '<span style="font-size:14px;font-weight:500;">' + label + '</span>' +
    '</div>';
  }).join('');
}

function openForm(item) {
  const isId = (window.currentLang || 'id') === 'id';
  const isEdit = !!item;
  const title = isEdit ? (isId ? 'Edit Kategori' : 'Edit Category') : (isId ? 'Tambah Kategori' : 'Add Category');

  const fields = [
    { type: 'text',  name: 'id',       label: 'ID (slug)',     value: item ? item.id : '', required: true, placeholder: 'sosial' },
    { type: 'text',  name: 'name_id',  label: 'Nama (ID)',     value: item ? (item.name && item.name.id) : '', required: true },
    { type: 'text',  name: 'name_en',  label: 'Nama (EN)',     value: item ? (item.name && item.name.en) : '', required: true },
    { type: 'color', name: 'color',    label: 'Warna',         value: item ? item.color : '#8B5CF6', required: true },
    { type: 'text',  name: 'icon',     label: 'Ikon (Lucide)', value: item ? item.icon : 'users', required: true, placeholder: 'users' },
    { type: 'number', name: 'order',   label: 'Urutan',        value: item ? (item.order || 0) : 0 }
  ];

  const formHtml = window.ArcaneForm ? window.ArcaneForm.build(fields) : '';

  window.ArcaneModal.open(title, formHtml, async function() {
    const fd = window.ArcaneForm ? window.ArcaneForm.getData() : {};

    if (!fd.id || !fd.name_id || !fd.name_en) {
      window.ArcaneToast.error('Lengkapi data.');
      return;
    }

    const data = {
      name: { id: fd.name_id.trim(), en: fd.name_en.trim() },
      color: fd.color || '#8B5CF6',
      icon: fd.icon || 'users',
      order: Number(fd.order) || 0
    };

    try {
      await categories.set(fd.id.trim(), data);
      window.ArcaneToast.success(isId ? 'Tersimpan.' : 'Saved.');
      window.ArcaneModal.close();
      await reload();
    } catch (e) {
      console.error('[Kategori] Save gagal:', e);
      window.ArcaneToast.error(isId ? 'Gagal menyimpan.' : 'Failed.');
    }
  });

  if (window.ArcaneForm) window.ArcaneForm.focusFirst();
}

function confirmDelete(id) {
  const isId = (window.currentLang || 'id') === 'id';
  const msg = isId ? 'Hapus kategori ini? Acara yang pakai kategori ini akan tetap ada.' : 'Delete this category?';

  window.ArcaneModal.confirm(msg, async function() {
    try {
      await categories.remove(id);
      window.ArcaneToast.success(isId ? 'Dihapus.' : 'Deleted.');
      await reload();
    } catch (e) {
      console.error('[Kategori] Delete gagal:', e);
      window.ArcaneToast.error(isId ? 'Gagal menghapus.' : 'Failed.');
    }
  });
}