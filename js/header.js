/* HEADER : transparent → couleur primaire au défilement + barre de progression */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var menu = document.getElementById('navMenu');

  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  header.appendChild(bar);

  var ticking = false;
  function update() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 30);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  // Menu mobile ouvert => header plein (lisibilité)
  if (menu && window.MutationObserver) {
    new MutationObserver(function () {
      header.classList.toggle('menu-open', menu.classList.contains('active'));
    }).observe(menu, { attributes: true, attributeFilter: ['class'] });
  }
  // Échap ferme le menu mobile
  document.addEventListener('keydown', function (e) {
    var t = document.getElementById('mobileToggle');
    if (e.key === 'Escape' && menu && menu.classList.contains('active') && t) { t.click(); t.focus(); }
  });
})();
