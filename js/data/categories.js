// ===== CATEGORIES — Kategori & Prioritas Acara =====

import { db } from '../firebase.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logActivity } from './activity.js';

const COLLECTION = 'categories';

// ===== Default kategori =====
export const DEFAULT_CATEGORIES = [
  { id: 'sosial',  name: { id: 'Sosial',  en: 'Social'  }, color: '#8B5CF6', icon: 'users',     order: 1 },
  { id: 'liburan', name: { id: 'Liburan', en: 'Holiday' }, color: '#10B981', icon: 'sun',       order: 2 },
  { id: 'project', name: { id: 'Project', en: 'Project' }, color: '#F59E0B', icon: 'briefcase', order: 3 },
  { id: 'event',   name: { id: 'Event',   en: 'Event'   }, color: '#EF4444', icon: 'trophy',    order: 4 }
];

// ===== Prioritas default =====
export const DEFAULT_PRIORITIES = {
  5: { color: '#EF4444', label: { id: 'Sangat Penting', en: 'Critical' } },
  4: { color: '#F97316', label: { id: 'Penting',        en: 'Important' } },
  3: { color: '#1E9BE0', label: { id: 'Normal',         en: 'Normal' } },
  2: { color: '#10B981', label: { id: 'Biasa',          en: 'Low' } },
  1: { color: '#9CA3AF', label: { id: 'Santai',         en: 'Casual' } }
};

// ===== List kategori =====
export async function list() {
  try {
    const ref = collection(db, COLLECTION);
    const q = query(ref, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    const items = [];
    snap.forEach(function(d) {
      items.push({ id: d.id, ...d.data() });
    });

    if (items.length === 0) return DEFAULT_CATEGORIES;
    return items;
  } catch (e) {
    console.warn('[Categories] Query gagal, pakai default:', e.message);
    return DEFAULT_CATEGORIES;
  }
}

// ===== Get =====
export async function get(id) {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) {
      return DEFAULT_CATEGORIES.find(function(c) { return c.id === id; }) || null;
    }
    return { id: snap.id, ...snap.data() };
  } catch (e) {
    return null;
  }
}

// ===== Set =====
export async function set(id, data) {
  try {
    await setDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: id,
      docTitle: (data.name && data.name.id) || id
    });

    return true;
  } catch (e) {
    console.error('[Categories] Set gagal:', e);
    throw e;
  }
}

// ===== Remove =====
export async function remove(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));

    await logActivity({
      action: 'delete',
      collection: COLLECTION,
      docId: id,
      docTitle: id
    });

    return true;
  } catch (e) {
    console.error('[Categories] Remove gagal:', e);
    throw e;
  }
}

// ===== Seed default (jalankan sekali) =====
export async function seedDefaults() {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await setDoc(doc(db, COLLECTION, cat.id), cat, { merge: true });
    }
    console.log('[Categories] Seed default OK');
    return true;
  } catch (e) {
    console.error('[Categories] Seed gagal:', e);
    return false;
  }
}