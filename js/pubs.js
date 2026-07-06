document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.pub-item');
  if (!buttons.length) return;

  // Publication filter
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        const type = item.getAttribute('data-type');
        item.style.display = (filter === 'all' || type === filter) ? '' : 'none';
      });
    });
  });

  // Citation impact bars
  const citeEls = [...document.querySelectorAll('.pub-cites .n')];
  const numericCites = citeEls.map(el => parseInt(el.textContent) || 0);
  const maxCites = Math.max(...numericCites, 1);

  citeEls.forEach((el, i) => {
    const n = numericCites[i];
    if (n <= 0) return;
    const bar = document.createElement('div');
    bar.className = 'cite-bar';
    bar.innerHTML = `<div class="cite-bar-fill" data-pct="${Math.round(n / maxCites * 100)}"></div>`;
    el.parentElement.appendChild(bar);
  });

  // Animate bars when they scroll into view
  const fills = document.querySelectorAll('.cite-bar-fill');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute('data-pct') + '%';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    fills.forEach(f => obs.observe(f));
  } else {
    fills.forEach(f => { f.style.width = f.getAttribute('data-pct') + '%'; });
  }
});
