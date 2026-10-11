// ===== COLLECTION — CRUD Bersama =====
// Semua koleksi (news, events, gallery) pakai API ini
// Otomatis log ke activity

import { db, auth } from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logActivity } from './activity.js';

// ===== List — semua dokumen =====
export async function list(collectionName, options) {
  options = options || {};
  const { includeArchived = false, orderByField = 'createdAt', orderDir = 'desc', maxItems = 100 } = options;

  try {
    const ref = collection(db, collectionName);
    let q;

    if (includeArchived) {
      q = query(ref, orderBy(orderByField, orderDir));
    } else {
      q = query(ref, where('archived', '==', false), orderBy(orderByField, orderDir));
    }

    const snap = await getDocs(q);
    const items = [];
    snap.forEach(function (d) {
      const data = d.data();
      // Filter client-side untuk dokumen lama tanpa field archived
      if (includeArchived || data.archived !== true) {
        items.push({ id: d.id, ...data });
      }
    });

    return items.slice(0, maxItems);
  } catch (e) {
    console.warn('[Collection] Query gagal, fallback client-side:', e.message);
    try {
      const ref = collection(db, collectionName);
      const snap = await getDocs(ref);
      const items = [];
      snap.forEach(function (d) {
        const data = d.data();
        if (includeArchived || data.archived !== true) {
          items.push({ id: d.id, ...data });
        }
      });
      return items.slice(0, maxItems);
    } catch (e2) {
      console.error('[Collection] Fallback gagal:', e2);
      throw e2;
    }
  }
}

// ===== List arsip (owner) =====
export async function listArchived(collectionName) {
  try {
    const ref = collection(db, collectionName);
    const q = query(ref, where('archived', '==', true));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(function (d) {
      items.push({ id: d.id, ...d.data() });
    });
    return items;
  } catch (e) {
    console.error('[Collection] List arsip gagal:', e);
    return [];
  }
}

// ===== Get — 1 dokumen =====
export async function get(collectionName, id) {
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (e) {
    console.error('[Collection] Get gagal:', e);
    return null;
  }
}

// ===== Add =====
export async function add(collectionName, data) {
  try {
    const payload = {
      ...data,
      archived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, collectionName), payload);

    await logActivity({
      action: 'create',
      collection: collectionName,
      docId: ref.id,
      docTitle: extractTitle(data)
    });

    return { id: ref.id, ...payload };
  } catch (e) {
    console.error('[Collection] Add gagal:', e);
    throw e;
  }
}

// ===== Update =====
export async function update(collectionName, id, data) {
  try {
    const payload = {
      ...data,
      updatedAt: serverTimestamp()
    };

    delete payload.createdAt;
    delete payload.archived;

    await updateDoc(doc(db, collectionName, id), payload);

    await logActivity({
      action: 'update',
      collection: collectionName,
      docId: id,
      docTitle: extractTitle(data)
    });

    return { id, ...data };
  } catch (e) {
    console.error('[Collection] Update gagal:', e);
    throw e;
  }
}

// ===== Archive =====
export async function archive(collectionName, id) {
  try {
    await updateDoc(doc(db, collectionName, id), {
      archived: true,
      updatedAt: serverTimestamp()
    });

    await logActivity({
      action: 'archive',
      collection: collectionName,
      docId: id,
      docTitle: ''
    });

    return true;
  } catch (e) {
    console.error('[Collection] Archive gagal:', e);
    throw e;
  }
}

// ===== Restore (owner) =====
export async function restore(collectionName, id) {
  try {
    await updateDoc(doc(db, collectionName, id), {
      archived: false,
      updatedAt: serverTimestamp()
    });

    await logActivity({
      action: 'restore',
      collection: collectionName,
      docId: id,
      docTitle: ''
    });

    return true;
  } catch (e) {
    console.error('[Collection] Restore gagal:', e);
    throw e;
  }
}

// ===== Delete permanen (owner) =====
export async function remove(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id));

    await logActivity({
      action: 'delete',
      collection: collectionName,
      docId: id,
      docTitle: ''
    });

    return true;
  } catch (e) {
    console.error('[Collection] Delete gagal:', e);
    throw e;
  }
}

// ===== Helper: Extract title dari data =====
function extractTitle(data) {
  if (!data) return '';
  if (typeof data.title === 'string') return data.title;
  if (data.title && data.title.id) return data.title.id;
  if (typeof data.name === 'string') return data.name;
  if (data.name && data.name.id) return data.name.id;
  if (typeof data.caption === 'string') return data.caption;
  if (data.caption && data.caption.id) return data.caption.id;
  return '';
}