document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Smooth scroll for all anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─────────────────────────────────────────────────────────────
// GALLERY MODAL
// ─────────────────────────────────────────────────────────────
(function () {
  // Image data per theme — 5 photos each
  // NOTE: ganti path image di sini sesuai aset asli kamu di folder /images/
  const galleries = {
    minimalist: {
      title: 'Simple Minimalist',
      images: [
        { src: 'images/mockup1.jpeg', alt: 'Simple Minimalist — hero section' },
        { src: 'images/mockup2.png',  alt: 'Simple Minimalist — about section' },
        { src: 'images/mockup1.jpeg', alt: 'Simple Minimalist — projects grid' },
        { src: 'images/mockup2.png',  alt: 'Simple Minimalist — skills section' },
        { src: 'images/mockup1.jpeg', alt: 'Simple Minimalist — contact section' },
      ],
    },
    vintage: {
      title: 'Vintage Retro',
      images: [
        { src: 'images/mockup2.png',  alt: 'Vintage Retro — hero section' },
        { src: 'images/mockup1.jpeg', alt: 'Vintage Retro — about section' },
        { src: 'images/mockup2.png',  alt: 'Vintage Retro — projects grid' },
        { src: 'images/mockup1.jpeg', alt: 'Vintage Retro — skills section' },
        { src: 'images/mockup2.png',  alt: 'Vintage Retro — contact section' },
      ],
    },
    bohemian: {
      title: 'Bohemian Pastel',
      images: [
        { src: 'images/mockup1.jpeg', alt: 'Bohemian Pastel — hero section' },
        { src: 'images/mockup2.png',  alt: 'Bohemian Pastel — about section' },
        { src: 'images/mockup1.jpeg', alt: 'Bohemian Pastel — projects grid' },
        { src: 'images/mockup2.png',  alt: 'Bohemian Pastel — skills section' },
        { src: 'images/mockup1.jpeg', alt: 'Bohemian Pastel — contact section' },
      ],
    },
    industrial: {
      title: 'Industrial',
      images: [
        { src: 'images/mockup2.png',  alt: 'Industrial — hero section' },
        { src: 'images/mockup1.jpeg', alt: 'Industrial — about section' },
        { src: 'images/mockup2.png',  alt: 'Industrial — projects grid' },
        { src: 'images/mockup1.jpeg', alt: 'Industrial — skills section' },
        { src: 'images/mockup2.png',  alt: 'Industrial — contact section' },
      ],
    },
  };

  const modal     = document.getElementById('galleryModal');
  const titleEl   = document.getElementById('galleryTitle');
  const imageEl   = document.getElementById('galleryImage');
  const counterEl = document.getElementById('galleryCounter');
  const thumbsEl  = document.getElementById('galleryThumbs');
  const prevBtn   = document.getElementById('galleryPrev');
  const nextBtn   = document.getElementById('galleryNext');

  if (!modal) return;

  let activeImages = [];
  let activeIndex  = 0;
  let lastFocused  = null;

  function renderImage() {
    const img = activeImages[activeIndex];
    if (!img) return;

    // Re-trigger fade animation on swap
    imageEl.style.animation = 'none';
    void imageEl.offsetWidth;
    imageEl.style.animation = '';

    imageEl.src = img.src;
    imageEl.alt = img.alt;
    counterEl.innerHTML = `<strong>${activeIndex + 1}</strong> / ${activeImages.length}`;

    thumbsEl.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === activeImages.length - 1;
  }

  function buildThumbs() {
    thumbsEl.innerHTML = '';
    activeImages.forEach((img, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-thumb' + (i === activeIndex ? ' active' : '');
      btn.setAttribute('aria-label', `Foto ${i + 1}`);
      btn.innerHTML = `<img src="${img.src}" alt="" loading="lazy">`;
      btn.addEventListener('click', () => {
        activeIndex = i;
        renderImage();
      });
      thumbsEl.appendChild(btn);
    });
  }

  function open(themeKey) {
    const data = galleries[themeKey];
    if (!data) return;

    activeImages = data.images;
    activeIndex  = 0;
    titleEl.textContent = data.title;

    buildThumbs();
    renderImage();

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('gallery-open');
    setTimeout(() => modal.querySelector('.gallery-close')?.focus(), 50);
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('gallery-open');
    if (lastFocused) lastFocused.focus();
  }

  function next() {
    if (activeIndex < activeImages.length - 1) {
      activeIndex++;
      renderImage();
    }
  }

  function prev() {
    if (activeIndex > 0) {
      activeIndex--;
      renderImage();
    }
  }

  document.querySelectorAll('.showcase-item[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      open(btn.getAttribute('data-theme'));
    });
  });

  modal.querySelectorAll('[data-gallery-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowRight')  next();
    if (e.key === 'ArrowLeft')   prev();
  });

  // Touch swipe (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  const stage = modal.querySelector('.gallery-stage');
  if (stage) {
    stage.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) next();
        else prev();
      }
    }, { passive: true });
  }
})();