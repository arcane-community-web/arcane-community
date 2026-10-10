// ===== LOGGER — Sistem Log ARCANE =====
// Tangkap console.log, warn, error + error global
// Max 50 log di sessionStorage

(function() {
  'use strict';

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

  // ===== Simpan =====
  function saveLogs() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
    } catch (e) {}
  }

  // ===== Format waktu =====
  function now() {
    return new Date().toLocaleTimeString('id-ID', { hour12: false });
  }

  // ===== Serialize args =====
  function serialize(args) {
    return args.map(function(a) {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch (e) {
        return String(a);
      }
    }).join(' ');
  }

  // ===== Tambah log =====
  function addLog(type, friendly, technical) {
    logs.push({
      id: Date.now() + Math.random(),
      type: type,
      time: now(),
      friendly: friendly,
      technical: technical || { message: friendly }
    });

    if (logs.length > MAX_LOGS) {
      logs = logs.slice(-MAX_LOGS);
    }
    saveLogs();

    if (typeof window.renderLogs === 'function') window.renderLogs();
    if (typeof window.updateLogBadge === 'function') window.updateLogBadge();
  }

  // ===== Simpan referensi asli =====
  const _log = console.log;
  const _warn = console.warn;
  const _error = console.error;

  // ===== Override console =====
  console.log = function() {
    const msg = serialize(arguments);
    addLog('success', msg, { message: msg, stack: new Error().stack });
    _log.apply(console, arguments);
  };

  console.warn = function() {
    const msg = serialize(arguments);
    addLog('warning', msg, { message: msg, stack: new Error().stack });
    _warn.apply(console, arguments);
  };

  console.error = function() {
    const msg = serialize(arguments);
    addLog('error', 'Ada masalah — klik untuk detail', { message: msg, stack: new Error().stack });
    _error.apply(console, arguments);
  };

  // ===== Global error =====
  window.addEventListener('error', function(e) {
    addLog('error', 'Ada masalah di ' + (e.filename ? e.filename.split('/').pop() : 'halaman ini'), {
      message: e.message,
      file: e.filename,
      line: e.lineno,
      column: e.colno,
      stack: e.error && e.error.stack ? e.error.stack : 'N/A'
    });
  });

  window.addEventListener('unhandledrejection', function(e) {
    const reason = e.reason || {};
    addLog('error', 'Ada masalah di sistem', {
      message: reason.message || String(reason),
      stack: reason.stack || 'N/A'
    });
  });

  // ===== API =====
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
      return type === 'all' ? logs.slice() : logs.filter(function(l) { return l.type === type; });
    },
    countError: function() {
      return logs.filter(function(l) { return l.type === 'error'; }).length;
    }
  };

  _log.call(console, '[Logger] Siap');
})();