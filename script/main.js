(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const menuButton = $('[data-menu-button]');
  const nav = $('[data-nav]');

  function setMenu(open) {
    if (!nav) return;
    if (open) nav.setAttribute('data-open', 'true');
    else nav.removeAttribute('data-open');

    if (menuButton) {
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      setMenu(!open);
    });

    // Close menu on link click (mobile)
    $$('[data-navlink]', nav).forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!nav || !menuButton) return;
      const open = nav.getAttribute('data-open') === 'true';
      if (!open) return;
      if (nav.contains(target) || menuButton.contains(target)) return;
      setMenu(false);
    });
  }

  // Smooth scroll + active link (basic)
  const sectionIds = ['about', 'projects', 'skills', 'contact'];
  const navLinks = $$('[data-navlink]');

  const observers = [];
  const supportsIO = typeof IntersectionObserver !== 'undefined';

  function activate(id) {
    navLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const linkTarget = href.startsWith('#') ? href.slice(1) : null;
      a.dataset.active = linkTarget === id ? 'true' : 'false';
    });
  }

  // Ensure scrolling works even if browser default changes
  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenu(false);
      activate(id);
      history.replaceState(null, '', href);
    });
  });

  if (supportsIO) {
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) activate(id);
        },
        { root: null, threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
  } else {
    // Fallback: activate on scroll
    window.addEventListener('scroll', () => {
      const fromTop = window.scrollY + 120;
      let active = 'about';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= fromTop) active = id;
      }
      activate(active);
    });
  }



  // Initial active based on hash
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    const id = hash.slice(1);
    if (sectionIds.includes(id)) {
      activate(id);
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  } else {
    activate('about');
  }
})();

