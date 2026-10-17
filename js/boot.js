/* BOOT — chargé dans <head>. Décide si le splash est joué et active le mode motion.
   Sécurités : ne bloque jamais le site (délais de secours, reduced-motion, sessionStorage). */
(function () {
  var d = document.documentElement;
  d.classList.add('js-motion');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) d.classList.add('reduced-motion');
  var seen = false;
  try { seen = sessionStorage.getItem('mym_splash') === '1'; } catch (e) {}
  var wantsSplash = d.hasAttribute('data-has-splash') && !seen && !reduce;
  if (wantsSplash) d.classList.add('splash-on');
  // Filet de sécurité absolu : quoi qu'il arrive, le site est libéré après 13 s
  setTimeout(function () {
    d.classList.remove('splash-on');
    d.classList.add('page-ready');
  }, 13000);
})();
