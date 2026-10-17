/* MOTION — apparitions au défilement (IntersectionObserver), sans modifier le HTML.
   Les éléments sont marqués par JS ; si quelque chose échoue, tout reste visible. */
(function () {
  var d = document.documentElement;
  var reduce = d.classList.contains('reduced-motion');

  function ready() { d.classList.add('page-ready'); }
  // Pages sans splash : l'animation d'entrée démarre tout de suite
  if (!d.classList.contains('splash-on')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Index d'entrée pour la navigation
    document.querySelectorAll('.site-header .brand-logo, .site-header .nav-item, .site-header .lang-switcher').forEach(function (el, i) { el.style.setProperty('--i', i); });

    if (reduce || !('IntersectionObserver' in window)) { d.classList.remove('js-motion'); return; }

    var groups = [
      // [sélecteur de l'élément, classe de direction, pas de décalage]
      ['.section-header', '', 0],
      ['.about-img-wrap', 'reveal-left', 0],
      ['.about-grid > div:not(.about-img-wrap)', 'reveal-right', 0],
      ['.feature-item', '', .08],
      ['.card-item', '', .08],
      ['.prog-card, .news-card, .resource-card, .team-card', '', .09],
      ['.impact-stat', 'reveal-zoom', .08],
      ['.vbg-card', 'reveal-left', 0],
      ['.vbg-img', 'reveal-right', 0],
      ['.partner-card-logo', 'reveal-zoom', .04],
      ['.filters-bar, .partners-ticker, .partners-track', '', 0],
      ['.cta-band .container > *', '', .1],
      ['.site-footer .footer-grid > *', '', .08],
      ['.section-padding .container > h2, .section-padding .container > p', '', 0]
    ];

    var seen = new Set();
    var targets = [];
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        if (seen.has(el) || el.closest('.hero-banner') || el.closest('.page-banner') || el.closest('.site-header')) return;
        // Ne jamais masquer un élément contenant un formulaire/modale ouvert
        seen.add(el);
        el.classList.add('reveal');
        if (g[1]) el.classList.add(g[1]);
        // décalage séquencé par rang parmi ses frères (max 5)
        var rank = Array.prototype.indexOf.call(el.parentNode.children, el) % 5;
        if (g[2]) el.style.setProperty('--d', (rank * g[2]).toFixed(2) + 's');
        targets.push(el);
      });
    });
    // Images de cartes : rideau
    document.querySelectorAll('.prog-card-img').forEach(function (el) {
      el.classList.add('reveal-img');
      el.style.setProperty('--d', '.15s');
      targets.push(el);
    });

    function show(el) {
      el.classList.add('is-visible');
      // Après l'animation, on retire les classes pour rendre la main aux :hover existants
      setTimeout(function () { el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-zoom', 'reveal-img', 'is-visible'); el.style.removeProperty('--d'); }, 1800);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });

    // Filet de sécurité : tout est visible après 6 s quoi qu'il arrive
    setTimeout(function () { targets.forEach(function (el) { show(el); }); }, 6000);
  });
})();
