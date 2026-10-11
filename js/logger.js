// ===== LOGGER — Sistem Log Tahan Error =====
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
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) logs = parsed;
    }
  } catch (e) {
    logs = [];
  }

  // ===== Simpan =====
  function saveLogs() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
    } catch (e) {
      // Storage penuh — trim lebih agresif
      try {
        logs = logs.slice(-10);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      } catch (e2) {}
    }
  }

  // ===== Format waktu =====
  function now() {
    try {
      return new Date().toLocaleTimeString('id-ID', { hour12: false });
    } catch (e) {
      return new Date().toISOString().slice(11, 19);
    }
  }

  // ===== Serialize args (tahan error) =====
  function serialize(args) {
    try {
      return Array.from(args).map(function(a) {
        if (a === null) return 'null';
        if (a === undefined) return 'undefined';
        if (typeof a === 'string') return a;
        if (typeof a === 'number' || typeof a === 'boolean') return String(a);
        if (a instanceof Error) return a.message || String(a);
        if (typeof a === 'object') {
          try {
            return JSON.stringify(a);
          } catch (e) {
            return '[Object]';
          }
        }
        return String(a);
      }).join(' ');
    } catch (e) {
      return '[Serialization error]';
    }
  }

  // ===== Tambah log =====
  function addLog(type, friendly, technical) {
    try {
      logs.push({
        id: Date.now() + Math.random(),
        type: type,
        time: now(),
        friendly: friendly || '',
        technical: technical || { message: friendly || '' }
      });

      if (logs.length > MAX_LOGS) {
        logs = logs.slice(-MAX_LOGS);
      }
      saveLogs();

      // Trigger render — dibungkus try-catch
      try {
        if (typeof window.renderLogs === 'function') window.renderLogs();
        if (typeof window.updateLogBadge === 'function') window.updateLogBadge();
      } catch (e) {}
    } catch (e) {
      // Jangan sampai logger bikin error
    }
  }

  // ===== Simpan referensi asli =====
  const _log = console.log;
  const _warn = console.warn;
  const _error = console.error;

  // ===== Override console =====
  console.log = function() {
    try {
      const msg = serialize(arguments);
      addLog('success', msg, { message: msg });
    } catch (e) {}
    _log.apply(console, arguments);
  };

  console.warn = function() {
    try {
      const msg = serialize(arguments);
      addLog('warning', msg, { message: msg });
    } catch (e) {}
    _warn.apply(console, arguments);
  };

  console.error = function() {
    try {
      const msg = serialize(arguments);
      addLog('error', 'Ada masalah — klik untuk detail', { message: msg });
    } catch (e) {}
    _error.apply(console, arguments);
  };

  // ===== Global error =====
  window.addEventListener('error', function(e) {
    try {
      const fileName = e.filename ? e.filename.split('/').pop() : 'halaman ini';
      addLog('error', 'Ada masalah di ' + fileName, {
        message: e.message || 'Unknown error',
        file: e.filename || '',
        line: e.lineno || '',
        column: e.colno || '',
        stack: (e.error && e.error.stack) ? e.error.stack : 'N/A'
      });
    } catch (err) {}
  });

  window.addEventListener('unhandledrejection', function(e) {
    try {
      const reason = e.reason || {};
      addLog('error', 'Ada masalah di sistem', {
        message: reason.message || String(reason),
        stack: reason.stack || 'N/A'
      });
    } catch (err) {}
  });

  // ===== API =====
  window.ArcaneLogger = {
    add: addLog,
    getAll: function() { return logs.slice(); },
    clear: function() {
      logs = [];
      saveLogs();
      try {
        if (typeof window.renderLogs === 'function') window.renderLogs();
        if (typeof window.updateLogBadge === 'function') window.updateLogBadge();
      } catch (e) {}
    },
    filter: function(type) {
      if (type === 'all') return logs.slice();
      return logs.filter(function(l) { return l.type === type; });
    },
    countError: function() {
      return logs.filter(function(l) { return l.type === 'error'; }).length;
    }
  };

  _log.call(console, '[Logger] Siap');
})();