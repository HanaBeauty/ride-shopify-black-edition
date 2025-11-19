(function() {
  const ready = (cb) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  };

  const rotateTopBar = () => {
    document.querySelectorAll('[data-maquia-topbar]')?.forEach((bar) => {
      const messages = bar.querySelectorAll('[data-topbar-message]');
      if (!messages.length) return;
      let index = 0;
      const interval = parseInt(bar.dataset.interval, 10) || 8000;
      messages.forEach((msg, idx) => { msg.style.display = idx === 0 ? 'inline-flex' : 'none'; });
      setInterval(() => {
        messages[index].style.display = 'none';
        index = (index + 1) % messages.length;
        messages[index].style.display = 'inline-flex';
      }, interval);
    });
  };

  const initCarousel = () => {
    document.querySelectorAll('[data-maquia-carousel]')?.forEach((carousel) => {
      const track = carousel.querySelector('[data-carousel-track]');
      const prev = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      if (!track) return;
      const scrollAmount = track.firstElementChild?.getBoundingClientRect().width || 280;
      prev?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    });
  };

  const initDrawer = () => {
    const toggles = document.querySelectorAll('[data-maquia-cart-toggle]');
    const drawer = document.querySelector('[data-maquia-drawer]');
    if (!drawer || !toggles.length) return;
    const overlay = drawer.querySelector('[data-maquia-overlay]');
    const closeBtn = drawer.querySelector('[data-maquia-close]');
    const progress = drawer.querySelector('[data-progress-bar]');
    const target = parseFloat(drawer.dataset.freeShipping || '0');

    const updateProgress = () => {
      if (!progress || !target) return;
      const subtotal = parseFloat(drawer.dataset.cartSubtotal || '0');
      const percent = Math.min(100, Math.round((subtotal / target) * 100));
      progress.style.width = `${percent}%`;
      progress.ariaValueNow = percent;
    };

    const open = () => {
      drawer.classList.add('is-open');
      document.documentElement.classList.add('no-scroll');
      updateProgress();
    };
    const close = () => {
      drawer.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
    };

    toggles.forEach((toggle) => toggle.addEventListener('click', open));
    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);
  };

  const initPDPCountdown = () => {
    document.querySelectorAll('[data-countdown-end]')?.forEach((node) => {
      const endDate = new Date(node.dataset.countdownEnd);
      if (Number.isNaN(endDate)) return;
      const timer = setInterval(() => {
        const diff = endDate - new Date();
        if (diff <= 0) { node.textContent = node.dataset.expiredLabel || 'Oferta encerrada'; clearInterval(timer); return; }
        const hours = Math.floor(diff / 36e5);
        const minutes = Math.floor((diff % 36e5) / 6e4);
        const seconds = Math.floor((diff % 6e4) / 1000);
        node.textContent = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }, 1000);
    });
  };

  ready(() => {
    rotateTopBar();
    initCarousel();
    initDrawer();
    initPDPCountdown();
  });
})();
