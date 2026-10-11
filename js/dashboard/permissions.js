// ===== PERMISSIONS — Peta Menu per Role =====

export const PERMISSIONS = {
  owner: [
    'statistik',
    'berita',
    'acara',
    'galeri',
    'konten',
    'kategori',
    'pengguna',
    'pengaturan',
    'aktivitas',
    'console'
  ],
  operator: [
    'statistik',
    'berita',
    'acara',
    'galeri'
  ],
  member: []
};

// ===== Menu metadata =====
export const MENU = {
  statistik:  { icon: 'bar-chart-3',     i18n: 'dash.statistik'  },
  berita:     { icon: 'newspaper',       i18n: 'dash.berita'     },
  acara:      { icon: 'calendar-days',   i18n: 'dash.acara'      },
  galeri:     { icon: 'image',           i18n: 'dash.galeri'     },
  konten:     { icon: 'file-text',       i18n: 'dash.konten'     },
  kategori:   { icon: 'tags',            i18n: 'dash.kategori'   },
  pengguna:   { icon: 'users',           i18n: 'dash.pengguna'   },
  pengaturan: { icon: 'settings',        i18n: 'dash.pengaturan' },
  aktivitas:  { icon: 'activity',        i18n: 'dash.aktivitas'  },
  console:    { icon: 'terminal',        i18n: 'dash.console'    }
};

// ===== Cek akses =====
export function canAccess(role, page) {
  if (!role) return false;
  const allowed = PERMISSIONS[role] || [];
  return allowed.includes(page);
}

// ===== Get menu untuk role =====
export function getMenuForRole(role) {
  const allowed = PERMISSIONS[role] || [];
  return allowed.map(function(page) {
    return {
      page: page,
      icon: MENU[page] ? MENU[page].icon : 'circle',
      i18n: MENU[page] ? MENU[page].i18n : page
    };
  });
}

// ===== Get semua menu (buat debug) =====
export function getAllPages() {
  return Object.keys(MENU);
}

// ===== Expose =====
window.ArcanePermissions = {
  PERMISSIONS: PERMISSIONS,
  MENU: MENU,
  canAccess: canAccess,
  getMenuForRole: getMenuForRole,
  getAllPages: getAllPages
};