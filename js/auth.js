// ===== AUTH — Login, logout, role, active =====

import { auth, db } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== State =====
let currentUser = null;
let currentUserData = null;
let isReady = false;
let readyResolve = null;
const readyPromise = new Promise(function(resolve) { readyResolve = resolve; });

// ===== Error messages =====
const AUTH_ERRORS = {
  'auth/invalid-email':        'Format email tidak valid.',
  'auth/user-disabled':        'Akun ini dinonaktifkan.',
  'auth/user-not-found':       'Email tidak terdaftar.',
  'auth/wrong-password':       'Password salah.',
  'auth/invalid-credential':   'Email atau password salah.',
  'auth/too-many-requests':    'Terlalu banyak percobaan. Coba lagi nanti.',
  'auth/network-request-failed': 'Koneksi bermasalah. Cek internet.',
  'auth/operation-not-allowed': 'Login email/password belum diaktifkan.'
};

function getAuthError(err) {
  if (err && err.code && AUTH_ERRORS[err.code]) {
    return AUTH_ERRORS[err.code];
  }
  if (err && err.message) return err.message;
  return 'Terjadi kesalahan. Coba lagi.';
}

// ===== Login =====
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  // Login ke Firebase Auth
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

  // Ambil data user dari Firestore
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid));

  if (!userDoc.exists()) {
    await signOut(auth);
    throw new Error('Akun belum di-setup. Hubungi owner.');
  }

  const data = userDoc.data();

  // Cek active
  if (data.active === false) {
    await signOut(auth);
    throw new Error('Akun ini dinonaktifkan. Hubungi owner.');
  }

  // Cek username
  if (!data.username) {
    await signOut(auth);
    throw new Error('Username belum di-setup. Hubungi owner.');
  }

  return {
    uid: cred.user.uid,
    email: cred.user.email,
    username: data.username,
    role: data.role || 'member',
    active: data.active !== false
  };
}

// ===== Logout =====
export async function logout() {
  try {
    sessionStorage.removeItem('arcane-welcome-shown');
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (e) {
    console.error('[Auth] Logout gagal:', e);
    window.location.href = 'login.html';
  }
}

// ===== Get current user =====
export function getUser() {
  return currentUser;
}

export function getUserData() {
  return currentUserData;
}

export function getRole() {
  return currentUserData ? currentUserData.role : null;
}

export function isLoggedIn() {
  return currentUser !== null;
}

export function isOwner() {
  return getRole() === 'owner';
}

export function isOperator() {
  const role = getRole();
  return role === 'operator' || role === 'owner';
}

// ===== Tunggu auth siap =====
export function ready() {
  return readyPromise;
}

export function isAuthReady() {
  return isReady;
}

// ===== Auth state listener =====
onAuthStateChanged(auth, async function(user) {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.exists() ? userDoc.data() : {};

      // Cek active
      if (data.active === false) {
  console.warn('[Auth] Akun nonaktif — logout');
  currentUser = null;
  currentUserData = null;
  await signOut(auth);
  window.location.href = 'login.html';
  return;
}

      currentUser = {
        uid: user.uid,
        email: user.email
      };
      currentUserData = {
        username: data.username || user.email.split('@')[0],
        role: String(data.role || 'member').toLowerCase().trim(),
        active: data.active !== false
      };

      console.log('[Auth] Login: ' + currentUserData.username + ' (' + currentUserData.role + ')');
    } catch (e) {
      console.error('[Auth] Gagal ambil user data:', e);
      currentUser = null;
      currentUserData = null;
    }
  } else {
    currentUser = null;
    currentUserData = null;
    console.log('[Auth] Belum login');
  }

  // Tandai ready
  if (!isReady) {
    isReady = true;
    if (readyResolve) readyResolve();
  }

  // Dispatch event
  window.dispatchEvent(new CustomEvent('auth-ready', {
    detail: {
      user: currentUser,
      data: currentUserData
    }
  }));
});

// ===== Expose =====
window.ArcaneAuth = {
  login: login,
  logout: logout,
  getUser: getUser,
  getUserData: getUserData,
  getRole: getRole,
  isLoggedIn: isLoggedIn,
  isOwner: isOwner,
  isOperator: isOperator,
  ready: ready,
  getAuthError: getAuthError
};