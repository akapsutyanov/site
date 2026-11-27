(() => {
  const scene = document.querySelector('.metal-backdrop');
  const video = scene.querySelector('video');
  const button = document.querySelector('.metal-motion-button');
  const portrait = matchMedia('(max-width: 700px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByVisitor = reduced.matches;
  let inView = true;
  function updateButton() {
    button.classList.toggle('paused', video.paused);
    const label = video.paused ? 'Включить фоновое видео' : 'Приостановить фоновое видео';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  function sync() {
    if (pausedByVisitor || document.hidden || !inView) { video.pause(); updateButton(); return; }
    const source = portrait.matches ? 'hero-mobile.mp4' : 'hero.mp4';
    if (video.getAttribute('src') !== source) {
      scene.classList.remove('is-playing');
      video.src = source;
    }
    video.play().catch(updateButton);
  }
  button.onclick = () => { pausedByVisitor = !video.paused; sync(); };
  video.addEventListener('playing', () => { scene.classList.add('is-playing'); updateButton(); });
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => { scene.classList.remove('is-playing'); updateButton(); });
  portrait.addEventListener('change', () => { scene.classList.remove('is-playing'); sync(); });
  reduced.addEventListener('change', () => { pausedByVisitor = reduced.matches; sync(); });
  new IntersectionObserver(([entry]) => {inView = entry.isIntersecting; sync();}).observe(scene);
  document.addEventListener('visibilitychange', sync);
  button.hidden = false;
  sync();
})();
