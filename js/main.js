// ==========================================================================
// ONG MWASI YA MOTUYA — MAIN JAVASCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initLangSwitcher();
  initCounters();
  initProjectFilters();
  initRDCMap();
  initModals();
  initForms();
});

// --------------------------------------------------------------------------
// 1. MOBILE MENU & ACCORDION DROPDOWN TOGGLE
// --------------------------------------------------------------------------
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  // Toggle main mobile nav drawer
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }

    // When closing the main menu, close any open mobile submenus too
    if (!menu.classList.contains('active')) {
      menu.querySelectorAll('.has-dropdown').forEach(item => item.classList.remove('open'));
    }
  });

  // Active nav link highlight based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  menu.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
        // NOTE: We do NOT automatically add 'open' here so that sub-menu stays INVISIBLE by default on mobile until clicked!
      }
    }
  });

  // Mobile Accordion Toggle for "À Propos" (Has-Dropdown Items)
  const dropdownItems = menu.querySelectorAll('.has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');

    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 868) {
          // Prevent navigating away immediately on mobile click so sub-menu can be toggled
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('open');
        }
      });
    }
  });
}

// --------------------------------------------------------------------------
// 2. LANGUAGE SWITCHER (FR / EN)
// --------------------------------------------------------------------------
const translations = {
  fr: {
    heroTitle: 'Ensemble pour les droits, l\'égalité et l\'autonomisation des femmes et des filles',
    heroQuote: '« NOUS ENVISAGEONS UNE SOCIÉTÉ PLUS ÉQUITABLE ET INCLUSIVE OÙ LES FEMMES ET LES JEUNES FILLES BÉNÉFICIENT DE MÊMES OPPORTUNITÉS QUE LES HOMMES ET JOUISSENT PLEINEMENT DE LEURS DROITS SANS DISCRIMINATION AUCUNE. »',
    btnMission: 'Découvrir notre mission',
    btnDon: 'Soutenir notre action'
  },
  en: {
    heroTitle: 'Together for the rights, equality and empowerment of women and girls',
    heroQuote: '"WE ENVISION A MORE EQUITABLE AND INCLUSIVE SOCIETY WHERE WOMEN AND GIRLS ENJOY THE SAME OPPORTUNITIES AS MEN AND FULLY EXERCISE THEIR RIGHTS WITHOUT ANY DISCRIMINATION."',
    btnMission: 'Discover Our Mission',
    btnDon: 'Support Our Action'
  }
};

function initLangSwitcher() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLang(btn.dataset.lang);
    });
  });
}

function applyLang(lang) {
  const t = translations[lang] || translations.fr;
  const el = (id) => document.getElementById(id);
  if (el('heroTitle')) el('heroTitle').textContent = t.heroTitle;
  if (el('heroQuote')) el('heroQuote').textContent = t.heroQuote;
  if (el('btnMission')) el('btnMission').textContent = t.btnMission;
  if (el('btnDon')) el('btnDon').textContent = t.btnDon;
}

// --------------------------------------------------------------------------
// 3. ANIMATED COUNTERS
// --------------------------------------------------------------------------
function initCounters() {
  const els = document.querySelectorAll('.counter[data-target]');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = parseInt(entry.target.dataset.target);
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        entry.target.textContent = count.toLocaleString('fr-FR') + '+';
        if (count >= target) clearInterval(timer);
      }, 35);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

// --------------------------------------------------------------------------
// 4. PROJECT / PROGRAMME FILTERS
// --------------------------------------------------------------------------
function initProjectFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 5. RDC INTERACTIVE MAP
// --------------------------------------------------------------------------
const rdcData = {
  kinshasa: {
    name: 'Kinshasa — Siège National',
    lead: 'Coordination Nationale & Plaidoyer Institutionnel',
    projects: 8, beneficiaries: '8 450',
    programs: 'Leadership Féminin, Protection VBG, Autonomisation des femmes vivant avec handicap, Plaidoyer institutionnel.'
  },
  nord_kivu: {
    name: 'Nord-Kivu — Goma, Beni, Butembo',
    lead: 'Antenne Nord-Kivu',
    projects: 6, beneficiaries: '5 200',
    programs: 'Prise en charge d\'urgence VBG, Soutien psychosocial, Autonomisation socio-économique, Santé sexuelle et reproductive.'
  },
  sud_kivu: {
    name: 'Sud-Kivu — Bukavu, Uvira',
    lead: 'Antenne Sud-Kivu',
    projects: 5, beneficiaries: '4 100',
    programs: 'Maison de transit VBG, Inclusion des femmes handicapées, Micro-crédits féminins, DSSR.'
  },
  kongo_central: {
    name: 'Kongo Central — Matadi, Boma',
    lead: 'Antenne Kongo Central',
    projects: 4, beneficiaries: '2 800',
    programs: 'Sensibilisation DSSR, Lutte contre les mariages précoces, Égalité de genre communautaire.'
  },
  haut_katanga: {
    name: 'Haut-Katanga — Lubumbashi',
    lead: 'Antenne Katanga',
    projects: 4, beneficiaries: '3 150',
    programs: 'Entrepreneuriat féminin, Alphabétisation fonctionnelle, Protection des droits des jeunes filles.'
  },
  ituri: {
    name: 'Ituri — Bunia',
    lead: 'Antenne Ituri',
    projects: 3, beneficiaries: '1 900',
    programs: 'Prévention des violences sexuelles, Cohésion sociale et leadership des jeunes filles.'
  }
};

function initRDCMap() {
  const provinces = document.querySelectorAll('.rdc-province');
  if (!provinces.length) return;

  provinces.forEach(p => {
    p.addEventListener('click', () => {
      provinces.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      const data = rdcData[p.dataset.prov];
      if (!data) return;

      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('provName', data.name);
      set('provLead', data.lead);
      set('provProjects', data.projects);
      set('provBenef', data.beneficiaries);
      set('provPrograms', data.programs);
    });
  });
}

// --------------------------------------------------------------------------
// 6. MODALS
// --------------------------------------------------------------------------
function initModals() {
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const modal = document.getElementById(btn.dataset.modal);
      if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    });
  });

  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el || el.classList.contains('modal-close')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  });
}

// --------------------------------------------------------------------------
// 7. FORM SUBMISSIONS
// --------------------------------------------------------------------------
function initForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Envoyé avec succès !';
        btn.style.background = '#2d6a4f';
        form.reset();
        setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; btn.style.background = ''; }, 3000);
      }, 1200);
    });
  });
}
