(() => {
  const copy = (key) => window.siteIdentity?.get(`wiki.${key}`, '') || '';
  const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
  document.querySelectorAll('.wiki-entry-list').forEach((list) => {
    const entries = Array.from(list.children);
    entries.sort((a, b) => collator.compare(a.dataset.sortTitle, b.dataset.sortTitle));
    list.append(...entries);
  });

  const directory = document.querySelector('[data-wiki-directory]');
  if (directory?.querySelector('[data-wiki-tools]')) {
    const input = directory.querySelector('#wiki-search');
    const clear = directory.querySelector('[data-wiki-clear]');
    const expand = directory.querySelector('[data-wiki-expand]');
    const collapse = directory.querySelector('[data-wiki-collapse]');
    const status = directory.querySelector('[data-wiki-search-status]');
    const empty = directory.querySelector('[data-wiki-search-empty]');
    const normalize = value => value.trim().normalize('NFC').toLowerCase();
    const cards = Array.from(directory.querySelectorAll('[data-wiki-entry]')).map(element => ({
      element,
      names: [element.dataset.searchTitle, ...(JSON.parse(element.dataset.searchAliases || 'null') || [])].map(normalize),
      contents: element.querySelector(':scope > details')
    }));
    let composing = false;
    let announcement;
    let count = cards.length;
    const visibleContents = () => cards.filter(card => !card.element.hidden && card.contents).map(card => card.contents);
    const updateContents = () => {
      const targets = visibleContents();
      expand.disabled = collapse.disabled = !targets.length;
      directory.querySelector('#wiki-contents-state').textContent = copy('contents_state')
        .replace('{total}', targets.length).replace('{open}', targets.filter(target => target.open).length);
    };
    const announce = () => { status.textContent = copy('search_count').replace('{count}', count); };
    const filter = () => {
      if (composing) return;
      const query = normalize(input.value);
      cards.forEach(card => { card.element.hidden = !card.names.some(name => name.includes(query)); });
      count = cards.filter(card => !card.element.hidden).length;
      directory.querySelectorAll('[data-wiki-group]').forEach(group => {
        group.hidden = !Array.from(group.querySelectorAll('[data-wiki-entry]')).some(card => !card.hidden);
        const id = group.querySelector('h2').id;
        directory.querySelector(`.wiki-alphabet a[href="#${id}"]`).hidden = group.hidden;
      });
      empty.hidden = count !== 0;
      clear.disabled = !input.value;
      updateContents();
      clearTimeout(announcement);
      announcement = setTimeout(announce, 350);
    };
    input.addEventListener('compositionstart', () => { composing = true; clearTimeout(announcement); });
    input.addEventListener('compositionend', () => { composing = false; filter(); });
    input.addEventListener('input', event => { if (!event.isComposing) filter(); });
    clear.addEventListener('click', () => { input.value = ''; composing = false; filter(); input.focus(); });
    expand.addEventListener('click', () => { visibleContents().forEach(target => { target.open = true; }); updateContents(); });
    collapse.addEventListener('click', () => { visibleContents().forEach(target => { target.open = false; }); updateContents(); });
    cards.forEach(card => card.contents?.addEventListener('toggle', updateContents));
    window.addEventListener('site-preference-change', () => { announce(); updateContents(); });
    directory.querySelector('[data-wiki-tools]').hidden = false;
    filter();
  }

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
