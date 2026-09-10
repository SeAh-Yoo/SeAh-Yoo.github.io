((global) => {
  const normalize = (text) => String(text).normalize('NFC').replace(/\s+/gu, '').toLowerCase();
  const escapePattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordCharacter = /[\p{L}\p{N}_]/u;
  // Korean particles may follow a title directly, but a longer word/number must not match.
  const particle = /^(?:으로부터|에서부터|으로써|으로서|이라고|이라는|에서는|에게는|에서도|이라면|이라서|이지만|이랑|으로|에서|에게|한테|처럼|보다|까지|부터|조차|마저|이나|이며|이고|은|는|이|가|을|를|의|에|와|과|도|만|로|랑)(?=$|[^\p{L}\p{N}_])/u;
  const excluded = 'a, pre, code, kbd, samp, script, style, textarea, button, select, svg, h1, h2, h3, h4, h5, h6, [data-wiki-no-autolink]';

  const pageKey = (url) => {
    let path = url.pathname;
    try { path = decodeURIComponent(path); } catch { /* Keep malformed escapes literal. */ }
    return url.origin + path.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  };

  const createCatalog = (entries, base) => {
    const names = new Map();
    entries.forEach((entry) => {
      let url;
      try { url = new URL(entry.url, base); } catch { return; }
      if (url.origin !== new URL(base).origin) return;
      const key = pageKey(url);
      [entry.title, ...(Array.isArray(entry.aliases) ? entry.aliases : [])].forEach((name) => {
        if (typeof name !== 'string' || !normalize(name)) return;
        const normalized = normalize(name);
        if (!names.has(normalized)) names.set(normalized, new Map());
        names.get(normalized).set(key, { key, url: url.href });
      });
    });
    const patterns = Array.from(names.keys())
      .sort((a, b) => b.length - a.length || a.localeCompare(b))
      .map((name) => Array.from(name).map(escapePattern).join('\\s*'));
    return { names, pattern: patterns.length ? new RegExp(patterns.join('|'), 'giu') : null };
  };

  const findMatches = (text, catalog, source, seen = new Set()) => {
    if (!catalog.pattern) return [];
    const sourceKey = pageKey(new URL(source));
    const matches = [];
    catalog.pattern.lastIndex = 0;
    for (const match of text.matchAll(catalog.pattern)) {
      const start = match.index;
      const end = start + match[0].length;
      const before = Array.from(text.slice(0, start)).pop() || '';
      const rest = text.slice(end);
      const after = Array.from(rest)[0] || '';
      if (wordCharacter.test(before)) continue;
      if (wordCharacter.test(after) && !particle.test(rest)) continue;
      const targets = catalog.names.get(normalize(match[0]));
      // Ambiguous names remain plain text, even if one target is the current page.
      if (!targets || targets.size !== 1) continue;
      const target = targets.values().next().value;
      if (target.key === sourceKey || seen.has(target.key)) continue;
      seen.add(target.key);
      matches.push({ start, end, text: match[0], url: target.url });
    }
    return matches;
  };

  const apply = (root, catalog, source) => {
    if (!root) return;
    const document = root.ownerDocument;
    const walker = document.createTreeWalker(root, 4 /* SHOW_TEXT */);
    const nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement?.closest(excluded)) nodes.push(walker.currentNode);
    }
    const seen = new Set(Array.from(root.querySelectorAll('a[data-wiki-autolink]'),
      (link) => pageKey(new URL(link.getAttribute('href'), source))));
    nodes.forEach((node) => {
      const matches = findMatches(node.nodeValue, catalog, source, seen);
      if (!matches.length) return;
      const fragment = document.createDocumentFragment();
      let position = 0;
      matches.forEach((match) => {
        fragment.append(document.createTextNode(node.nodeValue.slice(position, match.start)));
        const link = document.createElement('a');
        link.href = match.url;
        link.dataset.wikiAutolink = '';
        link.textContent = match.text;
        fragment.append(link);
        position = match.end;
      });
      fragment.append(document.createTextNode(node.nodeValue.slice(position)));
      node.replaceWith(fragment);
    });
  };

  const api = { createCatalog, findMatches, apply, pageKey };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.wikiAutolinks = api;
})(typeof window === 'undefined' ? globalThis : window);
