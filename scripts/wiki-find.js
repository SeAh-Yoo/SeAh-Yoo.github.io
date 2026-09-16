(() => {
  const root = document.querySelector('[data-wiki-document] .post-content');
  if (!root) return;
  let active;
  let hits = [];
  let current = -1;
  let timer;
  const positionToolbar = () => {
    const sidebar = document.querySelector('.sidebar');
    const top = window.matchMedia('(max-width: 900px)').matches && sidebar ? sidebar.getBoundingClientRect().bottom + 8 : 8;
    document.documentElement.style.setProperty('--wiki-find-top', `${top}px`);
  };
  window.addEventListener('resize', () => { if (active) positionToolbar(); });
  const emit = (name, detail) => root.dispatchEvent(new CustomEvent(`wiki-find-${name}`, { detail }));
  const clearMarks = () => {
    root.querySelectorAll('mark[data-wiki-find-hit]').forEach(mark => {
      const parent = mark.parentNode;
      mark.replaceWith(...mark.childNodes);
      parent.normalize();
    });
    hits = [];
    current = -1;
  };
  const status = () => {
    if (!active) return;
    active.status.textContent = active.input.value.trim() ? `${Math.max(0, current + 1)} / ${hits.length}개` : '검색어를 입력하세요';
    active.previous.disabled = active.next.disabled = hits.length === 0;
  };
  const finish = () => {
    clearTimeout(timer);
    clearMarks();
    emit('end');
    if (active) {
      active.input.value = '';
      active.form.classList.remove('wiki-find-active');
      status();
    }
    active = null;
  };
  const move = (direction) => {
    if (!hits.length) return;
    root.querySelectorAll('.wiki-find-current').forEach(mark => mark.classList.remove('wiki-find-current'));
    current = (current + direction + hits.length) % hits.length;
    const hit = hits[current];
    root.querySelectorAll(`mark[data-wiki-find-index="${current}"]`).forEach(mark => mark.classList.add('wiki-find-current'));
    emit('reveal', hit);
    // Let newly revealed until-found sections acquire their full layout first.
    requestAnimationFrame(() => {
      if (!active || hits[current] !== hit) return;
      hit.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
      const overlap = active.form.getBoundingClientRect().bottom + 12 - hit.getBoundingClientRect().top;
      if (overlap > 0) window.scrollBy({ top: -overlap, behavior: 'instant' });
    });
    status();
  };
  const search = (control) => {
    clearTimeout(timer);
    timer = null;
    const query = control.input.value.trim();
    if (active !== control) {
      if (active) {
        active.input.value = '';
        active.form.classList.remove('wiki-find-active');
        active.status.textContent = '검색어를 입력하세요';
        active.previous.disabled = active.next.disabled = true;
      }
      active = control;
    }
    active.form.classList.toggle('wiki-find-active', Boolean(query));
    positionToolbar();
    clearMarks();
    if (!query) { emit('end'); status(); return; }
    emit('start');
    // Build no per-table index on load. Walk only the requested scope on input.
    const walker = document.createTreeWalker(control.scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement.closest('script,style,button,input,textarea,select,svg,.wiki-find,.wiki-heading-number,[aria-hidden="true"]')
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const groups = new Map();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const block = node.parentElement.closest('p,li,td,th,h1,h2,h3,h4,h5,h6,summary,pre,dt,dd') || node.parentElement;
      if (!groups.has(block)) groups.set(block, []);
      groups.get(block).push(node);
    }
    // Escape literal queries; the Unicode regexp keeps offsets in the original text.
    const expression = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
    groups.forEach(nodes => {
      const text = nodes.map(node => node.textContent).join('');
      const matches = Array.from(text.matchAll(expression));
      if (!matches.length) return;
      const firstIndex = hits.length;
      hits.length += matches.length;
      let nodeStart = 0;
      nodes.forEach(node => {
        const value = node.textContent;
        const fragment = document.createDocumentFragment();
        let offset = 0;
        matches.forEach((match, index) => {
          const start = Math.max(0, match.index - nodeStart);
          const end = Math.min(value.length, match.index + match[0].length - nodeStart);
          if (start >= end) return;
          fragment.append(value.slice(offset, start));
          const mark = document.createElement('mark');
          mark.dataset.wikiFindHit = '';
          mark.dataset.wikiFindIndex = String(firstIndex + index);
          mark.textContent = value.slice(start, end);
          fragment.append(mark);
          hits[firstIndex + index] ||= mark;
          offset = end;
        });
        nodeStart += value.length;
        if (!offset) return;
        fragment.append(value.slice(offset));
        node.replaceWith(fragment);
      });
    });
    const ordered = hits.map((mark, index) => ({ mark, index })).sort((a, b) =>
      a.mark.compareDocumentPosition(b.mark) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    const indices = new Map(ordered.map((entry, index) => [String(entry.index), String(index)]));
    root.querySelectorAll('mark[data-wiki-find-hit]').forEach(mark => {
      mark.dataset.wikiFindIndex = indices.get(mark.dataset.wikiFindIndex);
    });
    hits = ordered.map(entry => entry.mark);
    move(1);
    status();
  };
  const addControl = (scope, before, label) => {
    const form = document.createElement('form');
    form.className = 'wiki-find';
    form.setAttribute('role', 'search');
    form.setAttribute('aria-label', label);
    form.setAttribute('data-wiki-no-autolink', '');
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = label;
    input.setAttribute('aria-label', label);
    const result = document.createElement('output');
    result.setAttribute('aria-live', 'polite');
    result.textContent = '검색어를 입력하세요';
    const button = (text, title) => {
      const element = document.createElement('button');
      element.type = 'button'; element.textContent = text;
      element.setAttribute('aria-label', title);
      return element;
    };
    const previous = button('이전', '이전 검색 결과');
    const next = button('다음', '다음 검색 결과');
    const close = button('종료', '검색 종료 및 접힘 상태 복원');
    previous.disabled = next.disabled = true;
    const control = { scope, form, input, status: result, previous, next };
    form.append(input, result, previous, next, close);
    before.before(form);
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => search(control), 180);
    };
    input.addEventListener('compositionstart', () => { clearTimeout(timer); timer = null; });
    input.addEventListener('compositionend', schedule);
    input.addEventListener('input', event => { if (!event.isComposing) schedule(); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (timer || active !== control) { search(control); timer = null; }
      else move(1);
    });
    form.addEventListener('keydown', event => {
      if (event.key === 'Escape') { finish(); input.focus({ preventScroll: true }); }
      if (event.key === 'Enter' && event.shiftKey) { event.preventDefault(); move(-1); }
    });
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    close.addEventListener('click', () => { finish(); input.focus({ preventScroll: true }); });
  };
  addControl(root, root, '페이지 내 검색');
  root.querySelectorAll('table').forEach(table => {
    addControl(table.tBodies[0]?.parentElement || table, table.closest('.wiki-organization') || table, `${table.getAttribute('aria-label') || '표'} 내 검색`);
  });
  const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
  root.querySelectorAll('table').forEach(table => {
    const header = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!header || Array.from(header.cells).some(cell => cell.colSpan !== 1)) return;
    Array.from(header.cells).forEach((cell, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'wiki-sort';
      button.append(...cell.childNodes);
      cell.append(button);
      cell.setAttribute('aria-sort', 'none');
      button.addEventListener('click', () => {
        if (active) finish();
        const direction = cell.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
        Array.from(header.cells).forEach(item => item.setAttribute('aria-sort', 'none'));
        cell.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
        Array.from(table.tBodies).forEach(body => {
          const rows = Array.from(body.rows).filter(row => row.cells.length === header.cells.length);
          rows.sort((a, b) => collator.compare(a.cells[index].textContent.trim(), b.cells[index].textContent.trim()) * direction);
          rows.forEach(row => body.append(row));
        });
      });
    });
  });
})();
