(() => {
  const stage = document.querySelector('.workshop-motion');
  if (!stage) return;
  const video = stage.querySelector('video');
  const button = stage.querySelector('button');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reduced.matches;
  let visible = true;
  const syncButton = () => {
    button.textContent = video.paused ? '▶ Включить' : 'Ⅱ Пауза';
    button.setAttribute('aria-label', video.paused ? 'Включить анимацию мастерской' : 'Приостановить анимацию мастерской');
  };
  const play = () => {
    if (!userPaused && visible) video.play().catch(() => { button.hidden = false; syncButton(); });
  };
  video.addEventListener('playing', () => { stage.classList.add('is-playing'); button.hidden = false; syncButton(); });
  video.addEventListener('pause', syncButton);
  video.addEventListener('error', () => { stage.classList.remove('is-playing'); button.hidden = true; });
  button.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause(); else play();
  });
  reduced.addEventListener('change', event => {
    userPaused = event.matches;
    if (userPaused) { video.pause(); stage.classList.remove('is-playing'); }
    else play();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) play(); else video.pause();
  }, {threshold: .08}).observe(stage);
  button.hidden = false;
  syncButton();
  play();
})();
