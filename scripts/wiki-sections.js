(() => {
  const root = document.querySelector('[data-wiki-document] .post-content');
  if (!root) return;
  const headings = Array.from(root.querySelectorAll('[data-wiki-depth]'));
  const sections = new Map();
  const byHeading = new Map();
  let searchState;
  const copy = (key, fallback) => window.siteIdentity?.get(`wiki.${key}`, fallback) || fallback;
  const book = (open) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${open
    ? '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>'
    : '<path d="M5 3h15v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v14h15M3 19a2 2 0 0 1 2-2M9 7h7"/>'}</svg>`;

  const isOpen = (section) => section.details ? section.details.open : !section.body.hasAttribute('hidden');
  const update = (section) => {
    const open = isOpen(section);
    section.button.setAttribute('aria-expanded', String(open));
    section.icon.innerHTML = book(open);
    section.label.textContent = open ? copy('collapse_section', '접기') : copy('expand_section', '열기');
    section.button.setAttribute('aria-label', `${section.title}: ${section.label.textContent}`);
  };
  const setOpen = (section, open) => {
    if (section.details) section.details.open = open;
    else if (open) section.body.removeAttribute('hidden');
    else section.body.setAttribute('hidden', 'onbeforematch' in document.documentElement ? 'until-found' : '');
    update(section);
  };

  // Give every heading its own content measure. This keeps paragraphs, lists,
  // quotes, tables, and images aligned with their heading's hierarchy. The
  // second wiki level starts indentation. Each wrapper adds only the distance
  // from its parent, so nested sections never compound absolute offsets.
  const wrapHeadingContent = () => {
    headings.slice().reverse().forEach((heading) => {
      const parent = heading.parentElement;
      if (!parent) return;
      const depth = Number(heading.dataset.wikiDepth);
      const body = document.createElement('div');
      body.className = 'wiki-heading-content';
      body.dataset.wikiContentDepth = String(depth);
      let previous = heading.previousElementSibling;
      while (previous && (!previous.matches('[data-wiki-depth]') || Number(previous.dataset.wikiDepth) >= depth)) previous = previous.previousElementSibling;
      const parentDepth = previous ? Number(previous.dataset.wikiDepth) : 1;
      const indent = Math.max(0, depth - parentDepth);
      heading.style.setProperty('--wiki-indent-steps', indent);
      body.style.setProperty('--wiki-indent-steps', indent);
      heading.after(body);
      let sibling = body.nextSibling;
      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.matches('[data-wiki-depth]')) {
          const nextDepth = Number(sibling.dataset.wikiDepth);
          if (nextDepth <= depth) break;
        }
        const next = sibling.nextSibling;
        body.append(sibling);
        sibling = next;
      }
    });
  };

  wrapHeadingContent();

  // Work from the deepest/latest section upwards so parent sections contain
  // already assembled children. A container boundary also ends its section.
  headings.slice().reverse().forEach((heading, index) => {
    if (!heading.hasAttribute('data-wiki-fold')) return;
    const body = document.createElement('div');
    body.className = 'wiki-section-body';
    let id = `wiki-fold-${index + 1}`;
    while (document.getElementById(id)) id += '-section';
    body.id = id;
    const depth = Number(heading.dataset.wikiDepth);
    let sibling = heading.nextSibling;
    heading.after(body);
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.matches('h1,h2,h3,h4,h5,h6')) {
        const nextDepth = Number(sibling.dataset.wikiDepth || Number(sibling.tagName.slice(1)) - 1);
        if (nextDepth <= depth) break;
      }
      const next = sibling.nextSibling;
      body.append(sibling);
      sibling = next;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wiki-section-toggle';
    button.setAttribute('aria-controls', body.id);
    button.setAttribute('data-wiki-no-autolink', '');
    const icon = document.createElement('span');
    const label = document.createElement('span');
    label.setAttribute('data-no-interface-translation', '');
    button.append(icon, label);
    const section = { heading, title: heading.textContent.trim(), body, button, icon, label };
    sections.set(body, section);
    byHeading.set(heading, section);
    heading.append(button);
    setOpen(section, false);
    button.addEventListener('click', () => {
      setOpen(section, body.hasAttribute('hidden'));
      if (searchState) searchState.set(section, isOpen(section));
    });
    body.addEventListener('beforematch', () => reveal(body));
  });

  // Icon-only buttons keep UI wording out of heading text and generated indexes.
  const copyButtons = [];
  const notice = document.createElement('div');
  notice.className = 'wiki-copy-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  document.body.append(notice);
  const dialog = document.createElement('dialog');
  dialog.className = 'wiki-copy-dialog';
  dialog.setAttribute('aria-labelledby', 'wiki-copy-help');
  const help = document.createElement('p');
  help.id = 'wiki-copy-help';
  const address = document.createElement('input');
  address.type = 'text';
  address.readOnly = true;
  address.setAttribute('data-no-interface-translation', '');
  const close = document.createElement('button');
  close.type = 'button';
  dialog.append(help, address, close);
  document.body.append(dialog);
  let originButton;
  let noticeTimer;
  const localizeCopy = () => {
    copyButtons.forEach(({ button, title }) => {
      const label = copy('copy_section', '{title}: 절 주소 복사').replace('{title}', title);
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    help.textContent = copy('copy_fallback', '아래 주소를 선택하여 복사하세요.');
    address.setAttribute('aria-label', copy('copy_address', '복사할 절 주소'));
    close.textContent = copy('copy_close', '닫기');
    if (notice.textContent) notice.textContent = copy('copy_success', '주소를 복사했습니다');
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => originButton?.focus({ preventScroll: true }));
  address.addEventListener('click', () => address.select());
  headings.filter(heading => heading.id && !heading.closest('.footnotes, .wiki-toc, .wiki-backlinks, .wiki-detail-pages, .wiki-summary')).forEach(heading => {
    const titleNode = heading.cloneNode(true);
    titleNode.querySelectorAll('button, .wiki-heading-number').forEach(node => node.remove());
    const title = titleNode.textContent.trim();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wiki-section-copy';
    button.setAttribute('data-wiki-no-autolink', '');
    button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/></svg>';
    button.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.search = '';
      url.hash = encodeURIComponent(heading.id);
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
        clearTimeout(noticeTimer);
        notice.textContent = copy('copy_success', '주소를 복사했습니다');
        noticeTimer = setTimeout(() => { notice.textContent = ''; }, 2500);
      } catch {
        originButton = button;
        address.value = url.href;
        dialog.showModal();
        address.focus({ preventScroll: true });
        address.select();
      }
    });
    copyButtons.push({ button, title });
    heading.append(button);
  });
  localizeCopy();
  window.addEventListener('site-preference-change', localizeCopy);

  // Preserve native details/summary markup, keyboard control and initial open
  // state. Its indicator uses the same books and labels as heading folds.
  root.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    const title = summary.textContent.trim();
    const indicator = document.createElement('span');
    indicator.className = 'wiki-section-toggle';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.setAttribute('data-wiki-no-autolink', '');
    const icon = document.createElement('span');
    const label = document.createElement('span');
    label.setAttribute('data-no-interface-translation', '');
    indicator.append(icon, label);
    summary.append(indicator);
    details.classList.add('wiki-legacy-fold');
    const section = { details, body: details, button: summary, title, icon, label };
    sections.set(details, section);
    update(section);
    details.addEventListener('toggle', () => update(section));
    summary.addEventListener('click', () => {
      if (searchState) searchState.set(section, !details.open);
    });
  });

  function reveal(target) {
    for (let node = target; node && node !== root; node = node.parentElement) {
      if (sections.has(node)) setOpen(sections.get(node), true);
      if (node.matches('details')) node.open = true;
    }
    if (byHeading.has(target)) setOpen(byHeading.get(target), true);
  }
  root.addEventListener('wiki-find-start', () => {
    if (!searchState) searchState = new Map(Array.from(sections.values(), section => [section, isOpen(section)]));
  });
  root.addEventListener('wiki-find-reveal', event => reveal(event.detail));
  root.addEventListener('wiki-find-end', () => {
    searchState?.forEach((open, section) => setOpen(section, open));
    searchState = null;
  });
  const hashTarget = (hash) => {
    try { return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; }
    catch { return null; }
  };
  const pageToc = document.querySelector('[data-wiki-page-toc]');
  const revealPageTocTarget = (target) => {
    if (!pageToc?.contains(target)) return false;
    pageToc.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'center' }));
    return true;
  };
  const revealHash = () => {
    const target = hashTarget(location.hash);
    if (!target) return;
    if (revealPageTocTarget(target)) return;
    if (!root.contains(target)) return;
    reveal(target);
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const target = hashTarget(url.hash);
    if (target && link.matches('.wiki-heading-number-link') && revealPageTocTarget(target)) return;
    if (target && root.contains(target)) {
      if (pageToc && link.matches('.wiki-toc-number') && link.closest('[data-wiki-page-toc]') === pageToc) {
        pageToc.open = true;
      }
      reveal(target);
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }, true);
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('site-preference-change', () => sections.forEach(update));
  let tocPrintState;
  let printState;
  window.addEventListener('beforeprint', () => {
    if (printState) return;
    tocPrintState = pageToc?.open;
    if (pageToc) pageToc.open = true;
    printState = Array.from(sections.values()).map(section => [section, isOpen(section)]);
    sections.forEach(section => setOpen(section, true));
  });
  window.addEventListener('afterprint', () => {
    printState?.forEach(([section, open]) => setOpen(section, open));
    if (pageToc && tocPrintState !== undefined) pageToc.open = tocPrintState;
    tocPrintState = undefined;
    printState = null;
  });
  revealHash();
})();
