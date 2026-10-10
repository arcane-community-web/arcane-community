// ===== LOGGER — Sistem Log ARCANE =====
// Tangkap console.log, warn, error + error global
// Dual-layer: ramah awam + detail teknis
// Max 50 log di sessionStorage

(function() {
  'use strict';

  // ===== State =====
  let logs = [];
  const MAX_LOGS = 50;
  const STORAGE_KEY = 'arcane-logs';

  // ===== Load dari sessionStorage =====
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) logs = JSON.parse(saved);
  } catch (e) {
    logs = [];
  }

  // ===== Simpan ke sessionStorage =====
  function saveLogs() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
    } catch (e) {
      // Storage penuh / error — skip
    }
  }

  // ===== Format waktu =====
  function now() {
    return new Date().toLocaleTimeString('id-ID', { hour12: false });
  }

  // ===== Tambah log =====
  function addLog(type, friendly, technical) {
    const log = {
      id: Date.now() + Math.random(),
      type: type,                    // 'success' | 'warning' | 'error'
      time: now(),
      friendly: friendly,
      technical: technical || { message: friendly }
    };

    logs.push(log);
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(-MAX_LOGS);
    }
    saveLogs();

    // Trigger render kalau fungsi ada
    if (typeof window.renderLogs === 'function') {
      window.renderLogs();
    }
    if (typeof window.updateLogBadge === 'function') {
      window.updateLogBadge();
    }
  }

  // ===== Simpan referensi asli =====
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  // ===== Tangkap console.log =====
  console.log = function(...args) {
    const msg = args.map(a => {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch (e) {
        return String(a);
      }
    }).join(' ');

    addLog('success', msg, {
      message: msg,
      stack: new Error().stack
    });

    originalLog.apply(console, args);
  };

  // ===== Tangkap console.warn =====
  console.warn = function(...args) {
    const msg = args.map(a => {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch (e) {
        return String(a);
      }
    }).join(' ');

    addLog('warning', msg, {
      message: msg,
      stack: new Error().stack
    });

    originalWarn.apply(console, args);
  };

  // ===== Tangkap console.error =====
  console.error = function(...args) {
    const msg = args.map(a => {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch (e) {
        return String(a);
      }
    }).join(' ');

    addLog('error', 'Ada masalah — klik untuk detail', {
      message: msg,
      stack: new Error().stack
    });

    originalError.apply(console, args);
  };

  // ===== Tangkap error global =====
  window.addEventListener('error', function(e) {
    const fileName = e.filename ? e.filename.split('/').pop() : 'halaman ini';
    addLog('error', 'Ada masalah di ' + fileName, {
      message: e.message,
      file: e.filename,
      line: e.lineno,
      column: e.colno,
      stack: e.error && e.error.stack ? e.error.stack : 'N/A'
    });
  });

  // ===== Tangkap promise rejection =====
  window.addEventListener('unhandledrejection', function(e) {
    const reason = e.reason || {};
    addLog('error', 'Ada masalah di sistem', {
      message: reason.message || String(reason),
      stack: reason.stack || 'N/A'
    });
  });

  // ===== Expose API =====
  window.ArcaneLogger = {
    add: addLog,
    getAll: function() { return logs.slice(); },
    clear: function() {
      logs = [];
      saveLogs();
      if (typeof window.renderLogs === 'function') window.renderLogs();
      if (typeof window.updateLogBadge === 'function') window.updateLogBadge();
    },
    filter: function(type) {
      if (type === 'all') return logs.slice();
      return logs.filter(function(l) { return l.type === type; });
    },
    countError: function() {
      return logs.filter(function(l) { return l.type === 'error'; }).length;
    }
  };

  // ===== Log awal =====
  originalLog.call(console, '[Logger] Sistem log siap');
})();