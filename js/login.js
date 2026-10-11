// ===== LOGIN — Entry Point Halaman Login =====

import './logger.js';
import './theme.js';
import './i18n.js';

import { login, getAuthError, getUser, ready } from './auth.js';

let isLoggingIn = false;

// ===== Init =====
async function init() {
  console.log('[Login] Init');

  // Tunggu auth siap
  await ready();

  // Kalau udah login — redirect
  const user = getUser();
  if (user) {
    console.log('[Login] User udah login — redirect');
    window.location.href = 'index.html';
    return;
  }

  // Bind form
  bindForm();
  bindTogglePassword();

  // Lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();

  console.log('[Login] Siap');
}

// ===== Bind form =====
function bindForm() {
  const form = document.getElementById('loginForm');
  if (!form) {
    console.error('[Login] Form tidak ditemukan!');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();  // ← cegah reload

    if (isLoggingIn) return;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('loginBtnText');

    errorEl.textContent = '';
    btn.disabled = true;
    btnText.textContent = window.ArcaneI18n ? window.ArcaneI18n.t('login.loading') : 'Memproses...';
    isLoggingIn = true;

    try {
      const user = await login(email, password);
      console.log('[Login] Sukses — ' + user.username);
      window.location.href = 'index.html';
    } catch (err) {
      console.error('[Login] Gagal:', err);
      isLoggingIn = false;

      let msg = 'Terjadi kesalahan. Coba lagi.';
      if (err && err.message) msg = err.message;

      errorEl.textContent = msg;
      btn.disabled = false;
      btnText.textContent = window.ArcaneI18n ? window.ArcaneI18n.t('login.btn') : 'Masuk';
    }
  });

  console.log('[Login] Form ter-bind');
}

// ===== Toggle password =====
function bindTogglePassword() {
  const toggle = document.getElementById('togglePass');
  const input = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  if (!toggle || !input) return;

  toggle.addEventListener('click', function () {
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';

    if (icon) {
      icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });
}

// ===== Jalankan =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}