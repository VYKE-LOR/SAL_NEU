(() => {
  const nav = document.querySelector('.sal-nav');
  const toggle = document.querySelector('.sal-menu-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  const hero = document.querySelector('[data-parallax]');
  const art = document.querySelector('.sal-hero-art');
  if (hero && art && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      art.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();
