(() => {
  const copy = (key) => window.siteIdentity?.get(`wiki.${key}`, '') || '';
  const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
  document.querySelectorAll('.wiki-entry-list').forEach((list) => {
    const entries = Array.from(list.children);
    entries.sort((a, b) => collator.compare(a.dataset.sortTitle, b.dataset.sortTitle));
    list.append(...entries);
  });

  const root = document.querySelector('[data-wiki-backlinks]');
  if (!root) return;
  const status = root.querySelector('[data-backlinks-status]');
  status.hidden = false;
  const list = root.querySelector('[data-backlinks-list]');
  let statusKey = 'backlinks_loading';
  const updateStatus = () => { status.textContent = copy(statusKey); };
  window.addEventListener('site-preference-change', updateStatus);

  const { pageKey, createCatalog, apply } = window.wikiAutolinks;
  const currentKey = pageKey(new URL(location.href));
  fetch(root.dataset.wikiIndex, { credentials: 'same-origin', cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`Wiki index request failed: ${response.status}`);
      return response.json();
    })
    .then((entries) => {
      const catalog = createCatalog(entries, location.href);
      apply(document.querySelector('.wiki-article .post-content'), catalog, location.href);
      const seen = new Set();
      const backlinks = entries.filter((entry) => {
        const source = new URL(entry.url, location.href);
        const sourceKey = pageKey(source);
        if (source.origin !== location.origin || sourceKey === currentKey || seen.has(sourceKey)) return false;
        // A template parses links without loading images or executing the indexed HTML.
        const template = document.createElement('template');
        template.innerHTML = entry.html;
        window.wikiAuthoring?.applyPlatforms(template.content);
        apply(template.content, catalog, source.href);
        const pointsHere = Array.from(template.content.querySelectorAll('a[href]')).some((link) => {
          try { return pageKey(new URL(link.getAttribute('href'), source)) === currentKey; }
          catch { return false; }
        });
        if (pointsHere) seen.add(sourceKey);
        return pointsHere;
      }).sort((a, b) => collator.compare(a.title, b.title));
      backlinks.forEach((entry) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.url;
        link.textContent = entry.title;
        item.append(link);
        list.append(item);
      });
      window.wikiAuthoring?.enhancePreviews(entries);
      statusKey = backlinks.length ? 'backlinks_found' : 'backlinks_empty';
      updateStatus();
    })
    .catch((error) => {
      console.warn(error);
      statusKey = 'backlinks_error';
      updateStatus();
    });
})();
