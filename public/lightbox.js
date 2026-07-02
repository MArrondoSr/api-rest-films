(() => {
  const overlay   = document.getElementById('lightbox');
  const stageImg  = document.getElementById('lb-img');
  const btnPrev   = document.getElementById('lb-prev');
  const btnNext   = document.getElementById('lb-next');
  const btnClose  = document.getElementById('lb-close');

  // === MANIFEST: fotos por año ===
  // Cargá acá TODAS las rutas reales.
  const GALLERIES = {
    "1989": [
      "./imagenes/1989/01.jpg",
      "./imagenes/1989/02.jpg",
      "./imagenes/1989/03.jpg",
      // ...
    ],
    "1991": [
      "./imagenes/1991/01.jpg",
      "./imagenes/1991/02.jpg",
      // ...
    ],
    // …otros años…
  };

  let currentList = [];
  let currentIndex = 0;

  function openList(list, startIndex = 0) {
    currentList = list;
    currentIndex = startIndex;
    stageImg.src = currentList[currentIndex];
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    preloadNeighbor(+1);
    preloadNeighbor(-1);
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stageImg.src = '';
    currentList = [];
    currentIndex = 0;
  }

  function show(delta) {
    if (!currentList.length) return;
    currentIndex = (currentIndex + delta + currentList.length) % currentList.length;
    stageImg.src = currentList[currentIndex];
    preloadNeighbor(+1);
    preloadNeighbor(-1);
  }

  function preloadNeighbor(delta) {
    if (!currentList.length) return;
    const idx = (currentIndex + delta + currentList.length) % currentList.length;
    const img = new Image();
    img.src = currentList[idx];
  }

  // Click en miniaturas por año (abre la lista de ese año)
  document.querySelectorAll('.year-thumb').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const year = a.dataset.year;
      const list = GALLERIES[year];
      if (list && list.length) {
        openList(list, 0);
      } else {
        console.warn(`No hay fotos configuradas para el año ${year}`);
      }
    });
  });

  // Controles
  btnPrev.addEventListener('click', () => show(-1));
  btnNext.addEventListener('click', () => show(+1));
  btnClose.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') show(+1);
    if (e.key === 'ArrowLeft')  show(-1);
  });
})();
