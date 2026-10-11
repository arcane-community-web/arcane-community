// ===== FORM — Form Builder & Validasi =====

import { escapeHtml } from '../utils/escape.js';

// ===== Build field =====
export function field(config) {
  const { type, name, label, value, placeholder, required, options, hint } = config;

  const safeName = escapeHtml(name || '');
  const safeLabel = escapeHtml(label || '');
  const safeValue = escapeHtml(value || '');
  const safePlaceholder = escapeHtml(placeholder || '');
  const safeHint = hint ? '<small style="display:block;color:var(--text-mute);font-size:12px;margin-top:4px;">' + escapeHtml(hint) + '</small>' : '';
  const req = required ? ' required' : '';

  let inputHtml = '';

  if (type === 'textarea') {
    inputHtml = '<textarea name="' + safeName + '" placeholder="' + safePlaceholder + '"' + req + '>' + safeValue + '</textarea>';
  } else if (type === 'select') {
    let opts = '<option value="">— ' + escapeHtml(placeholder || 'Pilih') + ' —</option>';
    (options || []).forEach(function(opt) {
      const optVal = escapeHtml(opt.value);
      const optLabel = escapeHtml(opt.label);
      const selected = (String(opt.value) === String(value)) ? ' selected' : '';
      opts += '<option value="' + optVal + '"' + selected + '>' + optLabel + '</option>';
    });
    inputHtml = '<select name="' + safeName + '"' + req + '>' + opts + '</select>';
  } else if (type === 'datetime-local' || type === 'date' || type === 'time' || type === 'number' || type === 'color' || type === 'email' || type === 'password' || type === 'url') {
    inputHtml = '<input type="' + type + '" name="' + safeName + '" value="' + safeValue + '" placeholder="' + safePlaceholder + '"' + req + ' />';
  } else {
    inputHtml = '<input type="text" name="' + safeName + '" value="' + safeValue + '" placeholder="' + safePlaceholder + '"' + req + ' />';
  }

  return '<div class="form-field" style="margin-bottom:14px;">' +
    '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">' +
      safeLabel + (required ? ' *' : '') +
    '</label>' +
    inputHtml +
    safeHint +
  '</div>';
}

// ===== Build form =====
export function build(fields) {
  if (!Array.isArray(fields)) return '';
  return '<form id="modalFormInner" class="modal-form" style="display:flex;flex-direction:column;gap:14px;">' +
    fields.map(field).join('') +
  '</form>';
}

// ===== Get form data =====
export function getData(formId) {
  const form = document.getElementById(formId || 'modalFormInner');
  if (!form) return {};

  const data = {};
  const formData = new FormData(form);

  formData.forEach(function(value, key) {
    data[key] = value;
  });

  return data;
}

// ===== Set form data =====
export function setData(formId, data) {
  const form = document.getElementById(formId || 'modalFormInner');
  if (!form) return;

  Object.keys(data).forEach(function(key) {
    const el = form.elements[key];
    if (!el) return;

    if (el.type === 'checkbox') {
      el.checked = !!data[key];
    } else if (el.type === 'radio') {
      // skip
    } else {
      el.value = data[key] !== null && data[key] !== undefined ? data[key] : '';
    }
  });
}

// ===== Validate =====
export function validate(formId) {
  const form = document.getElementById(formId || 'modalFormInner');
  if (!form) return { valid: false, errors: ['Form tidak ditemukan.'] };

  const errors = [];
  const formData = new FormData(form);

  formData.forEach(function(value, key) {
    const el = form.elements[key];
    if (!el) return;

    if (el.required && (!value || String(value).trim() === '')) {
      const label = el.previousElementSibling;
      const labelText = label && label.tagName === 'LABEL' ? label.textContent : key;
      errors.push(labelText + ' wajib diisi.');
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ===== Focus first =====
export function focusFirst(formId) {
  const form = document.getElementById(formId || 'modalFormInner');
  if (!form) return;
  const first = form.querySelector('input, textarea, select');
  if (first) setTimeout(function() { first.focus(); }, 100);
}

// ===== Expose =====
window.ArcaneForm = {
  field: field,
  build: build,
  getData: getData,
  setData: setData,
  validate: validate,
  focusFirst: focusFirst
};