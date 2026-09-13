(() => {
  const copy = (key) => window.siteIdentity?.get(`wiki.${key}`, '') || '';
  const applyPlatforms = root => window.platformLinks?.apply(root);

  // The link itself opens the preview on hover or keyboard focus.
  const panel = document.createElement('aside');
  panel.className = 'wiki-preview';
  panel.id = 'wiki-link-preview';
  panel.hidden = true;
  panel.setAttribute('aria-label', copy('preview'));
  const heading = document.createElement('strong');
  const body = document.createElement('p');
  heading.setAttribute('data-no-interface-translation', '');
  body.setAttribute('data-no-interface-translation', '');
  panel.append(heading, body);
  document.body.append(panel);
  let active = null;
  let timer;
  const close = (restore = false) => {
    clearTimeout(timer);
    if (!active) return;
    const previous = active;
    active = null;
    panel.hidden = true;
    previous.link.removeAttribute('aria-details');
    if (restore) previous.link.focus();
  };
  const position = () => {
    if (!active) return;
    const viewportWidth = document.documentElement.clientWidth;
    panel.style.maxWidth = `${viewportWidth - 16}px`;
    const rect = active.link.getBoundingClientRect();
    const bounds = panel.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, viewportWidth - bounds.width - 8));
    const top = rect.bottom + bounds.height + 8 <= innerHeight ? rect.bottom + 6 : Math.max(8, rect.top - bounds.height - 6);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  };
  const show = (item) => {
    clearTimeout(timer);
    if (active && active !== item) active.link.removeAttribute('aria-details');
    active = item;
    heading.textContent = item.title;
    body.textContent = item.description || copy('no_description');
    panel.setAttribute('aria-label', item.title);
    panel.hidden = false;
    item.link.setAttribute('aria-details', panel.id);
    position();
  };
  const scheduleClose = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!panel.matches(':hover') && !panel.contains(document.activeElement)
          && !active?.link.matches(':hover') && document.activeElement !== active?.link) close();
    }, 220);
  };
  panel.addEventListener('pointerenter', () => clearTimeout(timer));
  panel.addEventListener('pointerleave', scheduleClose);
  panel.addEventListener('focusout', scheduleClose);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active) { event.preventDefault(); close(panel.contains(document.activeElement)); }
  });
  document.addEventListener('pointerdown', (event) => {
    if (active && !panel.contains(event.target) && !active.link.contains(event.target)) close();
  });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, { passive: true });
  const enhancePreviews = (entries = []) => {
    const pageKey = (url) => window.wikiAutolinks?.pageKey(url) || url.origin + url.pathname;
    const catalog = new Map(entries.map((entry) => [pageKey(new URL(entry.url, location.href)), entry]));
    document.querySelectorAll('.wiki-article a[href]').forEach((link) => {
      if (link.matches('a.footnote, a.reversefootnote, .post-endnote-number-link') || link.hasAttribute('data-preview-ready') || link.closest('.platform-badge')) return;
      let title, description;
      {
        let key;
        try { key = pageKey(new URL(link.href)); } catch { return; }
        if (key === pageKey(new URL(location.href))) return;
        const entry = catalog.get(key);
        if (!entry) return;
        title = entry.title;
        description = entry.description;
      }
      link.dataset.previewReady = '';
      const item = { link, title, description };
      link.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') show(item); });
      link.addEventListener('pointerleave', scheduleClose);
      link.addEventListener('focus', () => show(item));
      link.addEventListener('blur', scheduleClose);
      link.addEventListener('click', () => close());
    });
  };
  window.wikiAuthoring = { applyPlatforms, enhancePreviews };
  enhancePreviews();
})();
