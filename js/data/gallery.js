// ===== GALLERY =====

import * as collection from './collection.js';

const COLLECTION = 'gallery';

export function list(options) {
  return collection.list(COLLECTION, options);
}

export function listArchived() {
  return collection.listArchived(COLLECTION);
}

export function get(id) {
  return collection.get(COLLECTION, id);
}

export function add(data) {
  return collection.add(COLLECTION, data);
}

export function update(id, data) {
  return collection.update(COLLECTION, id, data);
}

export function archive(id) {
  return collection.archive(COLLECTION, id);
}

export function restore(id) {
  return collection.restore(COLLECTION, id);
}

export function remove(id) {
  return collection.remove(COLLECTION, id);
}

// ===== Format data galeri =====
export function formatData(uploaded, formData) {
  return {
    caption: {
      id: formData.caption_id || '',
      en: formData.caption_en || ''
    },
    thumbUrl: uploaded.thumbUrl || uploaded.url || '',
    fullUrl: uploaded.fullUrl || uploaded.url || '',
    publicId: uploaded.publicId || ''
  };
}