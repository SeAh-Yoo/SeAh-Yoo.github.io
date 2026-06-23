(() => {
  const root = document.querySelector('[data-site-search]');

  if (!root) {
    return;
  }

  const openButton = root.querySelector('[data-search-open]');
  const dialog = root.querySelector('[data-search-dialog]');
  const closeButton = root.querySelector('[data-search-close]');
  const input = root.querySelector('[data-search-input]');
  const resultsList = root.querySelector('[data-search-results]');
  const status = root.querySelector('[data-search-status]');
  const empty = root.querySelector('[data-search-empty]');
  const indexUrl = root.dataset.searchIndex || '/search.json';

  if (!openButton || !dialog || !input || !resultsList || !status || !empty) {
    return;
  }

  let indexPromise;
  let selectedIndex = -1;
  let inputTimer = 0;

  const normalize = (value) => String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('ko-KR')
    .replace(/\s+/g, ' ')
    .trim();

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const loadIndex = () => {
    if (!indexPromise) {
      status.textContent = '검색 색인을 불러오는 중…';
      indexPromise = fetch(indexUrl, { credentials: 'same-origin', cache: 'no-cache' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Search index request failed: ${response.status}`);
          }
          return response.json();
        })
        .then((items) => Array.isArray(items) ? items : [])
        .catch((error) => {
          indexPromise = undefined;
          throw error;
        });
    }

    return indexPromise;
  };

  const createHighlightedText = (text, tokens) => {
    const fragment = document.createDocumentFragment();
    const usableTokens = tokens.filter(Boolean).sort((a, b) => b.length - a.length);

    if (!usableTokens.length) {
      fragment.append(document.createTextNode(text));
      return fragment;
    }

    const pattern = new RegExp(`(${usableTokens.map(escapeRegExp).join('|')})`, 'gi');
    String(text).split(pattern).forEach((part) => {
      if (!part) {
        return;
      }

      if (usableTokens.some((token) => normalize(part) === token)) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        fragment.append(mark);
      } else {
        fragment.append(document.createTextNode(part));
      }
    });

    return fragment;
  };

  const makeSnippet = (item, tokens) => {
    const source = String(item.description || item.content || '').replace(/\s+/g, ' ').trim();

    if (!source) {
      return '';
    }

    const normalizedSource = normalize(source);
    const firstPosition = tokens
      .map((token) => normalizedSource.indexOf(token))
      .filter((position) => position >= 0)
      .sort((a, b) => a - b)[0];
    const start = Math.max(0, (firstPosition ?? 0) - 72);
    const end = Math.min(source.length, start + 190);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < source.length ? '…' : '';

    return `${prefix}${source.slice(start, end).trim()}${suffix}`;
  };

  const scoreItem = (item, tokens) => {
    const title = normalize(item.title);
    const category = normalize(item.category);
    const series = normalize(item.series);
    const description = normalize(item.description);
    const content = normalize(item.content);
    const combined = `${title} ${category} ${series} ${description} ${content}`;

    if (!tokens.every((token) => combined.includes(token))) {
      return null;
    }

    let score = 0;

    tokens.forEach((token) => {
      if (title === token) score += 240;
      if (title.startsWith(token)) score += 120;
      if (title.includes(token)) score += 90;
      if (series.includes(token)) score += 48;
      if (category.includes(token)) score += 36;
      if (description.includes(token)) score += 22;
      if (content.includes(token)) score += 8;
    });

    if (tokens.length > 1 && title.includes(tokens.join(' '))) {
      score += 80;
    }

    return score;
  };

  const selectResult = (index) => {
    const links = Array.from(resultsList.querySelectorAll('[data-search-result]'));

    links.forEach((link) => link.classList.remove('is-selected'));

    if (!links.length) {
      selectedIndex = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }

    selectedIndex = (index + links.length) % links.length;
    const selected = links[selectedIndex];
    selected.classList.add('is-selected');
    input.setAttribute('aria-activedescendant', selected.id);
    selected.scrollIntoView({ block: 'nearest' });
  };

  const renderResults = (items, tokens) => {
    resultsList.replaceChildren();
    selectedIndex = -1;
    empty.textContent = '일치하는 글을 찾지 못했습니다.';

    items.forEach((item, index) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      const heading = document.createElement('strong');
      const metadata = document.createElement('span');
      const snippet = document.createElement('p');

      link.href = item.url;
      link.id = `site-search-result-${index}`;
      link.dataset.searchResult = '';
      link.addEventListener('mouseenter', () => selectResult(index));
      link.addEventListener('click', () => closeDialog());

      heading.append(createHighlightedText(item.title || '제목 없는 글', tokens));
      metadata.className = 'site-search-result-meta';
      metadata.textContent = [item.category, item.series, item.dateLabel].filter(Boolean).join(' · ');
      snippet.className = 'site-search-result-snippet';
      snippet.append(createHighlightedText(makeSnippet(item, tokens), tokens));

      link.append(heading, metadata, snippet);
      listItem.append(link);
      resultsList.append(listItem);
    });

    empty.hidden = items.length > 0;

    if (items.length) {
      status.textContent = `${items.length}개의 글을 찾았습니다.`;
      selectResult(0);
    } else {
      status.textContent = '검색 결과가 없습니다.';
    }
  };

  const runSearch = async () => {
    const query = normalize(input.value);
    const tokens = query.split(' ').filter(Boolean);

    if (!tokens.length) {
      resultsList.replaceChildren();
      selectedIndex = -1;
      empty.hidden = true;
      status.textContent = '검색어를 입력하세요.';
      input.removeAttribute('aria-activedescendant');
      return;
    }

    try {
      const items = await loadIndex();
      const matched = items
        .map((item) => ({ item, score: scoreItem(item, tokens) }))
        .filter((entry) => entry.score !== null)
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return new Date(b.item.date) - new Date(a.item.date);
        })
        .slice(0, 12)
        .map((entry) => entry.item);

      renderResults(matched, tokens);
    } catch (error) {
      console.warn(error);
      resultsList.replaceChildren();
      empty.hidden = false;
      empty.textContent = '검색 색인을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
      status.textContent = '검색을 사용할 수 없습니다.';
    }
  };

  const openDialog = () => {
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog.setAttribute('open', '');
    }

    document.body.classList.add('is-search-open');
    window.requestAnimationFrame(() => input.focus());
    loadIndex()
      .then(() => {
        if (normalize(input.value)) {
          runSearch();
        } else {
          status.textContent = '검색어를 입력하세요.';
        }
      })
      .catch((error) => {
        console.warn(error);
        status.textContent = '검색을 사용할 수 없습니다.';
      });
  };

  function closeDialog() {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      document.body.classList.remove('is-search-open');
    }
  }

  openButton.addEventListener('click', openDialog);
  closeButton?.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-search-open');
  });

  input.addEventListener('input', () => {
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(runSearch, 70);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectResult(selectedIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectResult(selectedIndex - 1);
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault();
      const selected = resultsList.querySelectorAll('[data-search-result]')[selectedIndex];
      selected?.click();
    }
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (
      target.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
    );
    const commandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    const slashShortcut = event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey;

    if (commandShortcut || slashShortcut) {
      event.preventDefault();
      openDialog();
    }
  });
})();
