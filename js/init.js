// ===== INIT — ARCANE =====
// Init semua — dipanggil terakhir

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('[ARCANE] Halaman dimuat');

    // 1. Loading screen
    if (window.ArcaneLoading) {
      window.ArcaneLoading.start();
    }

    // 2. Render data dummy
    if (window.ArcaneRenderPublic) {
      window.ArcaneRenderPublic.renderAll();
    }
    if (window.ArcaneRenderAdmin) {
      window.ArcaneRenderAdmin.renderAll();
    }

    // 3. Year di footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 4. Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 5. Banner welcome (dibikin kalau nggak ada)
    if (!document.getElementById('welcomeBanner')) {
      const wb = document.createElement('div');
      wb.className = 'welcome-banner';
      wb.id = 'welcomeBanner';
      wb.innerHTML = 
        '<div class="welcome-inner">' +
          '<span class="welcome-icon">✨</span>' +
          '<div class="welcome-text">' +
            '<h1 class="welcome-title">Welcome, <span id="welcomeUsername">User</span></h1>' +
            '<span class="welcome-role" id="welcomeRole" style="display:none;">(Role)</span>' +
            '<p class="welcome-sub">Selamat datang di ARCANE Community</p>' +
          '</div>' +
        '</div>';
      document.body.insertBefore(wb, document.body.firstChild);
    }

    // 6. Banner welcome function (expose)
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

    // 7. Selesai
    console.log('[ARCANE] Init selesai');
  });
})();