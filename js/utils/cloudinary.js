// ===== CLOUDINARY UTILS =====
// Upload + transform URL

import { cloudinaryConfig } from '../cloudinary-config.js';

// Upload file ke Cloudinary
export async function uploadImage(file, onProgress) {
  const { cloudName, uploadPreset, folder } = cloudinaryConfig;

  if (!cloudName || cloudName === 'YOUR_CLOUD_NAME') {
    throw new Error('Cloudinary belum dikonfigurasi.');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            publicId: data.public_id,
            url: data.secure_url,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes
          });
        } catch (e) {
          reject(new Error('Gagal parse response Cloudinary.'));
        }
      } else {
        reject(new Error('Upload gagal: ' + xhr.status));
      }
    };

    xhr.onerror = () => reject(new Error('Upload gagal — cek koneksi.'));
    xhr.send(formData);
  });
}

// Buat URL transformasi
export function getThumbUrl(publicIdOrUrl, width = 400) {
  return buildUrl(publicIdOrUrl, width);
}

export function getFullUrl(publicIdOrUrl, width = 1200) {
  return buildUrl(publicIdOrUrl, width);
}

function buildUrl(publicIdOrUrl, width) {
  if (!publicIdOrUrl) return '';
  const { cloudName } = cloudinaryConfig;
  if (!cloudName || cloudName === 'YOUR_CLOUD_NAME') return publicIdOrUrl;

  // Kalau udah URL lengkap — ambil public ID
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.startsWith('http')) {
    const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (match) publicId = match[1];
    else return publicIdOrUrl;
  }

  // Buat URL transformasi
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},c_limit,q_auto,f_auto/${publicId}`;
}

// Validasi file gambar
export function validateImageFile(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!file) return { valid: false, error: 'File tidak ada.' };
  if (!ALLOWED.includes(file.type)) {
    return { valid: false, error: 'Format harus JPG, PNG, WebP, atau GIF.' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Ukuran maksimal 10MB.' };
  }
  return { valid: true };
}