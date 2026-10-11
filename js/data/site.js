// ===== SITE — Teks & Pengaturan Situs =====

import { db } from '../firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logActivity } from './activity.js';

const COLLECTION = 'site';

// ===== Default values =====
export const DEFAULTS = {
  hero: {
    badge: { id: 'Komunitas Informasi & Digital', en: 'Info & Digital Community' },
    title: { id: 'Informasi. Kreativitas. Komunitas.', en: 'Information. Creativity. Community.' },
    subtitle: {
      id: 'ARCANE Community berbagi informasi sekolah dan menyediakan jasa digital untuk anggota maupun publik.',
      en: 'ARCANE Community shares school information and provides digital services for members and the public.'
    },
    cta: { id: 'Lihat Berita', en: 'View News' }
  },
  sections: {
    news: {
      title: { id: 'Berita & Informasi Terbaru', en: 'Latest News & Info' },
      desc: { id: 'Update seputar kegiatan, pengumuman, dan informasi sekolah.', en: 'Updates on activities, announcements, and school information.' },
      visible: true
    },
    events: {
      title: { id: 'Acara Mendatang', en: 'Upcoming Events' },
      desc: { id: 'Jadwal kegiatan dan acara ARCANE Community.', en: 'Schedule of ARCANE Community events and activities.' },
      visible: true
    },
    gallery: {
      title: { id: 'Momen & Karya', en: 'Moments & Works' },
      desc: { id: 'Dokumentasi kegiatan dan hasil karya ARCANE Community.', en: 'Documentation of ARCANE Community activities and works.' },
      visible: true
    }
  },
  footer: {
    tagline: { id: 'Informasi. Kreativitas. Komunitas.', en: 'Information. Creativity. Community.' },
    rights: { id: 'Hak cipta dilindungi.', en: 'All rights reserved.' }
  },
  welcome: {
    title: { id: 'Welcome', en: 'Welcome' },
    subtitle: { id: 'Selamat datang di ARCANE Community', en: 'Welcome to ARCANE Community' }
  },
  settings: {
    siteName: 'ARCANE Community',
    tagline: 'Informasi. Kreativitas. Komunitas.',
    version: 'v1.0'
  }
};

// ===== Get dokumen =====
export async function getDocSite(docId) {
  try {
    const snap = await getDoc(doc(db, COLLECTION, docId));
    if (!snap.exists()) {
      return DEFAULTS[docId] || null;
    }
    return { ...(DEFAULTS[docId] || {}), ...snap.data() };
  } catch (e) {
    console.error('[Site] Get gagal:', e);
    return DEFAULTS[docId] || null;
  }
}

// ===== Set dokumen =====
export async function setDocSite(docId, data) {
  try {
    await setDoc(doc(db, COLLECTION, docId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });

    await logActivity({
      action: 'update',
      collection: COLLECTION,
      docId: docId,
      docTitle: docId
    });

    return true;
  } catch (e) {
    console.error('[Site] Set gagal:', e);
    throw e;
  }
}

// ===== Get semua =====
export async function getAll() {
  try {
    const [hero, sections, footer, welcome, settings] = await Promise.all([
      getDocSite('hero'),
      getDocSite('sections'),
      getDocSite('footer'),
      getDocSite('welcome'),
      getDocSite('settings')
    ]);

    return { hero, sections, footer, welcome, settings };
  } catch (e) {
    console.error('[Site] GetAll gagal:', e);
    return DEFAULTS;
  }
}