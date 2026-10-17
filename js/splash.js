/* SPLASH SCREEN — ONG MWASI YA MOTUYA (≈ 9 s, ignorable, une seule fois par session) */
(function () {
  var d = document.documentElement;
  var el = document.getElementById('splash');
  var timers = [];
  var finished = false;

  function ready() { d.classList.add('page-ready'); }

  if (!el || !d.classList.contains('splash-on')) { if (el) el.hidden = true; ready(); return; }

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function finish(fast) {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('mym_splash', '1'); } catch (e) {}
    el.classList.add(fast ? 'leaving-fast' : 'leaving');
    ready();
    setTimeout(function () {
      d.classList.remove('splash-on');
      el.hidden = true;
      var h = document.querySelector('.hero-banner h1');
      if (h) { h.setAttribute('tabindex', '-1'); }
    }, fast ? 450 : 750);
  }

  // Scènes
  el.classList.add('s1');                    // 0 s   — éveil de la lumière + anneau
  at(1800, function () { el.classList.add('s2'); });   // 1,8 s — révélation du logo
  at(4300, function () { el.classList.add('s3'); });   // 4,3 s — signature
  at(6600, function () { el.classList.add('s4'); });   // 6,6 s — transition photo
  at(8700, function () { finish(false); });            // 8,7 s — accueil

  var skip = el.querySelector('.splash-skip');
  if (skip) { skip.addEventListener('click', function () { finish(true); }); setTimeout(function () { try { skip.focus({ preventScroll: true }); } catch (e) {} }, 50); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(true); });

  // Si la photo ne charge pas, on ne bloque rien
  var probe = new Image();
  probe.onerror = function () { el.classList.add('no-photo'); };
  probe.src = 'img/7.jpg';
})();
