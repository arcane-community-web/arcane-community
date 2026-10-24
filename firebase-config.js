// firebase-config.js
// Konfigurasi Firebase ARCANE Community
// API key di client-side memang aman untuk Firebase — keamanan lewat Firestore Rules.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWl0VFu_a7z4kBiR50vsEAoV3oPisfZHA",
  authDomain: "arcane-community.firebaseapp.com",
  projectId: "arcane-community",
  storageBucket: "arcane-community.firebasestorage.app",
  messagingSenderId: "573817025196",
  appId: "1:573817025196:web:4b780a134d2f424b132509"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit };