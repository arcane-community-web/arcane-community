// ===== DASHBOARD — Logic SPA ARCANE =====
// Sidebar, menu, konten, modal, console

(function() {
  'use strict';

  let currentFilter = 'all';

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

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

  // ===== Ganti Halaman =====
  function showPage(pageName) {
    console.log('[Dashboard] Ganti halaman: ' + pageName);

    $$('.page').forEach(function(p) { p.classList.remove('active'); });
    const target = $('[data-page-content="' + pageName + '"]');
    if (target) target.classList.add('active');

    const content = $('#contentArea');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight;
      content.style.animation = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

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
    const modalFooter = $('#modalFooter');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    if (modalFooter) modalFooter.style.display = 'flex';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

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
    const modal = $('#modal');
    const modalTitle = $('#modalTitle');
    const modalBody = $('#modalBody');
    const modalFooter = $('#modalFooter');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Konfirmasi';
    if (modalBody) modalBody.innerHTML = '<p style="color:var(--text-mute);">' + message + '</p>';

    if (modalFooter) {
      modalFooter.innerHTML = 
        '<button type="button" class="modal-btn ghost" id="cdCancel">Batal</button>' +
        '<button type="button" class="modal-btn danger" id="cdConfirm">Hapus</button>';
      modalFooter.style.display = 'flex';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const confirmBtn = $('#cdConfirm');
    const cancelBtn = $('#cdCancel');
    if (confirmBtn) {
      confirmBtn.onclick = function() {
        closeModal();
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
    if (cancelBtn) cancelBtn.onclick = closeModal;
  }

  // ===== Console Log =====
  function renderLogs() {
    const list = $('#logList');
    if (!list) return;

    let filtered = window.ArcaneLogger ? window.ArcaneLogger.getAll() : [];
    if (currentFilter !== 'all') {
      filtered = filtered.filter(function(l) { return l.type === currentFilter; });
    }

    if (!filtered.length) {
      list.innerHTML = '<p class="log-empty">' + 
        (window.ArcaneLang ? window.ArcaneLang.t('console.empty') : 'Belum ada log.') + '</p>';
      return;
    }

    filtered = filtered.slice().reverse();

    list.innerHTML = filtered.map(function(log) {
      const icon = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : '✅';
      const hint = log.type !== 'success'
        ? '<span class="log-hint">' + 
          (window.ArcaneLang ? window.ArcaneLang.t('console.detail') : 'Klik untuk detail teknis →') + 
          '</span>'
        : '';
      return '<div class="log-item ' + log.type + '" data-id="' + log.id + '">' +
        '<span class="log-time">' + log.time + '</span>' +
        '<span class="log-icon">' + icon + '</span>' +
        '<span class="log-message">' + escapeHtml(log.friendly) + '</span>' +
        hint +
      '</div>';
    }).join('');

    list.querySelectorAll('.log-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const id = parseFloat(item.dataset.id);
        const log = window.ArcaneLogger.getAll().find(function(l) { return l.id === id; });
        if (log) showLogDetail(log);
      });
    });
  }

  function showLogDetail(log) {
    const list = $('#logList');
    if (!list) return;

    const t = log.technical || {};
    const errType = (t.message && t.message.split(':')[0]) || 
                    (log.type === 'error' ? 'Error' : 'Info');
    const copyLabel = window.ArcaneLang ? window.ArcaneLang.t('console.copy') : '📋 Copy Error';
    const backLabel = window.ArcaneLang ? window.ArcaneLang.t('console.back') : '← Kembali';

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
        '<button class="modal-btn primary" id="copyErrBtn">' + copyLabel + '</button>' +
        '<button class="modal-btn ghost" id="backLogsBtn">' + backLabel + '</button>' +
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
    if (backBtn) backBtn.onclick = renderLogs;
  }

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

  // ===== Helper =====
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() {
        alert('✅ Error dicopy! Kirim ke developer.');
      }).catch(function() { fallbackCopy(text); });
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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ===== Expose =====
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

  // ===== Bind Event — dengan try-catch =====
  function bindEvents() {
    console.log('[Dashboard] Bind events');

    try {
      // Toggle sidebar
      const toggleBtn = $('#toggleSidebar');
      if (toggleBtn) {
        toggleBtn.onclick = function(e) {
          e.preventDefault();
          toggleSidebar();
        };
        console.log('[Dashboard] toggleSidebar bound');
      } else {
        console.warn('[Dashboard] toggleSidebar NOT FOUND');
      }

      // Close sidebar
      const closeBtn = $('#closeSidebar');
      if (closeBtn) {
        closeBtn.onclick = function(e) {
          e.preventDefault();
          closeSidebar();
        };
      }

      // Backdrop
      const backdrop = $('#sidebarBackdrop');
      if (backdrop) {
        backdrop.onclick = function(e) {
          e.preventDefault();
          closeSidebar();
        };
      }

      // Menu navigasi
      $$('.sidebar-nav-item[data-page]').forEach(function(item) {
        item.onclick = function(e) {
          e.preventDefault();
          $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
          item.classList.add('active');
          showPage(item.dataset.page);
          if (window.innerWidth <= 768) {
            setTimeout(closeSidebar, 200);
          }
        };
      });

      // Data-goto
      $$('[data-goto]').forEach(function(btn) {
        btn.onclick = function(e) {
          e.preventDefault();
          const target = btn.dataset.goto;
          $$('.sidebar-nav-item').forEach(function(i) {
            i.classList.remove('active');
            if (i.dataset.page === target) i.classList.add('active');
          });
          showPage(target);
        };
      });

      // Web Utama
      const backBtn = $('#backToWeb');
      if (backBtn) {
        backBtn.onclick = function(e) {
          e.preventDefault();
          console.log('[Dashboard] Balik ke Web Utama');
          $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
          showPage('home');
        };
      }

      // Brand
      const brand = $('#brandHome');
      if (brand) {
        brand.onclick = function(e) {
          e.preventDefault();
          $$('.sidebar-nav-item').forEach(function(i) { i.classList.remove('active'); });
          showPage('home');
        };
      }

      // Modal close
      const modalClose = $('#modalClose');
      if (modalClose) modalClose.onclick = closeModal;

      const modalCancel = $('#modalCancel');
      if (modalCancel) modalCancel.onclick = closeModal;

      // Modal save
      const modalSave = $('#modalSave');
      if (modalSave) {
        modalSave.onclick = function() {
          const form = document.querySelector('#modalBody form');
          if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        };
      }

      // Modal backdrop
      const modal = $('#modal');
      if (modal) {
        modal.onclick = function(e) {
          if (e.target === modal) closeModal();
        };
      }

      // ESC
      document.onkeydown = function(e) {
        if (e.key === 'Escape') {
          closeModal();
          const box = $('#lightbox');
          if (box && box.classList.contains('open')) {
            box.classList.remove('open');
            document.body.style.overflow = '';
          }
        }
      };

      // Filter log
      $$('.log-filter-btn').forEach(function(btn) {
        btn.onclick = function() {
          $$('.log-filter-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentFilter = btn.dataset.filter;
          renderLogs();
        };
      });

      // Clear log
      const clearBtn = $('#clearLogs');
      if (clearBtn) {
        clearBtn.onclick = function() {
          confirmDialog('Hapus semua log?', function() {
            if (window.ArcaneLogger) window.ArcaneLogger.clear();
            renderLogs();
            updateLogBadge();
          });
        };
      }

      // Lightbox close
      const lbClose = $('#lightboxClose');
      if (lbClose) {
        lbClose.onclick = function() {
          const box = $('#lightbox');
          if (box) box.classList.remove('open');
          document.body.style.overflow = '';
        };
      }

      const lb = $('#lightbox');
      if (lb) {
        lb.onclick = function(e) {
          if (e.target === lb) {
            lb.classList.remove('open');
            document.body.style.overflow = '';
          }
        };
      }

      // Render log awal
      renderLogs();
      updateLogBadge();

      console.log('[Dashboard] Semua event ter-bind');
    } catch (e) {
      console.error('[Dashboard] Error bind:', e);
    }
  }

  // ===== Init — DOMContentLoaded =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    // DOM udah siap — langsung bind
    bindEvents();
  }
})();