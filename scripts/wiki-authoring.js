(() => {
  const copy = (key) => window.siteIdentity?.get(`wiki.${key}`, '') || '';
  const applyPlatforms = root => window.platformLinks?.apply(root);

  // Links always navigate normally. A separate button provides unambiguous touch/keyboard previews.
  const panel = document.createElement('aside');
  panel.className = 'wiki-preview';
  panel.id = 'wiki-link-preview';
  panel.hidden = true;
  panel.setAttribute('aria-label', copy('preview'));
  const heading = document.createElement('strong');
  const body = document.createElement('p');
  heading.setAttribute('data-no-interface-translation', '');
  body.setAttribute('data-no-interface-translation', '');
  const openLink = document.createElement('a');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  panel.append(heading, body, openLink, closeButton);
  document.body.append(panel);
  let active = null;
  let timer;
  const close = (restore = false) => {
    clearTimeout(timer);
    if (!active) return;
    const previous = active;
    active = null;
    panel.hidden = true;
    previous.button.setAttribute('aria-expanded', 'false');
    if (restore) previous.button.focus();
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
  const show = (item, focus = false) => {
    clearTimeout(timer);
    if (active && active !== item) active.button.setAttribute('aria-expanded', 'false');
    active = item;
    heading.textContent = item.title;
    body.textContent = item.description || copy('no_description');
    openLink.href = item.link.href;
    openLink.textContent = copy('preview_open');
    closeButton.textContent = copy('preview_close');
    panel.hidden = false;
    item.button.setAttribute('aria-expanded', 'true');
    position();
    if (focus) closeButton.focus({ preventScroll: true });
  };
  const scheduleClose = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!panel.matches(':hover') && !panel.contains(document.activeElement)
          && !active?.link.matches(':hover') && document.activeElement !== active?.link
          && document.activeElement !== active?.button) close();
    }, 220);
  };
  panel.addEventListener('pointerenter', () => clearTimeout(timer));
  panel.addEventListener('pointerleave', scheduleClose);
  panel.addEventListener('focusout', scheduleClose);
  closeButton.addEventListener('click', () => close(true));
  openLink.addEventListener('click', (event) => {
    if (active?.link.matches('a.footnote') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      active.link.click();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active) { event.preventDefault(); close(panel.contains(document.activeElement)); }
  });
  document.addEventListener('pointerdown', (event) => {
    if (active && !panel.contains(event.target) && event.target !== active.button && !active.link.contains(event.target)) close();
  });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, { passive: true });
  const enhancePreviews = (entries = []) => {
    const pageKey = (url) => window.wikiAutolinks?.pageKey(url) || url.origin + url.pathname;
    const catalog = new Map(entries.map((entry) => [pageKey(new URL(entry.url, location.href)), entry]));
    document.querySelectorAll('.wiki-article a[href]').forEach((link) => {
      if (link.hasAttribute('data-preview-ready') || link.closest('.platform-badge')) return;
      let title, description;
      if (link.matches('a.footnote')) {
        let target;
        try { target = document.getElementById(decodeURIComponent(new URL(link.href).hash.slice(1))); } catch { return; }
        if (!target) return;
        const clone = target.cloneNode(true);
        clone.querySelectorAll('.reversefootnote, .post-endnote-number-link').forEach((node) => node.remove());
        title = target.getAttribute('aria-label') || link.textContent;
        description = clone.textContent.replace(/\s+/g, ' ').trim();
      } else {
        let key;
        try { key = pageKey(new URL(link.href)); } catch { return; }
        if (key === pageKey(new URL(location.href))) return;
        const entry = catalog.get(key);
        if (!entry) return;
        title = entry.title;
        description = entry.description;
      }
      link.dataset.previewReady = '';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'wiki-preview-trigger';
      button.textContent = 'ⓘ';
      button.setAttribute('aria-label', `${title} — ${copy('preview')}`);
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-expanded', 'false');
      link.after(button);
      const item = { link, button, title, description };
      button.addEventListener('click', () => active === item && !panel.hidden ? close() : show(item, true));
      link.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') show(item); });
      link.addEventListener('pointerleave', scheduleClose);
      link.addEventListener('focus', () => show(item));
      link.addEventListener('blur', scheduleClose);
      button.addEventListener('blur', scheduleClose);
      link.addEventListener('click', () => close());
    });
  };
  window.wikiAuthoring = { applyPlatforms, enhancePreviews };
  enhancePreviews();
})();
