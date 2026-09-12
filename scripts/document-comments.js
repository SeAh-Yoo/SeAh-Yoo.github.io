(() => {
  const giscusContainer = document.querySelector('[data-giscus-container]');

  if (giscusContainer) {
    let loaded = false;

    const loadGiscus = () => {
      if (loaded) {
        return;
      }

      loaded = true;
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      Object.entries(giscusContainer.dataset).forEach(([key, value]) => {
        if (key === 'giscusContainer') {
          return;
        }

        const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        script.setAttribute(`data-${attribute}`, value);
      });

      giscusContainer.appendChild(script);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadGiscus();
        }
      }, { rootMargin: '700px 0px' });

      observer.observe(giscusContainer);
    } else {
      loadGiscus();
    }
  }
})();
