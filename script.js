
/* ===========================
   CrediSete — script.js
   =========================== */

// ─── Wait for GSAP ──────────────────────────────
window.addEventListener('load', () => {
  const gsapReady = typeof gsap !== 'undefined';

  // ─── Custom Cursor ────────────────────────────
  if (window.innerWidth > 768) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      fx += (mouseX - fx) * 0.1;
      fy += (mouseY - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
  }

  const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const pct = window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  progressBar.style.width=pct+'%';
},{passive:true});

  // ─── Nav scroll ──────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ─── Mobile nav ───────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  hamburger?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  }));

  // ─── Hero particles ──────────────────────────
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 30}%;
        animation-delay: ${Math.random() * 6}s;
        animation-duration: ${5 + Math.random() * 8}s;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        opacity: ${0.3 + Math.random() * 0.7};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ─── Coin Snow Effect ─────────────────────────
  const coinSnowContainer = document.body;
  const coinCount = window.innerWidth > 768 ? 40 : 25;
  for (let i = 0; i < coinCount; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'coin-wrapper';
    
    const coin = document.createElement('div');
    coin.className = 'coin-content';
    
    wrapper.appendChild(coin);
    
    wrapper.style.left = `${Math.random() * 100}vw`;
    wrapper.style.animationDuration = `${8 + Math.random() * 12}s`;
    wrapper.style.animationDelay = `${-Math.random() * 20}s`;
    
    const size = 16 + Math.random() * 12;
    coin.style.width = `${size}px`;
    coin.style.height = `${size}px`;
    coin.style.fontSize = `${size * 0.5}px`;
    
    // Aesthetic motion variation
    coin.style.animationDuration = `${3 + Math.random() * 3}s`;
    coin.style.animationDelay = `${Math.random() * 5}s`;
    
    coinSnowContainer.appendChild(wrapper);
  }

  // ─── GSAP Hero animations ────────────────────
  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero reveals
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: 0.15 + i * 0.12,
        ease: 'power3.out'
      });
    });

    // Parallax on hero grid
    gsap.to('#hero-grid', {
      y: -60,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Scroll-triggered reveals for sections
    gsap.utils.toArray('.cred-card, .feature-item, .cn-item').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7,
          delay: (i % 4) * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Sim section
    gsap.fromTo('.sim-left',
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.simulacao', start: 'top 75%' }
      }
    );
    gsap.fromTo('.sim-right',
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.simulacao', start: 'top 75%' }
      }
    );

  } else {
    // Fallback without GSAP
    document.querySelectorAll('.reveal-up').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  // ─── Counter animation ────────────────────────
  const counters = document.querySelectorAll('.cn-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value >= 1000
          ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k'
          : value;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target >= 1000
          ? (target / 1000).toFixed(0) + 'k'
          : target;
      };
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));


  // ─── Loan calculator removed ─────────────────

  // ─── Attendants data ─────────────────────────
  const attendants = [
    {
      name: 'Carlos Eduardo',
      role: 'Consultora de Crédito',
      whatsapp: '5531900000001',
      img: 'rep1.png'
    },
    {
      name: 'Mariana Silva',
      role: 'Gerente de Crédito',
      whatsapp: '5531900000002',
      img: 'rep2.png'
    },
    {
      name: 'Fernando Lima',
      role: 'Especialista Financeira',
      whatsapp: '5531900000003',
      img: 'rep3.png'
    }
  ];

  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel= document.getElementById('cursor-label');
  let mx=0,my=0,rx=0,ry=0;


  // ── LOADER ────────────────────────────────────
(function initLoader(){
  const bar=document.getElementById('loader-bar');
  const pct=document.getElementById('loader-pct');
  const loader=document.getElementById('loader');
  const lc=document.getElementById('loader-c');
  const ls=document.getElementById('loader-s');
 
  gsap.to([lc,ls],{y:'0%',duration:1.4,ease:'power4',stagger:.1,delay:.1});
 
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*12;
    if(p>=100){p=100;clearInterval(iv);}
    bar.style.width=p+'%';
    pct.textContent=Math.floor(p)+'%';
    if(p===100){
      setTimeout(()=>{
        const tl=gsap.timeline({onComplete:startSite});
        tl.to([lc,ls],{y:'-110%',stagger:.06,duration:.6,ease:'power4in'})
          .to(loader,{y:'-100%',duration:.9,ease:'power4in'},'-=.2');
      },300);
    }
  },80);
 
  function startSite(){
    loader.style.display='none';
    animateHero();
  }
})();


  // Placeholder SVGs with different accent colors
  const placeholderSVGs = [
    (name) => `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="att-svg">
      <defs>
        <radialGradient id="bg0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1a0505"/>
          <stop offset="100%" stop-color="#0d0d0d"/>
        </radialGradient>
      </defs>
      <rect width="200" height="260" fill="url(#bg0)" rx="12"/>
      <circle cx="100" cy="88" r="44" fill="#1f1f1f" stroke="#ff0000" stroke-width="1.5"/>
      <circle cx="100" cy="78" r="22" fill="#ff000022"/>
      <text x="100" y="85" text-anchor="middle" fill="#ff0000" font-size="26" font-family="Bebas Neue" letter-spacing="2">${name.split(' ').map(w=>w[0]).join('').slice(0,2)}</text>
      <path d="M30 240 C30 185 170 185 170 240" fill="#1f1f1f" stroke="#ff000033" stroke-width="1"/>
    </svg>`,
    (name) => `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="att-svg">
      <defs>
        <radialGradient id="bg1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#0a0a0a"/>
          <stop offset="100%" stop-color="#050505"/>
        </radialGradient>
      </defs>
      <rect width="200" height="260" fill="url(#bg1)" rx="12"/>
      <rect x="70" y="44" width="60" height="60" rx="30" fill="#161616" stroke="#ff0000" stroke-width="1.5"/>
      <circle cx="100" cy="74" r="20" fill="#ff000015"/>
      <text x="100" y="81" text-anchor="middle" fill="#ff0000" font-size="24" font-family="Bebas Neue" letter-spacing="2">${name.split(' ').map(w=>w[0]).join('').slice(0,2)}</text>
      <path d="M35 245 C35 188 165 188 165 245" fill="#161616" stroke="#ff000025"/>
      <circle cx="100" cy="74" r="44" fill="none" stroke="#ff000018" stroke-width="1" stroke-dasharray="4 4"/>
    </svg>`,
    (name) => `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="att-svg">
      <defs>
        <radialGradient id="bg2" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#120303"/>
          <stop offset="100%" stop-color="#080808"/>
        </radialGradient>
      </defs>
      <rect width="200" height="260" fill="url(#bg2)" rx="12"/>
      <polygon points="100,44 144,70 144,118 100,144 56,118 56,70" fill="#141414" stroke="#ff0000" stroke-width="1.5"/>
      <text x="100" y="103" text-anchor="middle" fill="#ff0000" font-size="26" font-family="Bebas Neue" letter-spacing="2">${name.split(' ').map(w=>w[0]).join('').slice(0,2)}</text>
      <path d="M28 248 C28 186 172 186 172 248" fill="#141414" stroke="#ff000028"/>
    </svg>`
  ];

  let currentAtt = 0;

  const attName = document.getElementById('att-name');
  const attImg = document.getElementById('att-img');
  const attCounter = document.getElementById('att-counter');
  const attDots = document.querySelectorAll('.att-dot');
  const card = document.getElementById('attendant-card');

  function updateAttendant(index, direction = 1) {
    const att = attendants[index];
    if (!att) return;

    // Animate out
    if (card) {
      card.style.opacity = '0';
      card.style.transform = `translateX(${direction * -30}px)`;
    }

    setTimeout(() => {
      if (attName) attName.textContent = att.name;

      // Update image
      if (attImg) {
        if (att.img) {
          attImg.innerHTML = `<img src="${att.img}" alt="${att.name}" />`;
        } else {
          attImg.innerHTML = placeholderSVGs[index % placeholderSVGs.length](att.name);
        }
      }

      // Update counter
      if (attCounter) attCounter.textContent = `${index + 1} / ${attendants.length}`;

      // Update dots
      attDots.forEach((dot, i) => dot.classList.toggle('active', i === index));

      // Animate in
      if (card) {
        card.style.transform = `translateX(${direction * 30}px)`;
        card.style.opacity = '0';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        });
      }
    }, 200);
  }

  document.getElementById('att-prev')?.addEventListener('click', () => {
    currentAtt = (currentAtt - 1 + attendants.length) % attendants.length;
    updateAttendant(currentAtt, -1);
  });

  document.getElementById('att-next')?.addEventListener('click', () => {
    currentAtt = (currentAtt + 1) % attendants.length;
    updateAttendant(currentAtt, 1);
  });

  // Init first attendant
  updateAttendant(0, 0);

  // ─── Mobile swipe support ────────────────────
  const attendantCard = document.getElementById('attendant-card');
  let startX = 0, currentX = 0, startTime = 0;

  attendantCard?.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startTime = Date.now();
  }, { passive: true });

  attendantCard?.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
  }, { passive: true });

  attendantCard?.addEventListener('touchend', () => {
    const deltaX = startX - currentX;
    const deltaTime = Date.now() - startTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    if (deltaTime < 500 && velocity > 0.1 && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe left -> next
        currentAtt = (currentAtt + 1) % attendants.length;
        updateAttendant(currentAtt, 1);
      } else {
        // Swipe right -> prev
        currentAtt = (currentAtt - 1 + attendants.length) % attendants.length;
        updateAttendant(currentAtt, -1);
      }
    }
  }, { passive: true });

  // ─── WhatsApp button (Open Modal) ────────────
  document.getElementById('btn-whatsapp')?.addEventListener('click', () => {
    const modal = document.getElementById('lead-modal');
    const targetAttName = document.getElementById('target-att-name');
    const att = attendants[currentAtt];
    
    if (targetAttName) targetAttName.textContent = att.name;
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // Modal Close Logic
  const closeModal = () => {
    const modal = document.getElementById('lead-modal');
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('lead-modal');
    if (e.target === modal) closeModal();
  });

  // Form Submission
  document.getElementById('lead-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const att = attendants[currentAtt];
    
    const getVal = (id) => document.getElementById(id)?.value || '';
    
    const data = {
      nome:   getVal('f-nome'),
      doc:    getVal('f-doc'),
      nasc:   getVal('f-nasc'),
      civil:  getVal('f-civil'),
      tel:    getVal('f-tel'),
      email:  getVal('f-email'),
      cep:    getVal('f-cep'),
      rua:    getVal('f-rua'),
      num:    getVal('f-num'),
      comp:   getVal('f-comp'),
      bairro: getVal('f-bairro'),
      cidade: getVal('f-cidade'),
      estado: getVal('f-estado')
    };

    const message = `*SOLICITAÇÃO DE ATENDIMENTO - MIG DIGITAL*\n\n` +
      `*DADOS PESSOAIS*\n` +
      `👤 *Nome:* ${data.nome}\n` +
      `📄 *CPF/CNPJ:* ${data.doc}\n` +
      `📅 *Nascimento:* ${data.nasc}\n` +
      `💍 *Est. Civil:* ${data.civil}\n\n` +
      `*CONTATO*\n` +
      `📱 *Telefone:* ${data.tel}\n` +
      `📧 *E-mail:* ${data.email}\n\n` +
      `*ENDEREÇO*\n` +
      `📍 *CEP:* ${data.cep}\n` +
      `🏠 *Rua:* ${data.rua}, ${data.num}\n` +
      `🏢 *Comp:* ${data.comp || 'N/A'}\n` +
      `🏙️ *Bairro:* ${data.bairro}\n` +
      `🌆 *Cidade:* ${data.cidade} - ${data.estado}`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${att.whatsapp}?text=${encodedMsg}`, '_blank');
    
    closeModal();
    e.target.reset();
  });

  // ─── Smooth scroll nav links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ─── Input hover glow removed ────────────────

});