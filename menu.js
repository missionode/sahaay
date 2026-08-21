const menuToggles = document.querySelectorAll('.menu-toggle');

function closeMenu(toggle, nav) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.classList.remove('is-open');
  nav.classList.remove('is-open');
}

menuToggles.forEach((toggle) => {
  const nav = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!nav) return;

  toggle.addEventListener('click', () => {
    const nextState = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(nextState));
    toggle.setAttribute('aria-label', nextState ? 'Close menu' : 'Open menu');
    toggle.classList.toggle('is-open', nextState);
    nav.classList.toggle('is-open', nextState);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu(toggle, nav));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu(toggle, nav);
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu(toggle, nav);
  });
});
