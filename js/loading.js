// ===== LOADING SCREEN — ARCANE =====
// Terminal-style loading screen
// Muncul sekali per sesi (sessionStorage)

(function() {
  'use strict';

  const loadingLines = [
    '<!DOCTYPE html>',
    '<html lang="id">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>ARCANE Community</title>',
    '  <link rel="stylesheet" href="css/style.css">',
    '  <script src="js/firebase-config.js"><\/script>',
    '</head>',
    '<body>',
    '  <div id="app"></div>',
    '  <script>app.mount("#app")<\/script>',
    '</body>',
    '</html>'
  ];

  let currentLineIndex = 0;

  function typeLine(text, callback) {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) { callback(); return; }

    const oldLines = terminalBody.querySelectorAll('.terminal-line.done');
    oldLines.forEach(function(l) { l.remove(); });

    const line = document.createElement('div');
    line.className = 'terminal-line typing';
    line.innerHTML = '<span class="prompt">&gt;</span><span class="text"></span>';
    terminalBody.appendChild(line);

    const textEl = line.querySelector('.text');
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        textEl.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 22);
      } else {
        line.classList.remove('typing');
        line.classList.add('done');
        setTimeout(callback, 200);
      }
    }
    typeChar();
  }

  function runLoading(onDone) {
    if (currentLineIndex >= loadingLines.length) {
      setTimeout(function() {
        const ls = document.getElementById('loadingScreen');
        const web = document.getElementById('web');
        if (ls) ls.classList.add('hidden');
        if (web) web.classList.add('visible');
        setTimeout(function() { if (ls) ls.remove(); }, 600);
        console.log('[Loading] Selesai');

        if (typeof onDone === 'function') {
          setTimeout(onDone, 100);
        }
      }, 300);
      return;
    }

    typeLine(loadingLines[currentLineIndex], function() {
      currentLineIndex++;
      runLoading(onDone);
    });
  }

  function start(onDone) {
    const ls = document.getElementById('loadingScreen');
    const web = document.getElementById('web');

    if (sessionStorage.getItem('arcane-loading-shown') === 'yes') {
      console.log('[Loading] Skip — udah muncul di sesi ini');
      if (ls) ls.remove();
      if (web) web.classList.add('visible');
      if (typeof onDone === 'function') onDone();
      return;
    }

    console.log('[Loading] Mulai');
    sessionStorage.setItem('arcane-loading-shown', 'yes');
    runLoading(onDone);
  }

  window.ArcaneLoading = { start: start };
})();