// ===== Events dari Firestore — Card View =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Konfigurasi kategori
const CATEGORIES = {
  sosial:  { label: 'Sosial',  color: '#8B5CF6', icon: 'users' },
  liburan: { label: 'Liburan', color: '#10B981', icon: 'sun' },
  project: { label: 'Project', color: '#F59E0B', icon: 'briefcase' },
  event:   { label: 'Event',   color: '#EF4444', icon: 'trophy' }
};

// Konfigurasi prioritas
const PRIORITIES = {
  5: { color: '#EF4444' },
  4: { color: '#F97316' },
  3: { color: '#1E9BE0' },
  2: { color: '#10B981' },
  1: { color: '#9CA3AF' }
};

// ===== Load Events =====
async function loadEvents() {
  const list = document.getElementById('eventsList');
  if (!list) return;

  try {
    const snap = await getDocs(collection(db, 'events'));
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Filter: cuma yang akan datang
    const now = new Date();
    items = items.filter(item => {
      const endDate = item.end ? new Date(item.end) : new Date(item.start);
      return endDate >= now;
    });

    // Sort: prioritas (tinggi dulu) → tanggal (dekat dulu)
    items.sort((a, b) => {
      const prioA = Number(a.priority) || 3;
      const prioB = Number(b.priority) || 3;
      if (prioA !== prioB) return prioB - prioA;
      return new Date(a.start) - new Date(b.start);
    });

    // Auto-delete acara lama (background)
    autoDeleteOldEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));

    renderEvents(items);
  } catch (err) {
    console.error('Gagal memuat acara:', err);
    list.innerHTML = renderEmpty('Gagal memuat acara.');
  }
}

// ===== Render Events =====
function renderEvents(items) {
  const list = document.getElementById('eventsList');
  if (!list) return;
  const lang = window.currentLang || 'id';

  if (!items.length) {
    list.innerHTML = renderEmpty();
    observeReveal();
    return;
  }

  list.innerHTML = items.map(item => {
    const cat = CATEGORIES[item.category] || CATEGORIES.event;
    const prio = Number(item.priority) || 3;
    const prioColor = (PRIORITIES[prio] || PRIORITIES[3]).color;

    const title = item['title_' + lang] || item.title_id || '';
    const desc = item['description_' + lang] || item.description_id || '';

    // Format tanggal
    const startDate = new Date(item.start);
    const endDate = item.end ? new Date(item.end) : null;
    const dateStr = formatEventDate(startDate, endDate, lang);

    // Lokasi
    const hasLocation = item.location && item.location.trim();
    const hasMaps = item.maps_url && item.maps_url.trim();

    return `
      <div class="event-card">
        <div class="event-header" style="background: ${cat.color};">
          <h3><i data-lucide="${cat.icon}"></i> ${title}</h3>
        </div>
        <div class="event-body">
          <div class="event-meta">
            <div class="event-meta-row">
              <i data-lucide="calendar"></i>
              <span>${dateStr}</span>
            </div>
            <div class="event-meta-row">
              <i data-lucide="tag"></i>
              <span class="event-category-badge" style="background: ${cat.color};">${cat.label}</span>
            </div>
            <div class="event-location-row">
              <div class="event-location">
                ${hasLocation ? `
                  <i data-lucide="map-pin"></i>
                  ${hasMaps
                    ? `<a href="${item.maps_url}" target="_blank" rel="noopener">${item.location}</a>`
                    : `<span>${item.location}</span>`
                  }
                ` : `
                  <i data-lucide="map-pin"></i>
                  <span style="font-style: italic; opacity: .7;">
                    ${lang === 'id' ? 'Belum ditentukan' : 'TBA'}
                  </span>
                `}
              </div>
              <span class="event-priority" style="color: ${prioColor};">
                <i data-lucide="alert-circle"></i>
                ${lang === 'id' ? 'Prioritas' : 'Priority'}: ${prio}
              </span>
            </div>
          </div>
          ${desc ? `<p class="event-desc">${desc}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  observeReveal();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ===== Format Tanggal =====
function formatEventDate(start, end, lang) {
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false };

  const startDateStr = start.toLocaleDateString(locale, opts);
  const startTimeStr = start.toLocaleTimeString(locale, timeOpts);

  if (!end) {
    return `<strong>${startDateStr}</strong>, ${startTimeStr}`;
  }

  const endDateStr = end.toLocaleDateString(locale, opts);
  const endTimeStr = end.toLocaleTimeString(locale, timeOpts);

  if (startDateStr === endDateStr) {
    return `<strong>${startDateStr}</strong>, ${startTimeStr} - ${endTimeStr}`;
  }

  return `<strong>${startDateStr} - ${endDateStr}</strong>, ${startTimeStr} - ${endTimeStr}`;
}

// ===== Empty State =====
function renderEmpty(msg) {
  const lang = window.currentLang || 'id';
  const defaultMsg = lang === 'id'
    ? 'Acara akan muncul di sini kalau sudah ditambahkan.'
    : 'Events will appear here once added.';
  const title = lang === 'id' ? 'Belum Ada Acara' : 'No Events Yet';

  return `
    <div class="events-empty">
      <i data-lucide="calendar-x"></i>
      <h3>${title}</h3>
      <p>${msg || defaultMsg}</p>
    </div>
  `;
}

// ===== Auto-Delete Acara Lewat =====
async function autoDeleteOldEvents(items) {
  const now = new Date();
  const old = items.filter(item => {
    const endDate = item.end ? new Date(item.end) : new Date(item.start);
    return endDate < now;
  });

  for (const item of old) {
    try {
      await deleteDoc(doc(db, 'events', item.id));
      console.log('[Auto-delete] Hapus acara lama:', item.title_id || item.id);
    } catch (e) {
      console.warn('[Auto-delete] Gagal hapus:', e.message);
    }
  }
}

// ===== Trigger =====
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

document.getElementById('langToggle')?.addEventListener('click', () => {
  setTimeout(loadEvents, 50);
});