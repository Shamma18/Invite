/* Small, bounded effects; no animation loop or external libraries. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const opening = document.querySelector('.opening-veil');
  const trigger = opening?.querySelector('.opening-trigger');
  const root = document.documentElement;
  const coveredContent = [...document.querySelectorAll('.site-header,main,footer,.skip-link')];
  let openingStarted = false;
  let openingFinished = false;
  let openingTimer;
  const onOpeningEnd = () => {
    if (openingFinished) return;
    openingFinished = true;
    clearTimeout(openingTimer);
    opening?.remove();
    root.classList.remove('invitation-closed', 'invitation-opening');
    coveredContent.forEach(element => { element.inert = false; });
    if (openingStarted) {
      const title = hero.querySelector('h1');
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
  };
  if (opening && trigger) {
    root.classList.add('invitation-closed');
    coveredContent.forEach(element => { element.inert = true; });
    trigger.focus({ preventScroll: true });
    trigger.addEventListener('click', () => {
      if (openingStarted) return;
      openingStarted = true;
      trigger.disabled = true;
      root.classList.remove('invitation-closed');
      root.classList.add('invitation-opening');
      opening.classList.add('is-opening');
      if (preference.matches) onOpeningEnd();
      else openingTimer = setTimeout(onOpeningEnd, 5500);
    });
    opening.addEventListener('animationend', event => {
      if (event.animationName === 'curtain-right') onOpeningEnd();
    });
  }

  let shower;
  let showerScheduled = false;
  function updateShower() {
    showerScheduled = false;
    if (!shower) return;
    // Clip the fixed shower below the opening section, even during a partial scroll.
    const top = Math.max(0, Math.min(innerHeight, hero.getBoundingClientRect().bottom));
    document.body.style.setProperty('--shower-top', `${top}px`);
    shower.style.setProperty('--shower-distance', `${innerHeight + 60}px`);
    shower.classList.toggle('is-active', scrollY > 1 && top < innerHeight && !document.hidden && !preference.matches);
  }
  function setupShower() {
    if (preference.matches) {
      shower?.remove();
      shower = undefined;
      return;
    }
    if (shower) return;
    shower = document.createElement('div');
    shower.className = 'blessing-shower';
    shower.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 24; i++) {
      const flower = document.createElement('i');
      const variety = ['rose', 'marigold', 'lavender'][i % 3];
      flower.className = `shower-piece shower-flower bloom-${variety}`;
      flower.style.setProperty('--bloom-size', `${28 + i % 4 * 4}px`);
      flower.style.setProperty('--petal-x', `${(i * 37 + 3) % 100}%`);
      flower.style.setProperty('--petal-duration', `${20 + i % 6 * 3}s`);
      flower.style.setProperty('--petal-delay', `${-i * 4.3}s`);
      flower.style.setProperty('--petal-drift', `${i % 2 ? 40 : -40}px`);
      flower.style.setProperty('--petal-spin', `${i % 2 ? 340 : -290}deg`);
      shower.appendChild(flower);
    }
    document.body.appendChild(shower);
    updateShower();
  }
  setupShower();
  window.addEventListener('scroll', () => {
    if (!showerScheduled) {
      showerScheduled = true;
      requestAnimationFrame(updateShower);
    }
  }, { passive: true });
  const orbits = document.createElement('div');
  orbits.className = 'sacred-orbits';
  orbits.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) {
    const light = document.createElement('span');
    light.className = 'orbit-light';
    orbits.appendChild(light);
  }
  hero.querySelector('.hero-art').prepend(orbits);
  if ('ResizeObserver' in window) new ResizeObserver(updateShower).observe(hero);
  window.addEventListener('resize', updateShower, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      hero.classList.toggle('effects-paused', !entries[0].isIntersecting);
    }).observe(hero);
  }
  function pauseWhenHidden() {
    document.body.classList.toggle('motion-paused', document.hidden);
    updateShower();
  }
  document.addEventListener('visibilitychange', pauseWhenHidden);
  pauseWhenHidden();
  preference.addEventListener('change', () => {
    if (preference.matches && openingStarted) onOpeningEnd();
    setupShower();
  });

  document.querySelectorAll('.reveal').forEach(section => {
    section.querySelectorAll('.couple-details article,.date-card,.film-frame,.venue-details,.qr-card,.hosts,.family-section .button').forEach((item, index) => {
      item.classList.add('motion-item');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 220, 660)}ms`);
    });
  });
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', event => {
      if (preference.matches) return;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.setProperty('--ripple-x', `${event.detail ? event.clientX - rect.left : rect.width / 2}px`);
      ripple.style.setProperty('--ripple-y', `${event.detail ? event.clientY - rect.top : rect.height / 2}px`);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      button.appendChild(ripple);
    });
  });
})();
