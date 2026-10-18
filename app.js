/* Keep event details consistent with index.html and assets/celebration.ics. */
const EVENT = Object.freeze({
  start: '2026-10-20T12:00:00+05:30',
  end: '2026-10-20T16:00:00+05:30',
  maps: 'https://share.google/iRP4Nb8JHXXUwZSCt',
});
document.documentElement.classList.add('js');
const $ = selector => document.querySelector(selector);
const audio = $('#devotional-audio');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
audio.volume = 0.55;
audio.muted = false;
let toastTimer;

function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}

// Start immediately when permitted; retry directly in the first trusted interaction.
async function playMusic() {
  if (document.hidden || !audio.paused) return;
  try {
    await audio.play();
    if (document.hidden) audio.pause();
  } catch {
    // Browsers may require a trusted tap before audible playback.
  }
}
for (const eventName of ['click', 'pointerup', 'touchend', 'keydown']) {
  document.addEventListener(eventName, () => void playMusic(), { passive: true, capture: true });
}
window.addEventListener('pageshow', () => void playMusic());
window.addEventListener('focus', () => void playMusic());
audio.addEventListener('canplay', () => void playMusic());
audio.addEventListener('error', () => {
  notify('The devotional audio could not load. Please refresh the page.');
});
void playMusic();

function updateCountdown() {
  const now = Date.now();
  const start = new Date(EVENT.start).getTime();
  const remaining = Math.max(0, Math.floor((start - now) / 1000));
  const values = {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24,
    minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60,
  };
  Object.entries(values).forEach(([key, value]) => {
    const digit = $(`#${key}`);
    const next = String(value).padStart(2, '0');
    if (digit.textContent !== next) {
      const bounds = digit.getBoundingClientRect();
      if (!reducedMotion.matches && digit.animate && bounds.bottom > 0 && bounds.top < innerHeight) {
        digit.animate([
          { opacity: .35, transform: 'translateY(7px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 380, easing: 'cubic-bezier(.2,.7,.3,1)' });
      }
      digit.textContent = next;
    }
  });
  $('#countdown-status').textContent = now < start ? 'Until we celebrate, together.'
    : now < new Date(EVENT.end).getTime() ? 'The day is here! Our celebration is underway.'
      : 'Thank you for being part of our beautiful beginning.';
}
updateCountdown();
setInterval(updateCountdown, 1000);

function petals() {
  if (reducedMotion.matches) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 45; i++) {
    const petal = document.createElement('i');
    petal.className = 'petal blessing-burst';
    petal.style.setProperty('--burst-image', `url(assets/blessing-${['rose', 'marigold', 'lavender'][i % 3]}.svg)`);
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty('--duration', `${3 + Math.random() * 3}s`);
    petal.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
    petal.style.setProperty('--spin', `${Math.random() * 800 - 400}deg`);
    petal.style.animationDelay = `${Math.random() * 1.5}s`;
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
    fragment.appendChild(petal);
  }
  $('#petals').appendChild(fragment);
}
$('#send-blessings').addEventListener('click', () => {
  if ($('#send-blessings').disabled) return;
  petals();
  $('#blessing-response').textContent = 'Your blessings mean the world to us. ♡';
  $('#send-blessings').disabled = true;
  setTimeout(() => { $('#send-blessings').disabled = false; }, 7000);
});

// All content remains readable without JavaScript.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
let scrollScheduled = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('.scroll-progress').style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);

// Silent film starts automatically in view, respecting reduced-motion preferences.
const preview = $('#film-preview');
let previewInView = false;
async function syncPreview() {
  if (reducedMotion.matches || !previewInView || document.hidden) {
    preview.pause();
    return;
  }
  if (!preview.getAttribute('src')) preview.src = preview.dataset.src;
  preview.muted = true;
  try { await preview.play(); } catch { /* Autoplay can be restricted by browser settings. */ }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    previewInView = entries[0].isIntersecting;
    void syncPreview();
  }, { threshold: 0.2 });
  observer.observe(preview);
} else {
  previewInView = true;
  void syncPreview();
}
reducedMotion.addEventListener('change', () => {
  void syncPreview();
});
document.addEventListener('visibilitychange', () => {
  void syncPreview();
  if (document.hidden) audio.pause();
  else void playMusic();
});
