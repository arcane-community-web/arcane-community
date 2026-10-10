// ===== INIT — ARCANE =====
// Init semua — dipanggil setelah loading selesai

(function() {
  'use strict';

  function initAll() {
    console.log('[ARCANE] Mulai init setelah loading');

    // 1. Render data dummy
    if (window.ArcaneRenderPublic) {
      window.ArcaneRenderPublic.renderAll();
    }
    if (window.ArcaneRenderAdmin) {
      window.ArcaneRenderAdmin.renderAll();
    }

    // 2. Year di footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 3. Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 4. Welcome banner function
    window.showWelcomeBanner = function(username, roleDisplay, role) {
      const banner = document.getElementById('welcomeBanner');
      if (!banner) return;

      if (sessionStorage.getItem('arcane-welcome-shown') === 'yes') {
        banner.remove();
        return;
      }

      const usernameEl = document.getElementById('welcomeUsername');
      const roleEl = document.getElementById('welcomeRole');

      if (usernameEl) usernameEl.textContent = username;
      if (role === 'owner') {
        if (roleEl) roleEl.style.display = 'none';
      } else {
        if (roleEl) {
          roleEl.textContent = '(' + roleDisplay + ')';
          roleEl.style.display = 'inline-block';
        }
      }

      sessionStorage.setItem('arcane-welcome-shown', 'yes');

      setTimeout(function() { banner.classList.add('visible'); }, 100);
      setTimeout(function() {
        banner.classList.remove('visible');
        setTimeout(function() { banner.remove(); }, 600);
      }, 3000);
    };

    // 5. Trigger event — arcane-ready
    window.dispatchEvent(new Event('arcane-ready'));
    console.log('[ARCANE] Event arcane-ready dipicu');

    console.log('[ARCANE] Init selesai');
  }

  // ===== Tunggu loading selesai =====
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[ARCANE] Halaman dimuat');

    if (window.ArcaneLoading) {
      window.ArcaneLoading.start(initAll);
    } else {
      initAll();
    }
  });
})();