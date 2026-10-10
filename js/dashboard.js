// ===== DASHBOARD — Logic SPA ARCANE =====
// Sidebar, menu, konten, modal, console

(function() {
  'use strict';

  // ===== State =====
  let currentFilter = 'all';
  const MAX_LOGS = 50;

  // ===== Elemen =====
  const $ = function(sel) { return document.querySelector(sel); };
  const $$ = function(sel) { return document.querySelectorAll(sel); };

  // ===== Sidebar =====
  function openSidebar() {
    console.log('[Dashboard] Sidebar dibuka');
    const sidebar = $('#sidebar');
    const backdrop = $('#sidebarBackdrop');
    const toggle = $('#toggleSidebar');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (toggle) toggle.classList.add('active');
  }

  function closeSidebar() {
    console.log('[Dashboard] Sidebar ditutup');
    const sidebar = $('#sidebar');
    const backdrop = $('#sidebarBackdrop');
    const toggle = $('#toggleSidebar');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
  }

  function toggleSidebar() {
    const sidebar = $('#sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // ===== Ganti halaman =====
  function showPage(pageName) {
    console.log('[Dashboard] Ganti halaman: ' + pageName);
    $$('.page').forEach(function(p) { p.classList.remove('active'); });
    const target = $('[data-page-content="' + pageName + '"]');
    if (target) target.classList.add('active');

    // Re-trigger animasi
    const content = $('#contentArea');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight;
      content.style.animation = '';
    }

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Kalau console, render log
    if (pageName === 'console') {
      setTimeout(function() {
        if (typeof window.renderLogs === 'function') window.renderLogs();
      }, 100);
    }
  }

  // ===== Modal =====
  function openModal(title, contentHtml, onSave) {
    console.log('[Modal] Buka: ' + title);
    const modal = $('#modal');
    const modalTitle = $('#modalTitle');
    const modalBody = $('#modalBody');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = contentHtml;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind tombol simpan
    const saveBtn = $('#modalSave');
    if (saveBtn && typeof onSave === 'function') {
      saveBtn.onclick = function(e) {
        e.preventDefault();
        onSave();
      };
    }
  }

  function closeModal() {
    console.log('[Modal] Tutup');
    const modal = $('#modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== Konfirmasi =====
  function confirmDialog(message, onConfirm) {
    openModal('Konfirmasi', 
      '<p style="margin-bottom:20px;color:var(--text-mute);">' + message + '</p>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
      '  <button type="button" class="modal-btn ghost" id="modalCancel">Batal</button>' +
      '  <button type="button" class="modal-btn danger" id="modalConfirm">Hapus</button>' +
      '</div>',
      null
    );

    const confirmBtn = $('#modalConfirm');
    const cancelBtn = $('#modalCancel');
    if (confirmBtn) {
      confirmBtn.onclick = function() {
        closeModal();
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
    if (cancelBtn) {
      cancelBtn.onclick = closeModal;
    }
  }

  // ===== Console Log — Render =====
  function renderLogs() {
    const list = $('#logList');
    if (!list) return;

    let filtered = window.ArcaneLogger ? window.ArcaneLogger.getAll() : [];
    if (currentFilter !== 'all') {
      filtered = filtered.filter(function(l) { return l.type === currentFilter; });
    }

    if (!filtered.length) {
      list.innerHTML = '<p class="log-empty">Belum ada log.</p>';
      return;
    }

    // Urut dari terbaru
    filtered = filtered.slice().reverse();

    list.innerHTML = filtered.map(function(log) {
      const icon = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : '✅';
      const hint = log.type !== 'success' 
        ? '<span class="log-hint">Klik untuk detail teknis →</span>' 
        : '';
      return '<div class="log-item ' + log.type + '" data-id="' + log.id + '">' +
        '<span class="log-time">' + log.time + '</span>' +
        '<span class="log-icon">' + icon + '</span>' +
        '<span class="log-message">' + escapeHtml(log.friendly) + '</span>' +
        hint +
      '</div>';
    }).join('');

    // Bind klik
    list.querySelectorAll('.log-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const id = parseFloat(item.dataset.id);
        const log = window.ArcaneLogger.getAll().find(function(l) { return l.id === id; });
        if (log) showLogDetail(log);
      });
    });
  }

  // ===== Console Log — Detail =====
  function showLogDetail(log) {
    const list = $('#logList');
    if (!list) return;

    const t = log.technical || {};
    const errType = (t.message && t.message.split(':')[0]) || 
                    (log.type === 'error' ? 'Error' : 'Info');

    list.innerHTML = 
      '<div class="log-detail">' +
        '<span class="error-type">' + escapeHtml(errType) + '</span>\n' +
        escapeHtml(t.message || 'N/A') + '\n\n' +
        '<span class="label">Waktu:</span>     <span class="value">' + log.time + '</span>\n' +
        '<span class="label">Tipe:</span>      <span class="value">' + log.type + '</span>\n' +
        '<span class="label">File:</span>      <span class="value">' + escapeHtml(t.file || 'N/A') + '</span>\n' +
        '<span class="label">Line:</span>      <span class="value">' + (t.line || 'N/A') + '</span>\n' +
        '<span class="label">Function:</span>  <span class="value">' + escapeHtml(t.function || 'N/A') + '</span>\n\n' +
        '<span class="label">Stack Trace:</span>\n' +
        '<span class="value">' + escapeHtml(t.stack || 'N/A') + '</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">' +
        '<button class="modal-btn primary" id="copyErrBtn">📋 Copy Error</button>' +
        '<button class="modal-btn ghost" id="backLogsBtn">← Kembali</button>' +
      '</div>';

    const copyBtn = $('#copyErrBtn');
    const backBtn = $('#backLogsBtn');

    if (copyBtn) {
      copyBtn.onclick = function() {
        const text = '[ARCANE Error]\n' +
          'Waktu: ' + log.time + '\n' +
          'Tipe: ' + log.type + '\n' +
          'Pesan: ' + (t.message || 'N/A') + '\n' +
          'File: ' + (t.file || 'N/A') + '\n' +
          'Line: ' + (t.line || 'N/A') + '\n' +
          'Function: ' + (t.function || 'N/A') + '\n\n' +
          'Stack:\n' + (t.stack || 'N/A');

        copyToClipboard(text);
      };
    }

    if (backBtn) {
      backBtn.onclick = renderLogs;
    }
  }

  // ===== Update badge error =====
  function updateLogBadge() {
    const badge = $('#logBadge');
    if (!badge) return;
    const count = window.ArcaneLogger ? window.ArcaneLogger.countError() : 0;
    if (count > 0) {
      badge.textContent = count;
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  }

  // ===== Helper: Copy ke clipboard =====
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() {
        alert('✅ Error dicopy! Kirim ke developer.');
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      alert('✅ Error dicopy!');
    } catch (e) {
      alert('❌ Gagal copy. Copy manual:\n\n' + text);
    }
    document.body.removeChild(ta);
  }

  // ===== Helper: Escape HTML =====
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ===== Expose API =====
  window.ArcaneDashboard = {
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    toggleSidebar: toggleSidebar,
    showPage: showPage,
    openModal: openModal,
    closeModal: closeModal,
    confirmDialog: confirmDialog,
    renderLogs: renderLogs
  };

  window.renderLogs = renderLogs;
  window.updateLogBadge = updateLogBadge;

  // ===== Bind Event — setelah DOM siap =====
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Dashboard] Init');

    // Toggle sidebar
    const toggleBtn = $('#toggleSidebar');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

    const closeBtn = $('#closeSidebar');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    const backdrop = $('#sidebarBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeSidebar);

    // Menu navigasi
    $$('.sidebar-nav-item[data-page]').forEach(function(item) {
      item.addEventListener('click', function() {
        $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
        item.classList.add('active');
        const pageName = item.dataset.page;
        showPage(pageName);

        // Mobile: tutup sidebar
        if (window.innerWidth <= 768) {
          setTimeout(closeSidebar, 200);
        }
      });
    });

    // Web Utama
    const backBtn = $('#backToWeb');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        console.log('[Dashboard] Balik ke Web Utama');
        $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
        showPage('home');
      });
    }

    // Brand / logo
    const brand = $('#brandHome');
    if (brand) {
      brand.addEventListener('click', function() {
        $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
        showPage('home');
      });
    }

    // Modal close
    const modalClose = $('#modalClose');
    if (modalClose) modalClose.addEventListener('click', closeModal);

    const modal = $('#modal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    }

    // ESC tutup modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Filter log
    $$('.log-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        $$('.log-filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderLogs();
      });
    });

    // Clear log
    const clearBtn = $('#clearLogs');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        confirmDialog('Hapus semua log?', function() {
          if (window.ArcaneLogger) window.ArcaneLogger.clear();
          renderLogs();
          updateLogBadge();
        });
      });
    }

    // Render awal
    renderLogs();
    updateLogBadge();
  });
})();