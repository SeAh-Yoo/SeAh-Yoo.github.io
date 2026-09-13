(() => {
  const platforms = [
    ['chzzk', '치지직', ['chzzk', '치지직'], 'https://chzzk.naver.com/', /^[a-f0-9]{32}$/i],
    ['soop', 'SOOP', ['soop', '숲'], 'https://www.sooplive.com/', /^[a-z0-9_-]+$/i],
    ['youtube', 'YouTube', ['youtube', '유튜브', '유튭'], 'https://www.youtube.com/', /^@[\p{L}\p{N}_.·-]+$/u],
    ['rplay', 'RPlay', ['rplay', '알플레이', '알플'], 'https://rplay.live/', /^[a-f0-9]{24}$/i],
    ['twitch', 'Twitch', ['twitch', '트위치'], 'https://www.twitch.tv/', /^[a-z0-9_]+$/i],
  ].map(([id, label, names, home, valid]) => ({ id, label, names, home, valid }));
  const byName = new Map(platforms.flatMap(p => p.names.map(name => [name, p])));
  const pattern = /\[(chzzk|치지직|soop|숲|youtube|유튜브|유튭|rplay|알플레이|알플|twitch|트위치)(?::([^\]\r\n]+))?\]/gi;
  const excluded = 'a,pre,code,kbd,samp,script,style,textarea,button,select,svg,math,.wiki-preview,[data-wiki-no-autolink]';
  const word = /[\p{L}\p{N}_]/u;
  const particle = /^(?:으로부터|에서부터|으로써|으로서|이라고|이라는|에서는|에게는|에서도|이라면|이라서|이지만|이랑|으로|에서|에게|한테|처럼|보다|까지|부터|조차|마저|이나|이며|이고|은|는|이|가|을|를|의|에|와|과|도|만|로|랑)(?=$|[^\p{L}\p{N}_])/u;
  const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const assetRoot = document.querySelector('script[data-platform-assets]')?.dataset.platformAssets || '/assets/svg/';
  const urlFor = (p, id) => {
    if (!p.valid.test(id)) return null;
    const value = encodeURIComponent(id).replace(/^%40/, '@');
    if (p.id === 'soop') return `${p.home}station/${value}`;
    if (p.id === 'rplay') return `${p.home}creatorhome/${value}?page=creator-home`;
    return p.home + value;
  };
  const apply = root => {
    if (!root) return;
    const doc = root.ownerDocument;
    const walker = doc.createTreeWalker(root, 4);
    const nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement?.closest(excluded)) nodes.push(walker.currentNode);
    }
    const names = new Map();
    const register = entry => {
      if (!names.has(entry.name)) names.set(entry.name, new Map());
      names.get(entry.name).set(entry.url, entry);
    };
    const oldLinks = [...root.querySelectorAll('a[data-platform-name]')];
    for (const link of oldLinks) {
      const platform = platforms.find(p => p.id === link.dataset.platformId);
      if (platform) register({ name: link.dataset.platformName, url: link.getAttribute('href'), platform });
    }
    const declarations = new Map();
    for (const node of nodes) {
      const matches = [];
      let consumed = 0;
      for (const match of node.nodeValue.matchAll(pattern)) {
        if (match.index < consumed) continue;
        const platform = byName.get(match[1].toLowerCase());
        let end = match.index + match[0].length;
        let name = null;
        let url = platform.home;
        if (match[2] !== undefined) {
          url = urlFor(platform, match[2]);
          if (!url) continue;
          const tail = node.nodeValue.slice(end);
          const braced = tail.startsWith('{');
          const label = braced ? /^\{([^{}\r\n]+)\}/.exec(tail) : /^([^\r\n\[\]{}<>|,;:!?。！？，；()]+)/.exec(tail);
          if (!label || !label[1].trim()) continue;
          name = label[1].trim();
          end += braced ? label[0].length : label[0].trimEnd().length;
          register({ name, url, platform });
        }
        matches.push({ start: match.index, end, name, url, platform, raw: match[0] });
        consumed = end;
      }
      declarations.set(node, matches);
    }
    const candidates = [...names.keys()].filter(name => names.get(name).size === 1).sort((a, b) => b.length - a.length);
    const namePattern = candidates.length ? new RegExp(candidates.map(escapePattern).join('|'), 'gu') : null;
    const active = new Set();
    const makeLink = (entry, explicit = false) => {
      const { platform, url, name, raw } = entry;
      const link = doc.createElement('a');
      link.className = name ? 'platform-badge platform-channel' : 'platform-badge';
      link.href = url;
      link.title = name ? `${platform.label} — ${name}` : platform.label;
      link.setAttribute('aria-label', link.title);
      if (name) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('data-no-interface-translation', '');
        if (explicit) {
          link.dataset.platformName = name;
          link.dataset.platformId = platform.id;
        }
      }
      const icon = doc.createElement('img');
      icon.src = `${assetRoot}${platform.id}.svg`;
      icon.alt = '';
      icon.width = 24;
      icon.height = 24;
      const text = doc.createElement('span');
      text.className = name ? 'platform-channel-name' : 'platform-badge-text';
      text.textContent = name || raw;
      link.append(icon, text);
      return link;
    };
    const appendText = (fragment, text, node) => {
      let position = 0;
      if (namePattern && !node.parentElement?.closest('h1,h2,h3,h4,h5,h6')) {
        for (const match of text.matchAll(namePattern)) {
          if (!active.has(match[0])) continue;
          const before = Array.from(text.slice(0, match.index)).pop() || '';
          const rest = text.slice(match.index + match[0].length);
          if (word.test(before) || (word.test(Array.from(rest)[0] || '') && !particle.test(rest))) continue;
          fragment.append(doc.createTextNode(text.slice(position, match.index)));
          fragment.append(makeLink(names.get(match[0]).values().next().value));
          position = match.index + match[0].length;
        }
      }
      fragment.append(doc.createTextNode(text.slice(position)));
    };
    for (const node of nodes) {
      for (const link of oldLinks) {
        if (link.compareDocumentPosition(node) & 4) active.add(link.dataset.platformName);
      }
      const fragment = doc.createDocumentFragment();
      let position = 0;
      for (const match of declarations.get(node)) {
        appendText(fragment, node.nodeValue.slice(position, match.start), node);
        fragment.append(makeLink(match, Boolean(match.name)));
        if (match.name) active.add(match.name);
        position = match.end;
      }
      appendText(fragment, node.nodeValue.slice(position), node);
      node.replaceWith(fragment);
    }
  };
  window.platformLinks = { apply };
  document.querySelectorAll('.post-content').forEach(apply);
})();
