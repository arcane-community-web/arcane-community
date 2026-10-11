// ===== NEWS =====

import * as collection from './collection.js';

const COLLECTION = 'news';

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

// ===== Format data berita =====
export function formatData(formData) {
  return {
    title: {
      id: formData.title_id || '',
      en: formData.title_en || ''
    },
    excerpt: {
      id: formData.excerpt_id || '',
      en: formData.excerpt_en || ''
    },
    content: {
      id: formData.content_id || '',
      en: formData.content_en || ''
    },
    thumbnail: formData.thumbnail || '',
    url: formData.url || '',
    date: formData.date ? new Date(formData.date).getTime() : Date.now()
  };
}