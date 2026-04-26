(() => {
  'use strict';

  /* ── Config ──────────────────────────────────────────────────── */
  const DATA_URL    = 'data/gallery_images.json';

  const CATEGORIES = [
    'Rooms',
    'Swimming Pools',
    'Restaurants',
    'Beaches',
    'Spas',
    'Golf',
    'Experiences',
    'Meeting And Event Rooms',
  ];

  /* ── State ───────────────────────────────────────────────────── */
  let allImages      = [];
  let filteredImages = [];
  let activeCategory = null;
  let lightboxIndex  = 0;

  /* ── DOM refs ────────────────────────────────────────────────── */
  const pillsContainer = document.getElementById('filterPills');
  const btnReset       = document.getElementById('btnReset');
  const grid           = document.getElementById('galleryGrid');
  const emptyMsg       = document.getElementById('emptyMsg');
  const lightbox       = document.getElementById('lightbox');
  const backdrop       = document.getElementById('lightboxBackdrop');
  const lbImg          = document.getElementById('lightboxImg');
  const lbCaption      = document.getElementById('lightboxCaption');
  const lbClose        = document.getElementById('lightboxClose');
  const lbPrev         = document.getElementById('lightboxPrev');
  const lbNext         = document.getElementById('lightboxNext');

  /* ══════════════════════════════════════════════════════════════
     1. AJAX FETCH
  ══════════════════════════════════════════════════════════════ */
  async function loadImages() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      allImages = await response.json();
    } catch (err) {
      console.error('Gallery: failed to load images.json –', err);
      grid.innerHTML = '<p style="color:#c0392b;padding:2rem;text-align:center;">Could not load gallery data. Please check the console.</p>';
      return;
    }

    filteredImages = [...allImages];
    buildPills();
    renderGrid(filteredImages);
  }

  /* ══════════════════════════════════════════════════════════════
     2. PILLS
  ══════════════════════════════════════════════════════════════ */
  function buildPills() {
    const available = CATEGORIES.filter(cat =>
      allImages.some(img => img.category === cat)
    );

    pillsContainer.innerHTML = '';

    // ── "All Categories" pill — always first, active by default ──
    const allBtn = document.createElement('button');
    allBtn.className = 'pill pill--all is-active';
    allBtn.dataset.cat = '__all__';
    allBtn.setAttribute('role', 'radio');
    allBtn.setAttribute('aria-checked', 'true');
    allBtn.innerHTML = `All Categories <span class="pill__x" aria-hidden="true">✕</span>`;
    allBtn.addEventListener('click', () => clearFilter());
    pillsContainer.appendChild(allBtn);

    // ── Category pills ──
    available.forEach(cat => {
      const btn = document.createElement('button');
      btn.className    = 'pill';
      btn.dataset.cat  = cat;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.innerHTML = `${cat}<span class="pill__x" aria-hidden="true">✕</span>`;
      btn.addEventListener('click', () => onPillClick(cat, btn));
      pillsContainer.appendChild(btn);
    });
  }

  function onPillClick(cat, btn) {
    if (activeCategory === cat) {
      clearFilter();
      return;
    }

    // Deactivate all pills
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.remove('is-active');
      p.setAttribute('aria-checked', 'false');
    });

    // Activate clicked pill
    btn.classList.add('is-active');
    btn.setAttribute('aria-checked', 'true');
    activeCategory = cat;
    btnReset.classList.add('hidden'); // reset button hidden; All Categories pill handles it

    filteredImages = allImages.filter(img => img.category === cat);
    renderGrid(filteredImages);
  }

  function clearFilter() {
    activeCategory = null;
    filteredImages = [...allImages];

    // Deactivate all, re-activate "All Categories"
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.remove('is-active');
      p.setAttribute('aria-checked', 'false');
    });
    const allPill = document.querySelector('.pill--all');
    if (allPill) {
      allPill.classList.add('is-active');
      allPill.setAttribute('aria-checked', 'true');
    }
    btnReset.classList.add('hidden');
    renderGrid(filteredImages);
  }

  btnReset.addEventListener('click', clearFilter);

  /* ══════════════════════════════════════════════════════════════
     3. RENDER GRID
  ══════════════════════════════════════════════════════════════ */
  function renderGrid(images) {
    grid.innerHTML = '';

    if (images.length === 0) {
      emptyMsg.classList.remove('hidden');
      return;
    }
    emptyMsg.classList.add('hidden');

    const fragment = document.createDocumentFragment();

    images.forEach((img, idx) => {
      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${img.title}`);
      card.dataset.idx = idx;

      card.innerHTML = `
        <div class="gallery-card__img-wrap">
          <img
            src="${img.thumbnail}"
            alt="${img.title}"
            loading="lazy"
            decoding="async"
            width="500" height="333"
            onerror="this.closest('.gallery-card__img-wrap').style.background='#e8e2d9'"
          />
        </div>
        <div class="gallery-card__overlay">
          <div class="gallery-card__overlay-inner">
            <div class="gallery-card__overlay-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="white" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="gallery-card__info">
          <p class="gallery-card__category">${img.category}</p>
          <h2 class="gallery-card__title">${img.title}</h2>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(idx));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
      });

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  /* ══════════════════════════════════════════════════════════════
     4. LIGHTBOX
  ══════════════════════════════════════════════════════════════ */
  function openLightbox(idx) {
    lightboxIndex = idx;
    renderLightboxImage();
    lightbox.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderLightboxImage() {
    const img = filteredImages[lightboxIndex];
    if (!img) return;

    // fade-out trick
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(.97)';

    setTimeout(() => {
      lbImg.src = img.image;
      lbImg.alt = img.title;
      lbCaption.innerHTML = `<strong>${img.title}</strong>${img.hotel} &mdash; ${img.category}`;
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    }, 180);

    // show/hide nav arrows
    lbPrev.style.display = lightboxIndex === 0 ? 'none' : 'flex';
    lbNext.style.display = lightboxIndex === filteredImages.length - 1 ? 'none' : 'flex';
  }

  function prevImage() {
    if (lightboxIndex > 0) { lightboxIndex--; renderLightboxImage(); }
  }
  function nextImage() {
    if (lightboxIndex < filteredImages.length - 1) { lightboxIndex++; renderLightboxImage(); }
  }

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  /* ══════════════════════════════════════════════════════════════
     5. INIT
  ══════════════════════════════════════════════════════════════ */
  loadImages();

})();