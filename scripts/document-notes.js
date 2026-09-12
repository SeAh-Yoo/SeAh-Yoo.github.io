(() => {
  const copy = (path, fallback = '') => window.siteIdentity?.get(path, fallback) ?? fallback;
  const formatCopy = (path, variables, fallback = '') => window.siteIdentity?.format(path, variables, fallback) ?? fallback;
  const normalizeReaderText = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  const revealAncestors = (target) => {
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.matches('details')) parent.open = true;
    }
  };
  const setTemporaryTargetState = (target) => {
    target.classList.add('is-footnote-target');
    window.clearTimeout(target.footnoteTargetTimeoutId);
    target.footnoteTargetTimeoutId = window.setTimeout(() => {
      target.classList.remove('is-footnote-target');
    }, 1800);
  };

  const getHashTarget = (href) => {
    if (!href) {
      return null;
    }

    try {
      const targetUrl = new URL(href, window.location.href);

      if (
        targetUrl.origin !== window.location.origin
        || targetUrl.pathname !== window.location.pathname
        || !targetUrl.hash
      ) {
        return null;
      }

      return document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
    } catch (error) {
      return null;
    }
  };

  const enhanceEndnotes = (root) => {
    const footnotes = root.querySelector('.footnotes');

    if (!footnotes) {
      return;
    }

    let heading = footnotes.querySelector('.post-endnotes-heading');

    if (!heading) {
      const header = document.createElement('div');
      const eyebrow = document.createElement('p');
      const help = document.createElement('p');

      heading = document.createElement('h2');
      heading.className = 'post-endnotes-heading';
      heading.id = 'post-endnotes';
      heading.textContent = copy('post.endnotes.title');
      heading.tabIndex = -1;

      header.className = 'post-endnotes-header';
      eyebrow.className = 'post-endnotes-eyebrow';
      eyebrow.textContent = copy('post.endnotes.kicker');
      help.className = 'post-endnotes-help';
      help.textContent = copy('post.endnotes.help');
      header.append(eyebrow, heading, help);
      footnotes.prepend(header);
    }

    footnotes.setAttribute('role', 'doc-endnotes');
    footnotes.setAttribute('aria-labelledby', heading.id);

    const getEndnoteNumber = (link, index) => {
      const matchedNumber = normalizeReaderText(link.textContent).match(/\d+/);

      return matchedNumber ? matchedNumber[0] : String(index + 1);
    };

    const focusHashTarget = (event) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const target = getHashTarget(event.currentTarget.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      const hash = `#${encodeURIComponent(target.id)}`;

      if (window.history && typeof window.history.pushState === 'function') {
        window.history.pushState(null, '', hash);
      } else {
        window.location.hash = target.id;
      }

      revealAncestors(target);
      if (!target.hasAttribute('tabindex')) {
        target.tabIndex = -1;
      }

      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }

      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
      setTemporaryTargetState(target);
    };

    root.querySelectorAll('a.footnote').forEach((link, index) => {
      const number = getEndnoteNumber(link, index);

      link.classList.add('post-endnote-reference');
      link.setAttribute('aria-label', formatCopy('post.endnotes.reference_link_label', { number }));
      link.setAttribute('title', formatCopy('post.endnotes.reference_link_label', { number }));
      link.setAttribute('role', 'doc-noteref');
      link.addEventListener('click', focusHashTarget);
    });

    footnotes.querySelectorAll(':scope > ol > li').forEach((item, index) => {
      item.setAttribute('role', 'doc-endnote');
      item.setAttribute('aria-label', formatCopy('post.endnotes.reference_item_label', { number: index + 1 }));
      item.tabIndex = -1;

      const backlink = item.querySelector('a.reversefootnote');

      if (backlink && !item.querySelector('.post-endnote-number-link')) {
        const numberLink = document.createElement('a');

        numberLink.className = 'post-endnote-number-link';
        numberLink.href = backlink.getAttribute('href');
        numberLink.textContent = String(index + 1);
        numberLink.setAttribute('aria-label', formatCopy('post.endnotes.backlink_label', { number: index + 1 }));
        numberLink.setAttribute('title', formatCopy('post.endnotes.backlink_label', { number: index + 1 }));
        numberLink.setAttribute('role', 'doc-backlink');
        numberLink.addEventListener('click', focusHashTarget);
        item.prepend(numberLink);
      }
    });

    footnotes.querySelectorAll('a.reversefootnote').forEach((link, index) => {
      const number = link.closest('li[role="doc-endnote"]')?.querySelector('.post-endnote-number-link')?.textContent || getEndnoteNumber(link, index);

      link.classList.add('post-endnote-backlink');
      link.setAttribute('aria-label', formatCopy('post.endnotes.backlink_label', { number }));
      link.setAttribute('title', formatCopy('post.endnotes.backlink_label', { number }));
      link.setAttribute('role', 'doc-backlink');
      link.addEventListener('click', focusHashTarget);
    });
  };


  const revealHash = () => {
    const target = getHashTarget(location.href);
    if (!target) return;
    revealAncestors(target);
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };
  // Capture also handles same-hash clicks, before the browser's default navigation.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = getHashTarget(link.href);
    if (target) revealAncestors(target);
  }, true);
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('popstate', revealHash);
  window.documentNotes = { enhance: enhanceEndnotes };
  const root = document.querySelector('article.post');
  if (root) enhanceEndnotes(root);
  revealHash();
})();
