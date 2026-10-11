// ===== MODAL — Modal & Konfirmasi =====

import { escapeHtml } from '../utils/escape.js';

let modalEl = null;
let modalTitle = null;
let modalBody = null;
let modalFooter = null;
let currentOnSave = null;
let currentOnCancel = null;

// ===== Init =====
export function initModal() {
  modalEl = document.getElementById('modal');
  modalTitle = document.getElementById('modalTitle');
  modalBody = document.getElementById('modalBody');
  modalFooter = document.getElementById('modalFooter');

  // Close button
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Cancel button
  const cancelBtn = document.getElementById('modalCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', close);

  // Save button
  const saveBtn = document.getElementById('modalSave');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      if (typeof currentOnSave === 'function') currentOnSave();
    });
  }

  // Backdrop click
  if (modalEl) {
    modalEl.addEventListener('click', function(e) {
      if (e.target === modalEl) close();
    });
  }

  // ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('open')) {
      close();
    }
  });

  console.log('[Modal] Init');
}

// ===== Open =====
export function open(title, contentHtml, onSave, options) {
  options = options || {};
  if (!modalEl) return;

  modalTitle.textContent = title || 'Form';
  modalBody.innerHTML = contentHtml || '';
  currentOnSave = onSave;

  // Footer buttons
  if (options.footer === false) {
    modalFooter.style.display = 'none';
  } else {
    modalFooter.style.display = 'flex';

    // Custom footer
    if (options.footerHtml) {
      modalFooter.innerHTML = options.footerHtml;
    } else {
      const isId = (window.currentLang || 'id') === 'id';
      const saveLabel = isId ? 'Simpan' : 'Save';
      const cancelLabel = isId ? 'Batal' : 'Cancel';
      const danger = options.danger;

      modalFooter.innerHTML =
        '<button type="button" class="modal-btn ghost" id="modalCancel">' + cancelLabel + '</button>' +
        '<button type="button" class="modal-btn ' + (danger ? 'danger' : 'primary') + '" id="modalSave">' +
          (options.saveLabel || saveLabel) +
        '</button>';

      // Re-bind
      const newCancel = document.getElementById('modalCancel');
      const newSave = document.getElementById('modalSave');
      if (newCancel) newCancel.addEventListener('click', close);
      if (newSave) {
        newSave.addEventListener('click', function() {
          if (typeof currentOnSave === 'function') currentOnSave();
        });
      }
    }
  }

  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';
  console.log('[Modal] Buka: ' + title);
}

// ===== Close =====
export function close() {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
  currentOnSave = null;
  console.log('[Modal] Tutup');
}

// ===== Konfirmasi =====
export function confirm(message, onConfirm, options) {
  options = options || {};
  const isId = (window.currentLang || 'id') === 'id';
  const confirmLabel = options.confirmLabel || (isId ? 'Ya' : 'Yes');
  const cancelLabel = options.cancelLabel || (isId ? 'Batal' : 'Cancel');
  const danger = options.danger !== false;

  const footerHtml =
    '<button type="button" class="modal-btn ghost" id="confirmCancel">' + cancelLabel + '</button>' +
    '<button type="button" class="modal-btn ' + (danger ? 'danger' : 'primary') + '" id="confirmOk">' +
      confirmLabel +
    '</button>';

  open(
    options.title || (isId ? 'Konfirmasi' : 'Confirm'),
    '<p style="color:var(--text-mute);line-height:1.6;">' + escapeHtml(message) + '</p>',
    null,
    { footerHtml: footerHtml, footer: true }
  );

  // Bind
  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');

  if (okBtn) {
    okBtn.addEventListener('click', function() {
      close();
      if (typeof onConfirm === 'function') onConfirm();
    });
  }
  if (cancelBtn) cancelBtn.addEventListener('click', close);
}

// ===== Prompt (input sederhana) =====
export function prompt(title, placeholder, onSave, options) {
  options = options || {};
  const isId = (window.currentLang || 'id') === 'id';
  const saveLabel = options.saveLabel || (isId ? 'Simpan' : 'Save');
  const cancelLabel = options.cancelLabel || (isId ? 'Batal' : 'Cancel');

  const bodyHtml =
    '<input type="text" id="promptInput" placeholder="' + escapeHtml(placeholder || '') +
    '" value="' + escapeHtml(options.value || '') + '" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:inherit;font-size:14.5px;background:var(--bg);color:var(--text);" />';

  const footerHtml =
    '<button type="button" class="modal-btn ghost" id="promptCancel">' + cancelLabel + '</button>' +
    '<button type="button" class="modal-btn primary" id="promptSave">' + saveLabel + '</button>';

  open(title, bodyHtml, null, { footerHtml: footerHtml, footer: true });

  const input = document.getElementById('promptInput');
  const saveBtn = document.getElementById('promptSave');
  const cancelBtn = document.getElementById('promptCancel');

  if (input) {
    setTimeout(function() { input.focus(); }, 100);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (saveBtn) saveBtn.click();
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const value = input ? input.value.trim() : '';
      close();
      if (typeof onSave === 'function') onSave(value);
    });
  }
  if (cancelBtn) cancelBtn.addEventListener('click', close);
}

// ===== Is open =====
export function isOpen() {
  return modalEl ? modalEl.classList.contains('open') : false;
}

// ===== Expose =====
window.ArcaneModal = {
  init: initModal,
  open: open,
  close: close,
  confirm: confirm,
  prompt: prompt,
  isOpen: isOpen
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModal);
} else {
  initModal();
}