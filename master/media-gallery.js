(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const videos = [...document.querySelectorAll('video.media-preview')];
  const inView = new Set();
  let modalOpen = false;
  const canAnimate = () => !reduce.matches && !(connection && connection.saveData) && !document.hidden && !modalOpen;
  function sync(video) {
    if (!inView.has(video) || !canAnimate()) { video.pause(); return; }
    if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
    video.play().catch(() => {}); // The poster and full-film link remain usable if autoplay is blocked.
  }
  function syncAll() { videos.forEach(sync); }
  videos.forEach(video => {
    video.muted = true;
    video.addEventListener('playing', () => video.classList.add('is-playing'));
    video.addEventListener('error', () => video.classList.remove('is-playing'));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) inView.add(target); else inView.delete(target);
        sync(target);
      });
    }, {threshold: .08});
    videos.forEach(video => observer.observe(video));
  }
  document.addEventListener('visibilitychange', syncAll);
  reduce.addEventListener('change', syncAll);
  if (connection && connection.addEventListener) connection.addEventListener('change', syncAll);
  document.addEventListener('pointerdown', syncAll, {passive:true});

  const viewport = document.querySelector('.sw-viewport');
  const pause = document.querySelector('.sw-pause');
  if (viewport && pause) {
    pause.addEventListener('click', () => {
      const paused = viewport.classList.toggle('is-paused');
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? '▶ Продолжить ленту' : 'Ⅱ Остановить ленту';
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      viewport.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(viewport);
  }

  const dialog = document.getElementById('mediaDialog');
  if (!dialog || !dialog.showModal) return; // Links open their original media without dialog support.
  const stage = dialog.querySelector('.media-dialog-stage');
  const title = dialog.querySelector('#mediaDialogTitle');
  const source = dialog.querySelector('.media-dialog-source');
  let previousOverflow = '';
  document.addEventListener('click', event => {
    const link = event.target.closest('a.media-launch, a.student-photo');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const photo = link.classList.contains('student-photo');
    dialog.classList.toggle('is-photo', photo);
    dialog.classList.toggle('is-portrait', !photo && link.dataset.portrait === 'true');
    title.textContent = link.getAttribute('aria-label');
    stage.replaceChildren();
    if (photo) {
      const img = document.createElement('img');
      img.src = link.href; img.alt = link.querySelector('img').alt;
      stage.append(img);
      source.hidden = true;
    } else {
      const iframe = document.createElement('iframe');
      iframe.title = link.getAttribute('aria-label');
      iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.src = 'https://kinescope.io/embed/' + link.dataset.videoId + '?autoplay=1&controls=1&preload=1';
      stage.append(iframe);
      source.hidden = false; source.href = link.href;
    }
    modalOpen = true; syncAll();
    if (viewport) viewport.classList.add('is-offscreen');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
  dialog.querySelector('.media-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    stage.replaceChildren(); modalOpen = false;
    document.body.style.overflow = previousOverflow;
    if (viewport) viewport.classList.remove('is-offscreen');
    syncAll();
  });
})();
