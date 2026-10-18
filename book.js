/* Book leaves follow scroll position in both directions, without wheel/touch capture. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width:767px), (max-width:1024px) and (pointer:coarse)');
  const leaves = [];
  document.querySelectorAll('main > section:not(.hero)').forEach(section => {
    const leaf = document.createElement('div');
    leaf.className = `book-leaf${section.classList.contains('countdown-section') ? ' book-leaf--dark' : ''}`;
    section.before(leaf);
    leaf.appendChild(section);
    section.classList.add('book-page');
    for (const className of ['page-turn-sheet', 'page-spine']) {
      const decoration = document.createElement('div');
      decoration.className = className;
      decoration.setAttribute('aria-hidden', 'true');
      leaf.appendChild(decoration);
    }
    leaves.push({ element: leaf, progress: -1 });
  });
  let scheduled = false;
  function updateBook() {
    scheduled = false;
    const start = innerHeight * .98;
    // Finish sooner on narrow screens, so longer pages remain easy to read.
    const finish = innerHeight * (phone.matches ? .46 : .18);
    const positions = leaves.map(leaf => leaf.element.getBoundingClientRect().top);
    leaves.forEach((leaf, index) => {
      const progress = preference.matches ? 1 : Math.max(0, Math.min(1, (start - positions[index]) / (start - finish)));
      const rounded = Math.round(progress * 1000) / 1000;
      if (leaf.progress === rounded) return;
      leaf.progress = rounded;
      leaf.element.style.setProperty('--page-angle', `${-(1 - progress) * (phone.matches ? 12 : 24)}deg`);
      leaf.element.style.setProperty('--paper-angle', `${-progress * 156}deg`);
      leaf.element.style.setProperty('--paper-opacity', String(Math.max(0, 1 - Math.max(0, progress - .48) / .2)));
      leaf.element.style.setProperty('--spine-opacity', String((1 - progress) * .65));
      leaf.element.classList.toggle('is-open', progress >= .999);
    });
  }
  function scheduleBook() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateBook);
    }
  }
  window.addEventListener('scroll', scheduleBook, { passive: true });
  window.addEventListener('resize', scheduleBook, { passive: true });
  window.addEventListener('pageshow', scheduleBook);
  window.addEventListener('load', scheduleBook, { once: true });
  preference.addEventListener('change', scheduleBook);
  phone.addEventListener('change', scheduleBook);
  document.fonts?.ready.then(scheduleBook);
  updateBook();
})();
