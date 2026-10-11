// ===== ACTIVITY — Log Aktivitas =====
// Owner only — baca
// Semua write dari collection.js otomatis ke sini

import { db, auth } from '../firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COLLECTION = 'activity';

// ===== Log aktivitas =====
export async function logActivity(data) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Ambil username dari window
    const username = (window.ArcaneUser && window.ArcaneUser.username) || user.email || 'unknown';

    await addDoc(collection(db, COLLECTION), {
      action: data.action || 'update',
      collection: data.collection || '',
      docId: data.docId || '',
      docTitle: data.docTitle || '',
      userId: user.uid,
      username: username,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    // Jangan sampai log gagal bikin error
    console.warn('[Activity] Log gagal:', e.message);
  }
}

// ===== List aktivitas (owner) =====
export async function list(maxItems) {
  maxItems = maxItems || 100;

  try {
    const ref = collection(db, COLLECTION);
    const q = query(ref, orderBy('timestamp', 'desc'), limit(maxItems));
    const snap = await getDocs(q);

    const items = [];
    snap.forEach(function(d) {
      items.push({ id: d.id, ...d.data() });
    });

    return items;
  } catch (e) {
    console.warn('[Activity] Query gagal, fallback:', e.message);
    try {
      const ref = collection(db, COLLECTION);
      const snap = await getDocs(ref);
      const items = [];
      snap.forEach(function(d) {
        items.push({ id: d.id, ...d.data() });
      });
      // Sort client-side
      items.sort(function(a, b) {
        const tA = a.timestamp && a.timestamp.toMillis ? a.timestamp.toMillis() : 0;
        const tB = b.timestamp && b.timestamp.toMillis ? b.timestamp.toMillis() : 0;
        return tB - tA;
      });
      return items.slice(0, maxItems);
    } catch (e2) {
      console.error('[Activity] Fallback gagal:', e2);
      return [];
    }
  }
}

// ===== Label action =====
export function actionLabel(action, lang) {
  const isId = (lang || 'id') === 'id';
  const labels = {
    create:  isId ? 'Menambah'     : 'Created',
    update:  isId ? 'Mengubah'     : 'Updated',
    archive: isId ? 'Mengarsipkan' : 'Archived',
    restore: isId ? 'Memulihkan'   : 'Restored',
    delete:  isId ? 'Menghapus'    : 'Deleted'
  };
  return labels[action] || action;
}