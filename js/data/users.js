// ===== USERS — Kelola Akun & Role =====

import { db, auth } from '../firebase.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { logActivity } from './activity.js';

const COLLECTION = 'users';

// ===== List semua user =====
export async function list() {
  try {
    const ref = collection(db, COLLECTION);
    const snap = await getDocs(ref);

    const items = [];
    snap.forEach(function(d) {
      items.push({ id: d.id, ...d.data() });
    });

    // Sort by role (owner > operator > member)
    const roleOrder = { owner: 0, operator: 1, member: 2 };
    items.sort(function(a, b) {
      const rA = roleOrder[a.role] !== undefined ? roleOrder[a.role] : 99;
      const rB = roleOrder[b.role] !== undefined ? roleOrder[b.role] : 99;
      if (rA !== rB) return rA - rB;
      return (a.username || '').localeCompare(b.username || '');
    });

    return items;
  } catch (e) {
    console.error('[Users] List gagal:', e);
    return [];
  }
}

// ===== Get =====
export async function get(uid) {
  try {
    const snap = await getDoc(doc(db, COLLECTION, uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (e) {
    return null;
  }
}

// ===== Update username =====
export async function updateUsername(uid, username) {
  if (!uid || !username) throw new Error('Data tidak lengkap.');

  try {
    await updateDoc(doc(db, COLLECTION, uid), {
      username: username.trim(),
      updatedAt: serverTimestamp()
    });

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: uid,
      docTitle: username
    });

    return true;
  } catch (e) {
    console.error('[Users] Update username gagal:', e);
    throw e;
  }
}

// ===== Update role =====
export async function updateRole(uid, newRole, currentUserUid) {
  if (!uid || !newRole) throw new Error('Data tidak lengkap.');

  // Proteksi: owner nggak bisa turunin role sendiri
  if (uid === currentUserUid && newRole !== 'owner') {
    throw new Error('Owner tidak bisa menurunkan role dirinya sendiri.');
  }

  // Proteksi: owner terakhir nggak bisa diturunkan
  if (newRole !== 'owner') {
    const users = await list();
    const owners = users.filter(function(u) { return u.role === 'owner' && u.active !== false; });
    if (owners.length <= 1 && owners.some(function(u) { return u.id === uid; })) {
      throw new Error('Tidak bisa menurunkan owner terakhir.');
    }
  }

  try {
    await updateDoc(doc(db, COLLECTION, uid), {
      role: newRole,
      updatedAt: serverTimestamp()
    });

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: uid,
      docTitle: 'role: ' + newRole
    });

    return true;
  } catch (e) {
    console.error('[Users] Update role gagal:', e);
    throw e;
  }
}

// ===== Toggle active =====
export async function setActive(uid, active, currentUserUid) {
  if (!uid) throw new Error('UID tidak ada.');

  // Proteksi: nggak bisa nonaktifin diri sendiri
  if (uid === currentUserUid) {
    throw new Error('Tidak bisa menonaktifkan akun sendiri.');
  }

  // Proteksi: owner terakhir nggak bisa dinonaktifkan
  if (!active) {
    const users = await list();
    const owners = users.filter(function(u) { return u.role === 'owner' && u.active !== false; });
    if (owners.length <= 1 && owners.some(function(u) { return u.id === uid; })) {
      throw new Error('Tidak bisa menonaktifkan owner terakhir.');
    }
  }

  try {
    await updateDoc(doc(db, COLLECTION, uid), {
      active: !!active,
      updatedAt: serverTimestamp()
    });

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: uid,
      docTitle: active ? 'aktif' : 'nonaktif'
    });

    return true;
  } catch (e) {
    console.error('[Users] Set active gagal:', e);
    throw e;
  }
}

// ===== Kirim reset password =====
export async function sendReset(email) {
  if (!email) throw new Error('Email tidak ada.');

  try {
    await sendPasswordResetEmail(auth, email);

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: email,
      docTitle: 'reset password'
    });

    return true;
  } catch (e) {
    console.error('[Users] Reset password gagal:', e);
    throw e;
  }
}

// ===== Hapus user =====
export async function remove(uid, currentUserUid) {
  if (!uid) throw new Error('UID tidak ada.');

  if (uid === currentUserUid) {
    throw new Error('Tidak bisa menghapus akun sendiri.');
  }

  try {
    await deleteDoc(doc(db, COLLECTION, uid));

    await logActivity({
      action: 'delete',
      collection: COLLECTION,
      docId: uid,
      docTitle: uid
    });

    return true;
  } catch (e) {
    console.error('[Users] Remove gagal:', e);
    throw e;
  }
}

// ===== Statistik per role =====
export async function getStats() {
  try {
    const users = await list();
    const stats = {
      total: users.length,
      owner: users.filter(function(u) { return u.role === 'owner'; }).length,
      operator: users.filter(function(u) { return u.role === 'operator'; }).length,
      member: users.filter(function(u) { return u.role === 'member'; }).length,
      active: users.filter(function(u) { return u.active !== false; }).length,
      inactive: users.filter(function(u) { return u.active === false; }).length
    };
    return stats;
  } catch (e) {
    console.error('[Users] Stats gagal:', e);
    return { total: 0, owner: 0, operator: 0, member: 0, active: 0, inactive: 0 };
  }
}