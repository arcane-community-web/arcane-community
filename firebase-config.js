// firebase-config.js — shared antara ARCANE & SAGARA
// API key publik by design. Keamanan lewat Firestore Rules + Firebase Auth.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getFirestore,
  // === CRUD ===
  collection, addDoc, setDoc, doc, updateDoc, deleteDoc,
  getDocs, getDoc,
  // === Query & realtime ===
  query, orderBy, limit, where, onSnapshot,
  // === Field helpers ===
  serverTimestamp, increment,
  // === Batch write ===
  writeBatch
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// =====================================================
// FIREBASE CONFIG — project: arcane-community
// =====================================================
const firebaseConfig = {
  apiKey: "AIzaSyDWl0VFu_a7z4kBiR50vsEAoV3oPisfZHA",
  authDomain: "arcane-community.firebaseapp.com",
  projectId: "arcane-community",
  storageBucket: "arcane-community.firebasestorage.app",
  messagingSenderId: "573817025196",
  appId: "1:573817025196:web:4b780a134d2f424b132509"
};

// =====================================================
// INIT APP
// =====================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Pastikan sesi login bertahan setelah reload
setPersistence(auth, browserLocalPersistence).catch(() => {});

// =====================================================
// EXPORTS
// =====================================================
//
// ARCANE pakai:
//   auth, signInWithEmailAndPassword, signOut, onAuthStateChanged
//   collection, addDoc, serverTimestamp
//
// SAGARA pakai:
//   auth, db
//   signInWithEmailAndPassword, signOut, onAuthStateChanged
//   collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc
//   onSnapshot, query, orderBy, serverTimestamp, writeBatch
//
// Export di bawah adalah gabungan (superset) — aman untuk keduanya.
// Siapa pun yang butuh `where`, `limit`, `increment` di masa depan
// juga sudah tersedia.
// =====================================================

export {
  // Core
  db, auth,
  // Firestore — CRUD
  collection, addDoc, setDoc, doc, updateDoc, deleteDoc,
  getDocs, getDoc,
  // Firestore — query & realtime
  query, orderBy, limit, where, onSnapshot,
  // Firestore — field helpers
  serverTimestamp, increment,
  // Firestore — batch
  writeBatch,
  // Auth
  signInWithEmailAndPassword, signOut, onAuthStateChanged
};