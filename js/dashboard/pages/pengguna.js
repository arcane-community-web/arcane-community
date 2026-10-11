// ===== PAGE: PENGGUNA — Kelola Akun (Owner) =====

import * as users from '../../data/users.js';
import { getUser } from '../../auth.js';
import { escapeHtml } from '../../utils/escape.js';

let items = [];
let currentUser = null;

export async function init() {
  const el = document.querySelector('[data-page-content="pengguna"]');
  if (!el) return;

  console.log('[Pengguna] Init');

  currentUser = getUser();
  renderShell(el);
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Pengguna' : 'Users';
  const desc = isId ? 'Kelola akun, role, dan status' : 'Manage accounts, roles, and status';

  el.innerHTML =
    '<h1>' + title + '</h1>' +
    '<p class="page-sub">' + desc + '</p>' +
    '<div id="userStats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px;"></div>' +
    '<div class="admin-list" id="userList"></div>';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

export async function reload() {
  items = await users.list();
  renderStats();
  renderList();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderStats() {
  const el = document.getElementById('userStats');
  if (!el) return;

  const isId = (window.currentLang || 'id') === 'id';
  const total = items.length;
  const owners = items.filter(function(u) { return u.role === 'owner'; }).length;
  const operators = items.filter(function(u) { return u.role === 'operator'; }).length;
  const members = items.filter(function(u) { return u.role === 'member'; }).length;
  const active = items.filter(function(u) { return u.active !== false; }).length;
  const inactive = items.filter(function(u) { return u.active === false; }).length;

  const cards = [
    { label: 'Total', value: total, icon: 'users' },
    { label: 'Owner', value: owners, icon: 'crown' },
    { label: 'Operator', value: operators, icon: 'shield' },
    { label: 'Member', value: members, icon: 'user' },
    { label: isId ? 'Aktif' : 'Active', value: active, icon: 'check-circle' },
    { label: isId ? 'Nonaktif' : 'Inactive', value: inactive, icon: 'x-circle' }
  ];

  el.innerHTML = cards.map(function(c) {
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;">' +
      '<i data-lucide="' + c.icon + '" style="color:var(--blue);margin-bottom:6px;"></i>' +
      '<div style="font-family:var(--font-head);font-size:22px;font-weight:700;">' + c.value + '</div>' +
      '<div style="font-size:12px;color:var(--text-mute);">' + c.label + '</div>' +
    '</div>';
  }).join('');
}

function renderList() {
  const list = document.getElementById('userList');
  if (!list) return;

  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;">—</p>';
    return;
  }

  list.innerHTML = items.map(function(item) {
    const isMe = currentUser && currentUser.uid === item.id;
    const isActive = item.active !== false;
    const roleColor = {
      owner: '#EF4444',
      operator: '#F97316',
      member: '#1E9BE0'
    }[item.role] || '#9CA3AF';

    return '<div class="admin-item" style="' + (!isActive ? 'opacity:.6;' : '') + '">' +
      '<div class="admin-item-info" style="flex:1;">' +
        '<h4>' +
          escapeHtml(item.username || '(no username)') +
          (isMe ? ' <span style="font-size:11px;color:var(--blue);">(' + (isId ? 'kamu' : 'you') + ')</span>' : '') +
        '</h4>' +
        '<p>' +
          escapeHtml(item.email || '') + ' · ' +
          '<span style="display:inline-block;padding:2px 8px;border-radius:10px;background:' + roleColor + ';color:#fff;font-size:11px;font-weight:600;">' + escapeHtml(item.role || 'member') + '</span>' +
          (isActive ? '' : ' · <span style="color:#EF4444;font-weight:600;">' + (isId ? 'NONAKTIF' : 'INACTIVE') + '</span>') +
        '</p>' +
      '</div>' +
      '<div class="admin-item-actions">' +
        '<button class="edit-user" data-id="' + escapeHtml(item.id) + '" title="Edit"><i data-lucide="pencil"></i></button>' +
        '<button class="toggle-user ' + (isActive ? 'danger' : '') + '" data-id="' + escapeHtml(item.id) + '" data-active="' + isActive + '" title="' + (isActive ? 'Nonaktifkan' : 'Aktifkan') + '">' +
          '<i data-lucide="' + (isActive ? 'user-x' : 'user-check') + '"></i>' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  list.querySelectorAll('.edit-user').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = items.find(function(i) { return i.id === btn.dataset.id; });
      if (item) openEdit(item);
    });
  });

  list.querySelectorAll('.toggle-user').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const isActive = btn.dataset.active === 'true';
      toggleActive(btn.dataset.id, !isActive);
    });
  });
}

function openEdit(user) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Edit Pengguna' : 'Edit User';

  const fields = [
    { type: 'text', name: 'username', label: 'Username', value: user.username || '', required: true },
    { type: 'select', name: 'role', label: 'Role', value: user.role || 'member', options: [
      { value: 'owner', label: 'Owner' },
      { value: 'operator', label: 'Operator' },
      { value: 'member', label: 'Member' }
    ], required: true }
  ];

  const formHtml = window.ArcaneForm ? window.ArcaneForm.build(fields) : '';

  window.ArcaneModal.open(title, formHtml, async function() {
    const fd = window.ArcaneForm ? window.ArcaneForm.getData() : {};

    try {
      // Update username
      if (fd.username && fd.username.trim() !== user.username) {
        await users.updateUsername(user.id, fd.username);
      }

      // Update role
      if (fd.role && fd.role !== user.role) {
        await users.updateRole(user.id, fd.role, currentUser.uid);
      }

      window.ArcaneToast.success(isId ? 'Tersimpan.' : 'Saved.');
      window.ArcaneModal.close();
      await reload();
    } catch (e) {
      console.error('[Pengguna] Save gagal:', e);
      window.ArcaneToast.error(e.message || 'Gagal.');
    }
  });

  // Tambah tombol reset password
  setTimeout(function() {
    const form = document.getElementById('modalFormInner');
    if (form && user.email) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-ghost';
      btn.style.cssText = 'width:100%;margin-top:8px;';
      btn.innerHTML = '<i data-lucide="mail"></i> ' + (isId ? 'Kirim Reset Password' : 'Send Password Reset');
      btn.addEventListener('click', function() {
        resetPassword(user.email);
      });
      form.appendChild(btn);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }, 150);

  if (window.ArcaneForm) window.ArcaneForm.focusFirst();
}

async function toggleActive(uid, newActive) {
  const isId = (window.currentLang || 'id') === 'id';
  const user = items.find(function(i) { return i.id === uid; });
  if (!user) return;

  const msg = newActive
    ? (isId ? 'Aktifkan kembali akun ini?' : 'Reactivate this account?')
    : (isId ? 'Nonaktifkan akun ini? User tidak bisa login.' : 'Deactivate this account?');

  window.ArcaneModal.confirm(msg, async function() {
    try {
      await users.setActive(uid, newActive, currentUser.uid);
      window.ArcaneToast.success(isId ? 'Tersimpan.' : 'Saved.');
      await reload();
    } catch (e) {
      console.error('[Pengguna] Toggle gagal:', e);
      window.ArcaneToast.error(e.message || 'Gagal.');
    }
  }, {
    confirmLabel: newActive ? (isId ? 'Aktifkan' : 'Activate') : (isId ? 'Nonaktifkan' : 'Deactivate'),
    danger: !newActive
  });
}

async function resetPassword(email) {
  const isId = (window.currentLang || 'id') === 'id';

  window.ArcaneModal.confirm(
    isId ? 'Kirim email reset password ke ' + email + '?' : 'Send password reset email to ' + email + '?',
    async function() {
      try {
        await users.sendReset(email);
        window.ArcaneToast.success(isId ? 'Email terkirim.' : 'Email sent.');
      } catch (e) {
        console.error('[Pengguna] Reset gagal:', e);
        window.ArcaneToast.error(isId ? 'Gagal kirim email.' : 'Failed to send.');
      }
    },
    { danger: false, confirmLabel: isId ? 'Kirim' : 'Send' }
  );
}