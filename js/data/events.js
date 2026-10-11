// ===== EVENTS =====

import * as collection from './collection.js';

const COLLECTION = 'events';

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

// ===== Format data acara =====
export function formatData(formData) {
  return {
    title: {
      id: formData.title_id || '',
      en: formData.title_en || ''
    },
    description: {
      id: formData.description_id || '',
      en: formData.description_en || ''
    },
    start: formData.start ? new Date(formData.start).getTime() : Date.now(),
    end: formData.end ? new Date(formData.end).getTime() : null,
    location: formData.location || '',
    mapsUrl: formData.maps_url || '',
    categoryId: formData.category || 'event',
    priority: Number(formData.priority) || 3
  };
}

// ===== Filter acara yang akan datang =====
export function filterUpcoming(items) {
  const now = Date.now();
  return items.filter(function(item) {
    const endDate = item.end || item.start;
    return endDate >= now;
  });
}

// ===== Sort — prioritas lalu tanggal =====
export function sortByPriority(items) {
  return items.slice().sort(function(a, b) {
    const pA = Number(a.priority) || 3;
    const pB = Number(b.priority) || 3;
    if (pA !== pB) return pB - pA;
    return (a.start || 0) - (b.start || 0);
  });
}