/* ============================================================
   NOMI — landing page JS
   Smooth scroll, gallery modal, scroll-reveal
   ============================================================ */

(function () {
  'use strict';

  /* -------- smooth-scroll for in-page anchors -------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -------- scroll-triggered reveal -------- */
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section-head, .pain-card, .showcase-item, .step, .testi-card, .price-card, .bonus-row, .faq-item, .final-card'
    );

    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach((el) => io.observe(el));
  }

  (function initShowcaseScroll() {
  const viewport = document.getElementById('showcaseViewport');
  const track    = document.getElementById('showcaseTrack');
  const prevBtn  = document.getElementById('showcasePrev');
  const nextBtn  = document.getElementById('showcaseNext');
  const counter  = document.getElementById('showcaseCounter');
  const totalEl  = document.getElementById('showcaseTotal');

  if (!viewport || !track) return;

  const items = track.querySelectorAll('.showcase-item');
  const total = items.length;
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

  function getActiveIndex() {
    const scrollLeft = viewport.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - scrollLeft - viewport.offsetLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function updateState() {
    const idx = getActiveIndex();
    if (counter) {
      counter.querySelector('strong').textContent = String(idx + 1).padStart(2, '0');
    }

    if (prevBtn && nextBtn) {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      prevBtn.disabled = viewport.scrollLeft <= 2;
      nextBtn.disabled = viewport.scrollLeft >= maxScroll - 2;
    }
  }

  function scrollToIndex(i) {
    const clamped = Math.max(0, Math.min(total - 1, i));
    const item = items[clamped];
    if (!item) return;
    viewport.scrollTo({
      left: item.offsetLeft - viewport.offsetLeft,
      behavior: 'smooth',
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToIndex(getActiveIndex() - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToIndex(getActiveIndex() + 1));
  }

  let scrollTimer;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateState, 80);
  }, { passive: true });

  window.addEventListener('resize', updateState);
  updateState();
})();

  /* -------- GALLERY MODAL --------
     Themes are rendered as CSS-driven mock variations (5 per theme),
     no external images required.
  --------------------------------- */
  // const themeMockup = (theme, variant) => {
  //   // 5 variant layouts per theme — distinct enough to feel like real screens
  //   const variants = {
  //     minimalist: [
  //       // 1: hero
  //       `<div class="g-mock g-mock-minimalist">
  //          <div class="gm-nav">
  //            <span class="gm-logo">A.</span>
  //            <span class="gm-link">Work</span>
  //            <span class="gm-link">About</span>
  //            <span class="gm-link">Contact</span>
  //          </div>
  //          <div class="gm-hero">
  //            <div class="gm-eyebrow">Backend Engineer</div>
  //            <h1 class="gm-h1">Arya<br>Pratama</h1>
  //            <p class="gm-p">Building reliable backend systems with Node.js, Go, and AWS. 2+ years of experience.</p>
  //          </div>
  //        </div>`,
  //       // 2: about
  //       `<div class="g-mock g-mock-minimalist">
  //          <div class="gm-section-label">— About</div>
  //          <div class="gm-about">
  //            <div class="gm-avatar-lg"></div>
  //            <div>
  //              <h2 class="gm-h2">Short bio.</h2>
  //              <p class="gm-p">Currently focusing on distributed systems and cloud infrastructure. Previously at three early-stage startups.</p>
  //              <div class="gm-stat-row">
  //                <div><strong>2yr</strong><span>experience</span></div>
  //                <div><strong>14</strong><span>projects</span></div>
  //                <div><strong>3</strong><span>companies</span></div>
  //              </div>
  //            </div>
  //          </div>
  //        </div>`,
  //       // 3: projects grid
  //       `<div class="g-mock g-mock-minimalist">
  //          <div class="gm-section-label">— Selected Work</div>
  //          <div class="gm-proj-grid">
  //            <div class="gm-proj"><div class="gm-proj-thumb"></div><div class="gm-proj-meta"><strong>OrderHub</strong><span>API · 2025</span></div></div>
  //            <div class="gm-proj"><div class="gm-proj-thumb"></div><div class="gm-proj-meta"><strong>FlowQueue</strong><span>System · 2024</span></div></div>
  //            <div class="gm-proj"><div class="gm-proj-thumb"></div><div class="gm-proj-meta"><strong>Stocker.io</strong><span>SaaS · 2024</span></div></div>
  //            <div class="gm-proj"><div class="gm-proj-thumb"></div><div class="gm-proj-meta"><strong>Pulsa API</strong><span>Service · 2023</span></div></div>
  //          </div>
  //        </div>`,
  //       // 4: skills
  //       `<div class="g-mock g-mock-minimalist">
  //          <div class="gm-section-label">— Stack</div>
  //          <div class="gm-stack">
  //            <div class="gm-stack-col"><span>Languages</span><strong>TypeScript</strong><strong>Go</strong><strong>Python</strong></div>
  //            <div class="gm-stack-col"><span>Cloud</span><strong>AWS</strong><strong>GCP</strong><strong>Cloudflare</strong></div>
  //            <div class="gm-stack-col"><span>Tools</span><strong>Docker</strong><strong>Terraform</strong><strong>PostgreSQL</strong></div>
  //          </div>
  //        </div>`,
  //       // 5: contact
  //       `<div class="g-mock g-mock-minimalist">
  //          <div class="gm-section-label">— Contact</div>
  //          <h2 class="gm-h2">Let's talk.</h2>
  //          <p class="gm-p">Open for backend roles, full-time or contract.</p>
  //          <div class="gm-contact">
  //            <div class="gm-contact-row"><span>Email</span><strong>arya@axen.software</strong></div>
  //            <div class="gm-contact-row"><span>LinkedIn</span><strong>/in/aryapratama</strong></div>
  //            <div class="gm-contact-row"><span>GitHub</span><strong>@aryapratama</strong></div>
  //          </div>
  //        </div>`,
  //     ],
  //     editorial: [
  //       `<div class="g-mock g-mock-editorial">
  //          <div class="gm-edi-top">
  //            <span>№ 01</span><span>Portfolio — 2026</span>
  //          </div>
  //          <h1 class="gm-edi-h1"><em>Mira</em><br>Nurhaliza</h1>
  //          <p class="gm-edi-deck">UI/UX Designer · Type-led editorial design · Currently based in Jakarta.</p>
  //          <div class="gm-edi-rule"></div>
  //        </div>`,
  //       `<div class="g-mock g-mock-editorial">
  //          <div class="gm-edi-top"><span>02 — About</span><span>Bio</span></div>
  //          <div class="gm-edi-cols">
  //            <div>
  //              <h3 class="gm-edi-h3">A short note.</h3>
  //              <p class="gm-edi-body">Eight years moving between agency and product. I care about typography that reads, color that means something, and interactions that feel like good furniture — quiet and obvious.</p>
  //            </div>
  //            <div class="gm-edi-portrait"></div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-editorial">
  //          <div class="gm-edi-top"><span>03 — Work</span><span>Selected</span></div>
  //          <ol class="gm-edi-list">
  //            <li><span class="gm-edi-num">01</span><div><strong>Lumen Banking</strong><em>Brand & product — 2025</em></div></li>
  //            <li><span class="gm-edi-num">02</span><div><strong>Senja Magazine</strong><em>Editorial — 2024</em></div></li>
  //            <li><span class="gm-edi-num">03</span><div><strong>Kopi Tubruk Co.</strong><em>Identity — 2024</em></div></li>
  //            <li><span class="gm-edi-num">04</span><div><strong>Studio Pasut</strong><em>Web — 2023</em></div></li>
  //          </ol>
  //        </div>`,
  //       `<div class="g-mock g-mock-editorial">
  //          <div class="gm-edi-top"><span>04 — Tools</span><span>How I work</span></div>
  //          <div class="gm-edi-tools">
  //            <div><h4>Design</h4><p>Figma, Cavalry, After Effects</p></div>
  //            <div><h4>Research</h4><p>Dovetail, Maze, Notion</p></div>
  //            <div><h4>Type</h4><p>Adobe Fonts, Pangram Pangram, OHno</p></div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-editorial">
  //          <div class="gm-edi-top"><span>05 — Contact</span><span>Available now</span></div>
  //          <h2 class="gm-edi-h1" style="font-size:32px"><em>Drop a</em><br>line.</h2>
  //          <div class="gm-edi-contact">
  //            <div><span>Email</span><strong>mira@axen.software</strong></div>
  //            <div><span>Instagram</span><strong>@mira.studio</strong></div>
  //          </div>
  //        </div>`,
  //     ],
  //     mono: [
  //       `<div class="g-mock g-mock-mono">
  //          <div class="gm-mono-line"><span class="gm-mono-prompt">~ $</span> whoami</div>
  //          <div class="gm-mono-out">→ dimas.p — frontend developer</div>
  //          <div class="gm-mono-line" style="margin-top:14px"><span class="gm-mono-prompt">~ $</span> cat stack.txt</div>
  //          <div class="gm-mono-out">react, vue, svelte, typescript</div>
  //          <div class="gm-mono-out">tailwind, css modules, figma</div>
  //          <div class="gm-mono-line" style="margin-top:14px"><span class="gm-mono-prompt">~ $</span> _<span class="gm-mono-cursor"></span></div>
  //        </div>`,
  //       `<div class="g-mock g-mock-mono">
  //          <div class="gm-mono-header">// projects.json</div>
  //          <div class="gm-mono-block">
  //            <div>{</div>
  //            <div>&nbsp;&nbsp;"recent": [</div>
  //            <div>&nbsp;&nbsp;&nbsp;&nbsp;{ "name": "Atlas", "year": 2025 },</div>
  //            <div>&nbsp;&nbsp;&nbsp;&nbsp;{ "name": "Pulse",  "year": 2024 },</div>
  //            <div>&nbsp;&nbsp;&nbsp;&nbsp;{ "name": "Grid.dev", "year": 2024 }</div>
  //            <div>&nbsp;&nbsp;]</div>
  //            <div>}</div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-mono">
  //          <div class="gm-mono-header">// experience.md</div>
  //          <div class="gm-mono-exp">
  //            <div><strong>2024 → now</strong><br>Frontend Engineer, Lumen.id</div>
  //            <div><strong>2022 → 2024</strong><br>Web Developer, Studio Pasut</div>
  //            <div><strong>2021 → 2022</strong><br>Freelance Developer</div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-mono">
  //          <div class="gm-mono-header">// skills</div>
  //          <div class="gm-mono-skills">
  //            <div class="gm-mono-skill"><span>typescript</span><div class="gm-mono-bar"><div style="width:90%"></div></div></div>
  //            <div class="gm-mono-skill"><span>react</span><div class="gm-mono-bar"><div style="width:85%"></div></div></div>
  //            <div class="gm-mono-skill"><span>vue</span><div class="gm-mono-bar"><div style="width:70%"></div></div></div>
  //            <div class="gm-mono-skill"><span>svelte</span><div class="gm-mono-bar"><div style="width:55%"></div></div></div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-mono">
  //          <div class="gm-mono-line"><span class="gm-mono-prompt">~ $</span> contact --hire</div>
  //          <div class="gm-mono-out">→ open for: frontend, fullstack</div>
  //          <div class="gm-mono-out">→ email: dimas@axen.software</div>
  //          <div class="gm-mono-out">→ github: @dimasp</div>
  //          <div class="gm-mono-out">→ resp time: &lt; 24h</div>
  //        </div>`,
  //     ],
  //     industrial: [
  //       `<div class="g-mock g-mock-industrial">
  //          <div class="gm-ind-top">№ 04 — INDUSTRIAL</div>
  //          <h1 class="gm-ind-h1">RANIA<br>KUSUMA.</h1>
  //          <div class="gm-ind-tag">MARKETING ANALYST · EST. 2022</div>
  //          <div class="gm-ind-bars"><div></div><div></div><div></div><div></div></div>
  //        </div>`,
  //       `<div class="g-mock g-mock-industrial">
  //          <div class="gm-ind-section">01 / OVERVIEW</div>
  //          <p class="gm-ind-body">Three years analyzing growth funnels and consumer behaviour for D2C brands. Specialty: marketing mix modelling, attribution, retention loops.</p>
  //          <div class="gm-ind-stats">
  //            <div><strong>14</strong><span>brands shipped</span></div>
  //            <div><strong>2.3M</strong><span>budget managed</span></div>
  //            <div><strong>+38%</strong><span>avg. ROAS lift</span></div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-industrial">
  //          <div class="gm-ind-section">02 / CASE STUDIES</div>
  //          <div class="gm-ind-cases">
  //            <div><span>2025</span><strong>Senja Skincare</strong><em>Repositioning, +44% retention</em></div>
  //            <div><span>2024</span><strong>Kayuh Co.</strong><em>Channel mix overhaul, -22% CAC</em></div>
  //            <div><span>2023</span><strong>Pulang.id</strong><em>Launch GTM, 10k users in Q1</em></div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-industrial">
  //          <div class="gm-ind-section">03 / TOOLS</div>
  //          <div class="gm-ind-tools">
  //            <div>SQL</div><div>Looker</div><div>GA4</div><div>Mixpanel</div>
  //            <div>Python</div><div>Notion</div><div>Figma</div><div>Hex</div>
  //          </div>
  //        </div>`,
  //       `<div class="g-mock g-mock-industrial">
  //          <div class="gm-ind-section">04 / CONTACT</div>
  //          <h2 class="gm-ind-h1" style="font-size:36px">GET IN<br>TOUCH.</h2>
  //          <div class="gm-ind-contact">
  //            <div>EMAIL — rania@axen.software</div>
  //            <div>LINKEDIN — /in/raniakusuma</div>
  //            <div>RESPONSE — within 24 hours</div>
  //          </div>
  //        </div>`,
  //     ],
  //   };

  //   return variants[theme][variant];
  // };


  /* -------- GALLERY MODAL --------
   Modal sekarang render <img> dari array per-tema.
   Kalau gambar asli udah jadi, tinggal ganti array di bawah.
--------------------------------- */
const galleryImages = {
  minimalist: [
    'images/mockup1.jpeg',
    'images/mockup2.png',
    'images/mockup1.jpeg',
    'images/mockup2.png',
  ],
  editorial: [
    'images/mockup2.png',
    'images/mockup1.jpeg',
    'images/mockup2.png',
    'images/mockup1.jpeg',
  ],
  mono: [
    'images/mockup1.jpeg',
    'images/mockup2.png',
    'images/mockup1.jpeg',
  ],
  industrial: [
    'images/mockup2.png',
    'images/mockup1.jpeg',
    'images/mockup2.png',
  ],
};

const themeMockup = (theme, variant) => {
  const src = galleryImages[theme]?.[variant];
  if (!src) return '';
  return `<img src="${src}" alt="${theme} preview ${variant + 1}" class="g-mock-img" loading="lazy">`;
};

const galleries = {
  minimalist: { title: 'Simple Minimalist', count: galleryImages.minimalist.length },
  editorial:  { title: 'Editorial Serif',   count: galleryImages.editorial.length },
  mono:       { title: 'Developer Mono',    count: galleryImages.mono.length },
  industrial: { title: 'Industrial',        count: galleryImages.industrial.length },
};

  const modal     = document.getElementById('galleryModal');
  const titleEl   = document.getElementById('galleryTitle');
  const canvasEl  = document.getElementById('galleryCanvas');
  const counterEl = document.getElementById('galleryCounter');
  const thumbsEl  = document.getElementById('galleryThumbs');
  const prevBtn   = document.getElementById('galleryPrev');
  const nextBtn   = document.getElementById('galleryNext');

  if (!modal) return;

  // Inject gallery-specific styles for the rich CSS mocks
  // injectGalleryStyles();

  let activeTheme = null;
  let activeIndex = 0;
  let lastFocused = null;

  function render() {
    if (!activeTheme) return;
    const meta = galleries[activeTheme];

    // re-trigger fade
    canvasEl.style.animation = 'none';
    void canvasEl.offsetWidth;
    canvasEl.style.animation = '';

    canvasEl.innerHTML = themeMockup(activeTheme, activeIndex);
    counterEl.innerHTML = `<strong>${activeIndex + 1}</strong> / ${meta.count}`;

    thumbsEl.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === meta.count - 1;
  }

  // function buildThumbs() {
  //   const meta = galleries[activeTheme];
  //   thumbsEl.innerHTML = '';
  //   for (let i = 0; i < meta.count; i++) {
  //     const btn = document.createElement('button');
  //     btn.type = 'button';
  //     btn.className = 'gallery-thumb' + (i === activeIndex ? ' active' : '');
  //     btn.setAttribute('aria-label', `Slide ${i + 1}`);

  //     const thumb = document.createElement('div');
  //     thumb.className = 'gallery-thumb-canvas';
  //     thumb.style.transform = 'scale(0.18)';
  //     thumb.style.transformOrigin = 'top left';
  //     thumb.style.width = '555%';
  //     thumb.style.height = '555%';
  //     thumb.innerHTML = themeMockup(activeTheme, i);

  //     const wrap = document.createElement('div');
  //     wrap.style.cssText = 'width:100%;height:100%;overflow:hidden;position:relative';
  //     wrap.appendChild(thumb);
  //     btn.appendChild(wrap);

  //     btn.addEventListener('click', () => {
  //       activeIndex = i;
  //       render();
  //     });

  //     thumbsEl.appendChild(btn);
  //   }
  // }

  function buildThumbs() {
  const meta = galleries[activeTheme];
  thumbsEl.innerHTML = '';
  for (let i = 0; i < meta.count; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-thumb' + (i === activeIndex ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);

    const src = galleryImages[activeTheme][i];
    btn.innerHTML = `<img src="${src}" alt="" class="gallery-thumb-img" loading="lazy">`;

    btn.addEventListener('click', () => {
      activeIndex = i;
      render();
    });

    thumbsEl.appendChild(btn);
  }
}

  function open(theme) {
    if (!galleries[theme]) return;
    activeTheme = theme;
    activeIndex = 0;
    titleEl.textContent = galleries[theme].title;

    buildThumbs();
    render();

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
    const meta = galleries[activeTheme];
    if (activeIndex < meta.count - 1) {
      activeIndex++;
      render();
    }
  }

  function prev() {
    if (activeIndex > 0) {
      activeIndex--;
      render();
    }
  }

  document.querySelectorAll('.showcase-item[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      open(btn.getAttribute('data-theme'));
    });
  });

  modal.querySelectorAll('[data-gallery-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // touch swipe
  let touchStartX = 0;
  const stage = modal.querySelector('.gallery-stage');
  if (stage) {
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) next();
        else prev();
      }
    }, { passive: true });
  }

  /* ============================================================
     INJECT GALLERY MOCK STYLES
     Kept in JS so they're scoped to the gallery feature only.
  ============================================================ */
  // function injectGalleryStyles() {
  //   if (document.getElementById('gallery-mock-styles')) return;
  //   const css = `
  //   .g-mock {
  //     position: absolute; inset: 0; padding: 36px 44px;
  //     display: flex; flex-direction: column; gap: 16px;
  //     font-family: var(--font-display);
  //   }
  //   /* MINIMALIST */
  //   .g-mock-minimalist { background: #fafaf7; color: #111; }
  //   .gm-nav { display: flex; align-items: center; gap: 22px; font-family: var(--font-body); font-size: 12px; color: #555; margin-bottom: 12px; }
  //   .gm-nav .gm-logo { font-weight: 600; color: #111; margin-right: auto; }
  //   .gm-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #888; }
  //   .gm-h1 { font-size: 56px; line-height: 0.96; letter-spacing: -0.035em; font-weight: 600; color: #111; }
  //   .gm-h2 { font-size: 28px; line-height: 1.1; letter-spacing: -0.025em; font-weight: 600; color: #111; margin-bottom: 10px; }
  //   .gm-p { font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: #555; max-width: 38ch; }
  //   .gm-section-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; }
  //   .gm-about { display: grid; grid-template-columns: 140px 1fr; gap: 24px; align-items: start; }
  //   .gm-avatar-lg { width: 140px; height: 180px; background: linear-gradient(135deg, #d9d6cf, #c4c0b6); border-radius: 4px; }
  //   .gm-stat-row { display: flex; gap: 28px; margin-top: 18px; font-family: var(--font-body); }
  //   .gm-stat-row > div { display: flex; flex-direction: column; }
  //   .gm-stat-row strong { font-size: 22px; color: #111; font-weight: 600; }
  //   .gm-stat-row span { font-size: 11px; color: #888; }
  //   .gm-proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  //   .gm-proj-thumb { aspect-ratio: 3/2; background: #ebe8e0; border-radius: 4px; margin-bottom: 8px; }
  //   .gm-proj-meta { display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 12px; }
  //   .gm-proj-meta strong { color: #111; }
  //   .gm-proj-meta span { color: #888; }
  //   .gm-stack { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; font-family: var(--font-body); }
  //   .gm-stack-col span { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; margin-bottom: 10px; }
  //   .gm-stack-col strong { display: block; font-size: 14px; color: #111; font-weight: 500; padding: 4px 0; }
  //   .gm-contact { display: flex; flex-direction: column; gap: 12px; font-family: var(--font-body); }
  //   .gm-contact-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid #ddd; font-size: 13px; }
  //   .gm-contact-row span { color: #888; }
  //   .gm-contact-row strong { color: #111; }

  //   /* EDITORIAL */
  //   .g-mock-editorial { background: #f5f1ea; color: #1a1410; font-family: Georgia, "Times New Roman", serif; }
  //   .gm-edi-top { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #998d80; padding-bottom: 16px; border-bottom: 1px solid #d4ccbe; }
  //   .gm-edi-h1 { font-size: 60px; line-height: 0.94; letter-spacing: -0.02em; font-weight: 400; color: #1a1410; margin-top: 14px; }
  //   .gm-edi-h1 em { font-style: italic; font-weight: 400; }
  //   .gm-edi-deck { font-size: 14px; line-height: 1.5; color: #5a4f44; font-family: var(--font-body); max-width: 36ch; }
  //   .gm-edi-h3 { font-size: 22px; line-height: 1.2; font-weight: 600; color: #1a1410; margin-bottom: 8px; font-family: Georgia, serif; }
  //   .gm-edi-body { font-size: 13px; line-height: 1.6; color: #4a4035; font-family: Georgia, serif; }
  //   .gm-edi-rule { width: 80px; height: 1px; background: #1a1410; margin-top: 4px; }
  //   .gm-edi-cols { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; align-items: start; margin-top: 14px; }
  //   .gm-edi-portrait { aspect-ratio: 3/4; background: linear-gradient(160deg, #cfc4b3, #b8a994); border-radius: 2px; }
  //   .gm-edi-list { list-style: none; margin-top: 18px; }
  //   .gm-edi-list li { display: grid; grid-template-columns: 36px 1fr; gap: 14px; padding: 14px 0; border-bottom: 1px solid #d4ccbe; }
  //   .gm-edi-num { font-family: var(--font-mono); font-size: 11px; color: #998d80; padding-top: 4px; }
  //   .gm-edi-list strong { display: block; font-size: 18px; color: #1a1410; font-weight: 400; }
  //   .gm-edi-list em { font-size: 12px; color: #5a4f44; font-style: italic; }
  //   .gm-edi-tools { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 16px; }
  //   .gm-edi-tools h4 { font-size: 14px; color: #1a1410; margin-bottom: 6px; font-family: Georgia, serif; font-style: italic; font-weight: 400; }
  //   .gm-edi-tools p { font-size: 12px; color: #5a4f44; font-family: var(--font-body); }
  //   .gm-edi-contact { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; font-family: var(--font-body); }
  //   .gm-edi-contact > div { display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid #d4ccbe; font-size: 13px; }
  //   .gm-edi-contact span { color: #998d80; }
  //   .gm-edi-contact strong { color: #1a1410; font-weight: 500; }

  //   /* MONO */
  //   .g-mock-mono { background: #0a0a0a; color: #d4d4d4; font-family: "JetBrains Mono", monospace; }
  //   .gm-mono-line { font-size: 13px; color: #d4d4d4; }
  //   .gm-mono-prompt { color: #4cd963; margin-right: 8px; }
  //   .gm-mono-out { font-size: 13px; color: #888; padding-left: 22px; line-height: 1.7; }
  //   .gm-mono-cursor { display: inline-block; width: 7px; height: 13px; background: #d4d4d4; margin-left: 2px; vertical-align: middle; animation: blink 1s steps(2) infinite; }
  //   @keyframes blink { 50% { opacity: 0; } }
  //   .gm-mono-header { font-size: 12px; color: #666; margin-bottom: 12px; }
  //   .gm-mono-block { font-size: 13px; color: #d4d4d4; line-height: 1.75; padding: 16px 18px; background: #050505; border: 1px solid #222; border-radius: 4px; }
  //   .gm-mono-exp { display: flex; flex-direction: column; gap: 16px; font-size: 13px; }
  //   .gm-mono-exp > div { padding: 12px 0; border-top: 1px solid #1a1a1a; color: #d4d4d4; line-height: 1.7; }
  //   .gm-mono-exp strong { color: #0099ff; font-weight: 500; }
  //   .gm-mono-skills { display: flex; flex-direction: column; gap: 14px; }
  //   .gm-mono-skill { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 16px; font-size: 12px; }
  //   .gm-mono-skill span { color: #888; }
  //   .gm-mono-bar { height: 6px; background: #1a1a1a; border-radius: 1px; overflow: hidden; }
  //   .gm-mono-bar > div { height: 100%; background: #d4d4d4; }

  //   /* INDUSTRIAL */
  //   .g-mock-industrial { background: #1d1d1a; color: #d8d6d0; font-family: "Helvetica Neue", Helvetica, sans-serif; }
  //   .gm-ind-top { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em; color: #807d75; padding-bottom: 18px; border-bottom: 2px solid #d8d6d0; }
  //   .gm-ind-h1 { font-size: 56px; line-height: 0.92; font-weight: 700; letter-spacing: -0.02em; color: #f0eee8; margin-top: 16px; }
  //   .gm-ind-tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; color: #807d75; margin-top: 12px; }
  //   .gm-ind-bars { display: flex; gap: 4px; margin-top: auto; }
  //   .gm-ind-bars > div { flex: 1; height: 40px; background: #d8d6d0; opacity: 0.2; }
  //   .gm-ind-bars > div:nth-child(2) { opacity: 0.4; }
  //   .gm-ind-bars > div:nth-child(3) { opacity: 0.6; }
  //   .gm-ind-bars > div:nth-child(4) { opacity: 0.85; }
  //   .gm-ind-section { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em; color: #f0eee8; padding-bottom: 12px; border-bottom: 1px solid #3a3a35; }
  //   .gm-ind-body { font-size: 14px; line-height: 1.55; color: #b8b5ad; max-width: 50ch; margin-top: 4px; }
  //   .gm-ind-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 16px; }
  //   .gm-ind-stats > div { padding-top: 14px; border-top: 1px solid #3a3a35; }
  //   .gm-ind-stats strong { display: block; font-size: 26px; color: #f0eee8; font-weight: 700; letter-spacing: -0.02em; }
  //   .gm-ind-stats span { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; color: #807d75; text-transform: uppercase; }
  //   .gm-ind-cases { display: flex; flex-direction: column; }
  //   .gm-ind-cases > div { display: grid; grid-template-columns: 60px 1fr 1.5fr; align-items: baseline; gap: 16px; padding: 14px 0; border-bottom: 1px solid #2e2e2a; font-size: 13px; }
  //   .gm-ind-cases span { font-family: var(--font-mono); font-size: 11px; color: #807d75; }
  //   .gm-ind-cases strong { color: #f0eee8; font-weight: 600; }
  //   .gm-ind-cases em { color: #b8b5ad; font-style: normal; }
  //   .gm-ind-tools { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em; }
  //   .gm-ind-tools > div { padding: 14px 10px; background: #26262220; border: 1px solid #3a3a35; color: #f0eee8; text-align: center; }
  //   .gm-ind-contact { display: flex; flex-direction: column; gap: 4px; margin-top: 16px; font-family: var(--font-mono); font-size: 12px; color: #b8b5ad; letter-spacing: 0.04em; line-height: 2; }
  //   `;
  //   const style = document.createElement('style');
  //   style.id = 'gallery-mock-styles';
  //   style.textContent = css;
  //   document.head.appendChild(style);
  // }
})();