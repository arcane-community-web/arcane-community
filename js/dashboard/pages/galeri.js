// ===== PAGE: GALERI =====

import * as gallery from '../../data/gallery.js';
import { escapeHtml } from '../../utils/escape.js';
import { safeUrl } from '../../utils/url.js';
import { uploadImage, validateImageFile, getThumbUrl, getFullUrl } from '../../utils/cloudinary.js';

let items = [];

export async function init() {
  const el = document.querySelector('[data-page-content="galeri"]');
  if (!el) return;

  console.log('[Galeri] Init');

  renderShell(el);
  bindEvents();
  await reload();
}

function renderShell(el) {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Galeri' : 'Gallery';
  const desc = isId ? 'Kelola galeri ARCANE Community' : 'Manage ARCANE Community gallery';
  const addLabel = isId ? 'Upload Gambar' : 'Upload Image';

  el.innerHTML =
    '<div class="page-header">' +
      '<div>' +
        '<h1 data-i18n="admin.gallery.title">' + title + '</h1>' +
        '<p class="page-sub" data-i18n="admin.gallery.desc">' + desc + '</p>' +
      '</div>' +
      '<button class="btn btn-primary" id="addGalleryBtn">' +
        '<i data-lucide="upload"></i> <span data-i18n="admin.gallery.add">' + addLabel + '</span>' +
      '</button>' +
    '</div>' +
    '<div class="admin-gallery" id="adminGalleryList"></div>';

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function bindEvents() {
  const addBtn = document.getElementById('addGalleryBtn');
  if (addBtn) addBtn.addEventListener('click', function() { openUploadForm(); });
}

export async function reload() {
  const list = document.getElementById('adminGalleryList');
  if (!list) return;

  try {
    items = await gallery.list({ includeArchived: false });
  } catch (e) {
    console.error('[Galeri] Load gagal:', e);
    items = [];
  }

  render();
}

function render() {
  const list = document.getElementById('adminGalleryList');
  if (!list) return;

  const isId = (window.currentLang || 'id') === 'id';

  if (!items.length) {
    const empty = isId ? 'Belum ada gambar.' : 'No images yet.';
    list.innerHTML = '<p style="color:var(--text-mute);text-align:center;padding:30px 0;grid-column:1/-1;">' + empty + '</p>';
    return;
  }

  list.innerHTML = items.map(function(item, index) {
    const caption = item.caption ? (item.caption[window.currentLang] || item.caption.id) : '';
    const thumb = safeUrl(item.thumbUrl);

    return '<div class="admin-gallery-item reveal" style="--index:' + index + ';">' +
      '<img src="' + escapeHtml(thumb) + '" alt="' + escapeHtml(caption) + '" loading="lazy" />' +
      '<button class="delete-gallery" data-id="' + escapeHtml(item.id) + '" title="Arsipkan"><i data-lucide="archive"></i></button>' +
    '</div>';
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  list.querySelectorAll('.delete-gallery').forEach(function(btn) {
    btn.addEventListener('click', function() {
      confirmArchive(btn.dataset.id);
    });
  });

  if (window.ArcaneReveal) window.ArcaneReveal.observe(list.querySelectorAll('.reveal'));
}

// ===== Upload Form =====
function openUploadForm() {
  const isId = (window.currentLang || 'id') === 'id';
  const title = isId ? 'Upload Gambar' : 'Upload Image';

  const formHtml =
    '<div class="form-field" style="margin-bottom:14px;">' +
      '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">File Gambar *</label>' +
      '<input type="file" id="galleryFile" accept="image/*" required />' +
      '<small style="display:block;color:var(--text-mute);font-size:12px;margin-top:4px;">JPG, PNG, WebP, atau GIF. Maks 10MB.</small>' +
    '</div>' +
    '<div class="form-field" style="margin-bottom:14px;">' +
      '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Caption (ID) *</label>' +
      '<input type="text" id="galleryCaptionId" required />' +
    '</div>' +
    '<div class="form-field" style="margin-bottom:14px;">' +
      '<label style="display:block;font-size:13px;font-weight:600;color:var(--text-mute);margin-bottom:6px;">Caption (EN) *</label>' +
      '<input type="text" id="galleryCaptionEn" required />' +
    '</div>' +
    '<div id="uploadProgress" style="display:none;margin-top:14px;">' +
      '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;">' +
        '<div id="uploadBar" style="height:100%;background:var(--blue);width:0%;transition:width .3s ease;"></div>' +
      '</div>' +
      '<p id="uploadText" style="font-size:12px;color:var(--text-mute);margin-top:6px;text-align:center;">0%</p>' +
    '</div>' +
    '<div id="uploadPreview" style="margin-top:14px;display:none;">' +
      '<img id="previewImg" style="max-width:100%;max-height:200px;border-radius:8px;margin:0 auto;" />' +
    '</div>';

  window.ArcaneModal.open(title, formHtml, async function() {
    const fileInput = document.getElementById('galleryFile');
    const captionId = document.getElementById('galleryCaptionId').value.trim();
    const captionEn = document.getElementById('galleryCaptionEn').value.trim();

    if (!fileInput.files || !fileInput.files[0]) {
      window.ArcaneToast.error('Pilih file gambar.');
      return;
    }
    if (!captionId || !captionEn) {
      window.ArcaneToast.error('Caption wajib diisi.');
      return;
    }

    const file = fileInput.files[0];
    const check = validateImageFile(file);
    if (!check.valid) {
      window.ArcaneToast.error(check.error);
      return;
    }

    // Show progress
    const progressEl = document.getElementById('uploadProgress');
    const barEl = document.getElementById('uploadBar');
    const textEl = document.getElementById('uploadText');
    if (progressEl) progressEl.style.display = 'block';

    try {
      const uploaded = await uploadImage(file, function(percent) {
        if (barEl) barEl.style.width = percent + '%';
        if (textEl) textEl.textContent = percent + '%';
      });

      // Simpan ke Firestore
      const data = {
        caption: { id: captionId, en: captionEn },
        thumbUrl: getThumbUrl(uploaded.publicId, 400),
        fullUrl: getFullUrl(uploaded.publicId, 1200),
        publicId: uploaded.publicId
      };

      await gallery.add(data);
      window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.uploaded') : 'Berhasil diunggah.');
      window.ArcaneModal.close();
      await reload();
    } catch (e) {
      console.error('[Galeri] Upload gagal:', e);
      window.ArcaneToast.error(e.message || 'Upload gagal.');
    }
  });

  // Bind preview
  setTimeout(function() {
    const fileInput = document.getElementById('galleryFile');
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
          const previewWrap = document.getElementById('uploadPreview');
          const previewImg = document.getElementById('previewImg');
          if (previewWrap && previewImg) {
            previewImg.src = e.target.result;
            previewWrap.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, 100);
}

// ===== Archive =====
function confirmArchive(id) {
  const isId = (window.currentLang || 'id') === 'id';
  const msg = isId ? 'Arsipkan gambar ini?' : 'Archive this image?';

  window.ArcaneModal.confirm(msg, async function() {
    try {
      await gallery.archive(id);
      window.ArcaneToast.success(window.ArcaneI18n ? window.ArcaneI18n.t('toast.archived') : 'Diarsipkan.');
      await reload();
    } catch (e) {
      console.error('[Galeri] Archive gagal:', e);
      window.ArcaneToast.error(window.ArcaneI18n ? window.ArcaneI18n.t('toast.failed') : 'Gagal.');
    }
  }, { confirmLabel: isId ? 'Arsipkan' : 'Archive' });
}