(() => {
  const copy = (key) => window.siteIdentity?.get(`wiki.${key}`, '') || '';
  const applyPlatforms = root => window.platformLinks?.apply(root);

  const graphemeCount = (text) => {
    if (typeof Intl.Segmenter === 'function') return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)).length;
    return Array.from(text).length;
  };
  const naturalRpWidths = (ruby) => {
    // Native ruby layout gives both rows the wider row's allocated width. A
    // hidden clone keeps the same inherited font and icon styles while making
    // each row independently measurable.
    const clone = ruby.cloneNode(true);
    clone.classList.remove('wiki-rp-overflow');
    clone.setAttribute('aria-hidden', 'true');
    Object.assign(clone.style, {
      position: 'fixed',
      inset: '0 auto auto 0',
      display: 'inline-block',
      width: 'max-content',
      maxWidth: 'none',
      visibility: 'hidden',
      pointerEvents: 'none',
    });
    const base = clone.querySelector(':scope > .wiki-rp-base');
    const annotation = clone.querySelector(':scope > rt');
    base.style.setProperty('display', 'inline-block', 'important');
    annotation.style.setProperty('display', 'inline-block', 'important');
    ruby.after(clone);
    const widths = {
      base: base.getBoundingClientRect().width,
      annotation: annotation.getBoundingClientRect().width,
    };
    clone.remove();
    return widths;
  };
  const balanceRp = (ruby) => {
    const base = ruby.querySelector(':scope > .wiki-rp-base');
    const annotation = ruby.querySelector(':scope > rt');
    if (!base || !annotation) return;
    base.style.removeProperty('--wiki-rp-spacing');
    annotation.style.removeProperty('--wiki-rp-spacing');
    ruby.classList.remove('wiki-rp-overflow');
    const { base: baseWidth, annotation: annotationWidth } = naturalRpWidths(ruby);
    const [shorter, shorterWidth, longerWidth] = baseWidth < annotationWidth
      ? [base, baseWidth, annotationWidth] : [annotation, annotationWidth, baseWidth];
    const shorterKey = baseWidth < annotationWidth ? 'base' : 'annotation';
    const characters = graphemeCount(shorter.textContent.trim());
    if (characters > 1 && shorterWidth > 0 && longerWidth - shorterWidth > 0.5 && longerWidth / shorterWidth <= 1.35) {
      const fontSize = parseFloat(getComputedStyle(shorter).fontSize) || 16;
      const maximum = fontSize * 0.15;
      shorter.style.setProperty('--wiki-rp-spacing', `${maximum}px`);
      const expandedWidth = naturalRpWidths(ruby)[shorterKey];
      if (expandedWidth >= longerWidth - 0.5 && expandedWidth > shorterWidth) {
        const pixelsPerSpacing = (expandedWidth - shorterWidth) / maximum;
        let spacing = Math.min(maximum, (longerWidth - shorterWidth) / pixelsPerSpacing);
        shorter.style.setProperty('--wiki-rp-spacing', `${spacing}px`);
        const measuredWidth = naturalRpWidths(ruby)[shorterKey];
        spacing = Math.max(0, Math.min(maximum, spacing + (longerWidth - measuredWidth) / pixelsPerSpacing));
        shorter.style.setProperty('--wiki-rp-spacing', `${spacing}px`);
      } else {
        shorter.style.removeProperty('--wiki-rp-spacing');
      }
    }
    const viewportLimit = Math.max(0, Math.min(document.documentElement.clientWidth - 32, ruby.parentElement.clientWidth));
    ruby.classList.toggle('wiki-rp-overflow', Math.max(baseWidth, annotationWidth) > viewportLimit);
  };
  const enhanceRp = (root = document) => {
    const rubies = Array.from(root.querySelectorAll('ruby.wiki-rp'));
    rubies.forEach(balanceRp);
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(() => rubies.forEach(balanceRp));
      new Set(rubies.map(ruby => ruby.parentElement)).forEach(parent => observer.observe(parent));
    }
    document.fonts?.ready.then(() => rubies.forEach(balanceRp));
    document.fonts?.addEventListener('loadingdone', () => rubies.forEach(balanceRp));
    const mutations = new MutationObserver(() => rubies.forEach(balanceRp));
    rubies.forEach(ruby => mutations.observe(ruby, { childList: true, subtree: true, characterData: true }));
    return rubies;
  };

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
  window.wikiAuthoring = { applyPlatforms, enhancePreviews, enhanceRp };
  enhanceRp();
  enhancePreviews();
})();
