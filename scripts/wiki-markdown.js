((global) => {
  const normalizeHeading = value => String(value).normalize('NFC').trim().replace(/\s+/gu, ' ');

  const headingText = heading => {
    const copy = heading.cloneNode(true);
    copy.querySelectorAll('.wiki-heading-number, button').forEach(number => number.remove());
    return normalizeHeading(copy.textContent);
  };

  const resolveHeadingLinks = root => {
    if (!root) return [];
    const headings = Array.from(root.querySelectorAll('h2,h3,h4,h5,h6,[role="heading"]'))
      .filter(heading => heading.id && (root.classList?.contains('post-content') || heading.closest('.post-content')));
    const byTitle = new Map();
    headings.forEach((heading) => {
      const title = headingText(heading);
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(heading);
    });

    const diagnostics = [];
    root.querySelectorAll('[data-wiki-heading-target]').forEach((placeholder) => {
      const requested = normalizeHeading(placeholder.dataset.wikiHeadingTarget);
      const matches = byTitle.get(requested) || [];
      if (!matches.length) {
        if (placeholder.tagName === 'A') {
          const plain = root.ownerDocument.createElement('span');
          Array.from(placeholder.attributes).forEach(({ name, value }) => {
            if (name !== 'href') plain.setAttribute(name, value);
          });
          plain.classList.remove('wiki-heading-link');
          plain.replaceChildren(...placeholder.childNodes);
          placeholder.replaceWith(plain);
          placeholder = plain;
        }
        placeholder.dataset.wikiHeadingStatus = 'missing';
        diagnostics.push({ type: 'missing', target: requested, element: placeholder });
        return;
      }

      if (placeholder.closest('a') && placeholder.tagName !== 'A') return;
      const link = root.ownerDocument.createElement('a');
      Array.from(placeholder.attributes).forEach(({ name, value }) => link.setAttribute(name, value));
      link.classList.add('wiki-heading-link');
      link.href = `#${encodeURIComponent(matches[0].id)}`;
      link.dataset.wikiHeadingStatus = matches.length > 1 ? 'duplicate' : 'resolved';
      link.replaceChildren(...placeholder.childNodes);
      placeholder.replaceWith(link);
      if (matches.length > 1) diagnostics.push({
        type: 'duplicate', target: requested, count: matches.length, heading: matches[0], element: link,
      });
    });

    root.dispatchEvent(new CustomEvent('wiki-heading-diagnostics', { detail: diagnostics }));
    return diagnostics;
  };

  const api = { normalizeHeading, headingText, resolveHeadingLinks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    global.wikiMarkdown = api;
    document.querySelectorAll('.wiki-article').forEach(resolveHeadingLinks);
  }
})(typeof window === 'undefined' ? globalThis : window);
