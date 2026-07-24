// ===========================================================
// Shared site behavior: nav toggle, scroll-reveal, GitHub stats,
// hero canvas animation, back-to-top
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Live GitHub repo stats (stars / primary language)
  document.querySelectorAll('[data-repo]').forEach(async (card) => {
    const repo = card.getAttribute('data-repo');
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (!res.ok) return;
      const data = await res.json();
      const starEl = card.querySelector('[data-star]');
      const langEl = card.querySelector('[data-lang]');
      if (starEl) starEl.textContent = data.stargazers_count ?? '0';
      if (langEl && data.language) langEl.textContent = data.language;
    } catch (err) {
      // silent fail — static fallback text remains
    }
  });

  // Hero canvas — animated graph particle network
  initHeroCanvas();

  // Back-to-top button (injected dynamically)
  const btn = document.createElement('button');
  btn.id = 'back-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8679;';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 320);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  const COLORS = ['76,95,213', '11,114,133', '232,89,12'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeNodes() {
    nodes = Array.from({ length: 28 }, (_, i) => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r:  Math.random() * 2.5 + 1.5,
      c:  COLORS[i % 3]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(11,114,133,${(0.13 * (1 - d / 160)).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(${n.c},0.18)`;
      ctx.strokeStyle = `rgba(${n.c},0.38)`;
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  makeNodes();
  draw();

  window.addEventListener('resize', () => { resize(); makeNodes(); }, { passive: true });
}
