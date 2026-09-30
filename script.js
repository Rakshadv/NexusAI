(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = typeof window.ScrollTrigger !== 'undefined';

  if (hasGSAP && hasST) { gsap.registerPlugin(ScrollTrigger); }

  /* 1. TACTILE PRESS */
  (function tactile() {
    const els = document.querySelectorAll('.tactile');
    function press(el) { el.classList.add('is-pressed'); }
    function release(el) { el.classList.remove('is-pressed'); }
    els.forEach(function (el) {
      el.addEventListener('pointerdown', function () { press(el); });
      el.addEventListener('pointerup', function () { release(el); });
      el.addEventListener('pointerleave', function () { release(el); });
      el.addEventListener('pointercancel', function () { release(el); });
      el.addEventListener('blur', function () { release(el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') press(el); });
      el.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') release(el); });
    });
  })();

  /* 2. LIVE CODE TERMINAL */
  const SCRIPT_LINES = [
    [{ t: '❯ ', c: 'text-cyan-neon' }, { t: 'nexus generate "stripe checkout + webhooks"', c: 'text-white' }],
    [],
    [{ t: '✓ ', c: 'text-cyan-neon' }, { t: 'intent parsed · 14 files mapped · 0 conflicts', c: 'text-[#8B99AC]' }],
    [],
    [{ t: 'import', c: 'text-violet-neon' }, { t: ' { Nexus } ', c: 'text-[#E5E7EB]' }, { t: 'from', c: 'text-violet-neon' }, { t: ' "@nexus/core"', c: 'text-cyan-neon' }],
    [{ t: 'import', c: 'text-violet-neon' }, { t: ' { stripe } ', c: 'text-[#E5E7EB]' }, { t: 'from', c: 'text-violet-neon' }, { t: ' "@/lib/stripe"', c: 'text-cyan-neon' }],
    [],
    [{ t: 'export const', c: 'text-violet-neon' }, { t: ' handler ', c: 'text-cyan-neon' }, { t: '= Nexus.route({', c: 'text-[#E5E7EB]' }],
    [{ t: '  path', c: 'text-cyan-neon' }, { t: ': ', c: 'text-[#8B99AC]' }, { t: '"/api/checkout"', c: 'text-cyan-neon' }, { t: ',', c: 'text-[#8B99AC]' }],
    [{ t: '  auth', c: 'text-cyan-neon' }, { t: ': ', c: 'text-[#8B99AC]' }, { t: '"session"', c: 'text-cyan-neon' }, { t: ',', c: 'text-[#8B99AC]' }],
    [{ t: '  run', c: 'text-cyan-neon' }, { t: ': ', c: 'text-[#8B99AC]' }, { t: 'async', c: 'text-violet-neon' }, { t: ' ({ body }) ', c: 'text-[#E5E7EB]' }, { t: '=>', c: 'text-violet-neon' }, { t: ' {', c: 'text-[#E5E7EB]' }],
    [{ t: '    const', c: 'text-violet-neon' }, { t: ' session ', c: 'text-cyan-neon' }, { t: '= ', c: 'text-[#8B99AC]' }, { t: 'await', c: 'text-violet-neon' }, { t: ' stripe.checkout.create(body)', c: 'text-[#E5E7EB]' }],
    [{ t: '    return', c: 'text-violet-neon' }, { t: ' { url: session.url }', c: 'text-[#E5E7EB]' }],
    [{ t: '  },', c: 'text-[#E5E7EB]' }],
    [{ t: '})', c: 'text-[#E5E7EB]' }],
    [],
    [{ t: '✓ ', c: 'text-cyan-neon' }, { t: '42 lines written → src/api/checkout.ts', c: 'text-[#AEBBCB]' }],
    [{ t: '✓ ', c: 'text-cyan-neon' }, { t: '8 tests generated · 8 passed in 0.42s', c: 'text-[#AEBBCB]' }],
    [{ t: '➜ ', c: 'text-violet-neon' }, { t: 'ready in 1.8s', c: 'text-cyan-neon' }]
  ];

  const termBody = document.getElementById('terminal-lines');
  if (termBody) {
    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    let lineIdx = 0, tokIdx = 0, charIdx = 0;
    let lineEl = null, tokEl = null;
    let timer = null;
    function autoScroll() { termBody.scrollTop = termBody.scrollHeight; }
    function resetTerminal() {
      termBody.innerHTML = '';
      lineIdx = 0; tokIdx = 0; charIdx = 0;
      lineEl = null; tokEl = null;
      termBody.appendChild(cursor);
      timer = setTimeout(tick, 420);
    }
    function tick() {
      if (lineIdx >= SCRIPT_LINES.length) { timer = setTimeout(resetTerminal, 3000); return; }
      const line = SCRIPT_LINES[lineIdx];
      if (!lineEl) {
        lineEl = document.createElement('div');
        lineEl.className = 'min-h-[1.35em] whitespace-pre-wrap break-words';
        termBody.appendChild(lineEl);
        lineEl.appendChild(cursor);
        autoScroll();
      }
      if (line.length === 0) { lineIdx++; tokIdx = 0; charIdx = 0; lineEl = null; tokEl = null; timer = setTimeout(tick, 90); return; }
      if (tokIdx >= line.length) { lineIdx++; tokIdx = 0; charIdx = 0; lineEl = null; tokEl = null; timer = setTimeout(tick, 130); return; }
      const tok = line[tokIdx];
      if (!tokEl) {
        tokEl = document.createElement('span');
        tokEl.className = tok.c;
        lineEl.insertBefore(tokEl, cursor);
      }
      tokEl.textContent += tok.t.charAt(charIdx);
      charIdx++;
      if (charIdx >= tok.t.length) { tokIdx++; charIdx = 0; tokEl = null; }
      autoScroll();
      timer = setTimeout(tick, reduceMotion ? 2 : 15);
    }
    termBody.appendChild(cursor);
    timer = setTimeout(tick, reduceMotion ? 60 : 1500);
  }

  /* 3. SCROLL PROGRESS */
  const progress = document.getElementById('progress');
  if (progress) {
    const update = function () {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      progress.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* 4. MOBILE MENU */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  let menuOpen = false;

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuOpen = open;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
    if (open) {
      mobileMenu.classList.remove('hidden');
      if (hasGSAP && !reduceMotion) {
        gsap.fromTo(mobileMenu, { opacity: 0, y: -10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      } else {
        mobileMenu.style.opacity = '1'; mobileMenu.style.transform = 'none';
      }
    } else {
      if (hasGSAP && !reduceMotion) {
        gsap.to(mobileMenu, { opacity: 0, y: -10, scale: 0.98, duration: 0.25, ease: 'power3.in',
          onComplete: function () { mobileMenu.classList.add('hidden'); } });
      } else {
        mobileMenu.classList.add('hidden');
      }
    }
  }
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!menuOpen); });
    mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () { if (menuOpen) setMenu(false); });
    });
    document.addEventListener('click', function (e) {
      if (menuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024 && menuOpen) setMenu(false); });
  }

  /* 5. MODAL */
  const modal = document.getElementById('contact-modal');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  const successName = document.getElementById('success-name');
  const successEmail = document.getElementById('success-email');
  const emailField = document.getElementById('field-email');
  const nameField = document.getElementById('field-name');
  const messageField = document.getElementById('field-message');
  let lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    if (form && success) { form.classList.remove('hidden'); success.classList.add('hidden'); }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (nameField) nameField.focus(); }, 320);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      setTimeout(function () { lastFocused.focus(); }, 260);
    }
  }
  document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) { e.preventDefault(); closeModal(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (!modal || !modal.classList.contains('is-open')) return;
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const visible = Array.prototype.filter.call(focusables, function (el) { return el.offsetParent !== null && !el.disabled; });
    if (!visible.length) return;
    const first = visible[0]; const last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      [nameField, emailField, messageField].forEach(function (field) {
        if (!field) return;
        field.style.borderColor = ''; field.style.boxShadow = '';
        if (!field.value || !field.value.trim()) {
          valid = false;
          field.style.borderColor = 'rgba(239,68,68,.7)';
          field.style.boxShadow = '0 0 0 4px rgba(239,68,68,.12)';
        }
      });
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.style.borderColor = 'rgba(239,68,68,.7)';
        emailField.style.boxShadow = '0 0 0 4px rgba(239,68,68,.12)';
      }
      if (!valid) {
        if (hasGSAP && !reduceMotion) {
          gsap.fromTo(form, { x: -8 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: 'power2.inOut',
            onComplete: function () { gsap.set(form, { x: 0 }); } });
        }
        return;
      }
      const submitBtn = document.getElementById('contact-submit');
      if (submitBtn) {
        submitBtn.disabled = true; submitBtn.style.opacity = '0.7';
        submitBtn.querySelector('.relative').textContent = 'Sending…';
      }
      setTimeout(function () {
        if (successName) successName.textContent = nameField.value.split(' ')[0] || nameField.value;
        if (successEmail) successEmail.textContent = emailField.value;
        form.classList.add('hidden'); success.classList.remove('hidden');
        if (submitBtn) {
          submitBtn.disabled = false; submitBtn.style.opacity = '';
          submitBtn.querySelector('.relative').textContent = 'Send Message';
        }
        if (hasGSAP && !reduceMotion) {
          gsap.fromTo(success, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
      }, 900);
    });
  }

  /* 6. 5-IMAGE SCROLL-REVEAL */
  (function initReveal() {
    const section = document.getElementById('immersion');
    const pin = document.getElementById('reveal-pin');
    const layers = [
      document.getElementById('reveal-layer-1'),
      document.getElementById('reveal-layer-2'),
      document.getElementById('reveal-layer-3'),
      document.getElementById('reveal-layer-4'),
      document.getElementById('reveal-layer-5')
    ];
    const contentInner = document.getElementById('reveal-content-inner');
    const titleEl = document.getElementById('reveal-title');
    const subEl = document.getElementById('reveal-sub');
    const captionText = document.getElementById('reveal-caption-text');
    const stepEl = document.getElementById('reveal-step');
    const dots = document.querySelectorAll('.reveal-dot');
    if (!section || !pin || layers.some(function (l) { return !l; })) return;
    if (!hasGSAP || !hasST || reduceMotion) {
      section.style.height = 'auto';
      layers[0].style.display = 'none'; layers[1].style.display = 'none';
      layers[2].style.display = 'none'; layers[3].style.display = 'none';
      layers[4].style.display = 'block';
      return;
    }
    const STEPS = [
      { step: '01 / 05', caption: 'Cyber mesh · NexusAI reasoning grid',
        title: 'Every layer of your stack, <span class="text-accent-gradient">understood.</span>',
        sub: 'Scroll to peel back the surface. NexusAI moves from global reasoning infrastructure, through the humans who build it, down to the machines that ship it — one continuous layer at a time.' },
      { step: '02 / 05', caption: 'Human intent · developers steer the agent',
        title: 'Built by humans, <span class="text-accent-gradient">amplified by machine.</span>',
        sub: 'Your engineers stay in the driver\u2019s seat. NexusAI handles the execution \u2014 PRs, tests, migrations and reviews \u2014 at machine speed.' },
      { step: '03 / 05', caption: 'Premium workspace · where craft meets code',
        title: 'A workspace that <span class="text-accent-gradient">thinks with you.</span>',
        sub: 'NexusAI lives inside your editor and reads your entire monorepo in real time. It knows your patterns, your conventions, and your edge cases.' },
      { step: '04 / 05', caption: 'Futuristic AI · multi-hop reasoning graph',
        title: 'A reasoning engine <span class="text-accent-gradient">built for scale.</span>',
        sub: 'Every change is simulated across your entire dependency graph before a single line is written. Multi-hop, deterministic, and fully auditable.' },
      { step: '05 / 05', caption: 'Neon workspace · autonomous delivery',
        title: 'One agent. <span class="text-accent-gradient">Every layer of your stack.</span>',
        sub: 'From global reasoning infrastructure down to the laptop on your desk \u2014 NexusAI is one continuous, autonomous engineering layer.' }
    ];
    layers.forEach(function (layer, i) { gsap.set(layer, { opacity: 1, scale: 1, zIndex: (5 - i) * 10 }); });
    function setActiveDot(idx) { dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); }); }
    function applyStep(idx) {
      const s = STEPS[idx];
      if (stepEl) stepEl.textContent = s.step;
      if (captionText) captionText.textContent = s.caption;
      if (titleEl) titleEl.innerHTML = s.title;
      if (subEl) subEl.textContent = s.sub;
      setActiveDot(idx);
    }
    applyStep(0);
    const PHASE = 0.25;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, pin: pin, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true }
    });
    for (let i = 0; i < 4; i++) {
      const startAt = i * PHASE;
      const layerOut = layers[i];
      tl.to(layerOut, { opacity: 0, scale: 1.06, duration: PHASE * 0.85 }, startAt);
      tl.to(contentInner, { opacity: 0, y: -20, duration: PHASE * 0.35 }, startAt + PHASE * 0.30);
      tl.call(function () { applyStep(i + 1); }, [], startAt + PHASE * 0.55);
      tl.to(contentInner, { opacity: 1, y: 0, duration: PHASE * 0.30 }, startAt + PHASE * 0.60);
    }
    tl.to({}, { duration: 0.02 }, 0.98);
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  })();

  /* 7. GSAP ENTRANCE + SCROLL */
  if (hasGSAP && !reduceMotion) {
    gsap.from('#nav > div', { y: -70, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1 });
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 });
    heroTl
      .from('.hero-badge', { y: 22, opacity: 0, duration: 0.7 })
      .from('.hero-title .line', { y: 48, opacity: 0, duration: 0.95, stagger: 0.13 }, '-=0.42')
      .from('.hero-copy', { y: 26, opacity: 0, duration: 0.8 }, '-=0.62')
      .from('.hero-cta > *', { y: 24, opacity: 0, duration: 0.75, stagger: 0.1 }, '-=0.58')
      .from('.hero-trust', { y: 20, opacity: 0, duration: 0.75 }, '-=0.55')
      .from('.terminal-wrap', { y: 48, opacity: 0, scale: 0.965, duration: 1.1 }, '-=1.25');
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 36 });
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    const bentoCards = gsap.utils.toArray('.bento-card');
    if (bentoCards.length) {
      gsap.set(bentoCards, { opacity: 0, y: 44 });
      ScrollTrigger.batch(bentoCards, {
        start: 'top 90%', once: true,
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', overwrite: true });
        }
      });
    }
    gsap.to('.float-slow', { yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: 1.2 } });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } else {
    document.querySelectorAll('[data-reveal], .bento-card').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }

  /* 8. BENTO HOVER GLOW */
  document.querySelectorAll('.bento-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  /* 9. PRICING TOGGLE */
  const PRICING = {
    monthly: {
      hobby: { price: 0, note: 'free forever · no card required' },
      pro: { price: 29, note: 'billed monthly · cancel anytime' },
      ent: { price: 99, note: 'billed monthly · per seat' }
    },
    yearly: {
      hobby: { price: 0, note: 'free forever · no card required' },
      pro: { price: 19, note: 'per month, billed annually · save $120/yr' },
      ent: { price: 79, note: 'per month, billed annually · save $240/yr' }
    }
  };
  const btnMonthly = document.getElementById('btn-monthly');
  const btnYearly = document.getElementById('btn-yearly');
  const togglePill = document.getElementById('toggle-pill');
  const priceEls = {
    hobby: document.getElementById('price-hobby'),
    pro: document.getElementById('price-pro'),
    ent: document.getElementById('price-ent')
  };
  const noteEls = {
    hobby: document.getElementById('note-hobby'),
    pro: document.getElementById('note-pro'),
    ent: document.getElementById('note-ent')
  };
  const currentPrices = { hobby: 0, pro: 29, ent: 99 };
  let billingMode = 'monthly';

  function countTo(el, from, to) {
    if (!el) return;
    if (from === to) { el.textContent = String(to); return; }
    if (!hasGSAP || reduceMotion) { el.textContent = String(to); return; }
    const proxy = { value: from };
    gsap.to(proxy, {
      value: to, duration: 0.65, ease: 'power2.out',
      onUpdate: function () { el.textContent = String(Math.round(proxy.value)); },
      onComplete: function () { el.textContent = String(to); }
    });
  }
  function swapNote(el, text) {
    if (!el) return;
    if (!hasGSAP || reduceMotion) { el.textContent = text; return; }
    gsap.to(el, {
      opacity: 0, y: -6, duration: 0.18, ease: 'power2.in',
      onComplete: function () {
        el.textContent = text;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
      }
    });
  }
  function applyBilling(mode) {
    if (mode === billingMode) return;
    billingMode = mode;
    const data = PRICING[mode];
    ['hobby', 'pro', 'ent'].forEach(function (key) {
      const target = data[key].price;
      countTo(priceEls[key], currentPrices[key], target);
      currentPrices[key] = target;
      swapNote(noteEls[key], data[key].note);
    });
    if (togglePill) togglePill.classList.toggle('is-yearly', mode === 'yearly');
    if (btnMonthly && btnYearly) {
      if (mode === 'monthly') {
        btnMonthly.classList.add('is-active'); btnMonthly.classList.remove('is-inactive');
        btnYearly.classList.add('is-inactive'); btnYearly.classList.remove('is-active');
        btnMonthly.setAttribute('aria-pressed', 'true');
        btnYearly.setAttribute('aria-pressed', 'false');
      } else {
        btnYearly.classList.add('is-active'); btnYearly.classList.remove('is-inactive');
        btnMonthly.classList.add('is-inactive'); btnMonthly.classList.remove('is-active');
        btnYearly.setAttribute('aria-pressed', 'true');
        btnMonthly.setAttribute('aria-pressed', 'false');
      }
    }
  }
  if (btnMonthly && btnYearly && togglePill) {
    btnMonthly.addEventListener('click', function () { applyBilling('monthly'); });
    btnYearly.addEventListener('click', function () { applyBilling('yearly'); });
  }

  /* 10. VIDEO AUTOPLAY */
  ['video-one'].forEach(function (id) {
    const vid = document.getElementById(id);
    if (!vid) return;
    const tryPlay = function () {
      const p = vid.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    };
    vid.addEventListener('loadeddata', tryPlay);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tryPlay(); });
    tryPlay();
  });

  /* 11. FAQ ACCORDION */
  const faqItems = document.querySelectorAll('#faq details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* 12. SMOOTH ANCHOR SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navOffset = 92;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', href);
    });
  });

})();