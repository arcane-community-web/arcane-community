// firebase-config.js — shared antara ARCANE & SAGARA
// API key publik by design. Keamanan lewat Firestore Rules + Firebase Auth.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getFirestore,
  collection, addDoc, setDoc, doc, updateDoc, deleteDoc,
  getDocs, getDoc,
  query, orderBy, limit, onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWl0VFu_a7z4kBiR50vsEAoV3oPisfZHA",
  authDomain: "arcane-community.firebaseapp.com",
  projectId: "arcane-community",
  storageBucket: "arcane-community.firebasestorage.app",
  messagingSenderId: "573817025196",
  appId: "1:573817025196:web:4b780a134d2f424b132509"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Pastikan sesi login bertahan setelah reload (default, tapi eksplisit lebih aman)
setPersistence(auth, browserLocalPersistence).catch(() => {});

export {
  db, auth,
  // Firestore — CRUD
  collection, addDoc, setDoc, doc, updateDoc, deleteDoc,
  getDocs, getDoc,
  // Firestore — query & realtime
  query, orderBy, limit, onSnapshot,
  serverTimestamp,
  // Auth
  signInWithEmailAndPassword, signOut, onAuthStateChanged
};