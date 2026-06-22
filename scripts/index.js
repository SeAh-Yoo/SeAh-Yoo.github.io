const app = document.querySelector('#app');
const archiveList = document.querySelector('#archiveList');
const manifestUrl = 'posts/posts.json';
let posts = [];

const escapeHtml = (value = '') => value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
const formatDate = (date) => new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));

async function boot() {
  try {
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('posts.json을 불러오지 못했습니다.');
    posts = (await response.json()).sort((a, b) => new Date(b.date) - new Date(a.date));
    renderArchive();
    window.addEventListener('hashchange', renderRoute);
    await renderRoute();
  } catch (error) {
    app.innerHTML = `<section class="empty glass-panel">${escapeHtml(error.message)}</section>`;
  }
}

function renderArchive() {
  archiveList.innerHTML = posts.map((post) => `<li><a href="#/post/${post.slug}" data-slug="${post.slug}">${escapeHtml(post.title)}<time>${formatDate(post.date)}</time></a></li>`).join('');
}

async function renderRoute() {
  const slug = location.hash.match(/^#\/post\/(.+)$/)?.[1];
  document.querySelectorAll('.archive-list a').forEach((link) => link.classList.toggle('active', link.dataset.slug === slug));
  if (!slug) return renderHome();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return renderHome();
  const markdown = await (await fetch(post.file, { cache: 'no-store' })).text();
  app.innerHTML = `<article class="post glass-panel">${renderMarkdown(markdown, post)}</article>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  const latest = posts.slice(0, 5);
  app.innerHTML = latest.length ? latest.map((post) => `<a class="card glass-panel" href="#/post/${post.slug}"><div class="meta"><time>${formatDate(post.date)}</time><span>${escapeHtml(post.category ?? 'Column')}</span></div><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.excerpt ?? '')}</p></a>`).join('') : '<section class="empty glass-panel">posts/posts.json에 글을 추가해 주세요.</section>';
}

function renderMarkdown(markdown, post) {
  const basePath = post.file.split('/').slice(0, -1).join('/');
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let paragraph = [];
  const flush = () => { if (paragraph.length) { html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph = []; } };
  for (const line of lines) {
    const trimmed = line.trim();
    const image = trimmed.match(/^\[img:([^\]]+)\]$/);
    if (!trimmed) { flush(); continue; }
    if (image) { flush(); html += `<img src="${basePath}/${encodeURIComponent(image[1])}" alt="" loading="lazy" />`; continue; }
    if (trimmed.startsWith('### ')) { flush(); html += `<h3>${inline(trimmed.slice(4))}</h3>`; continue; }
    if (trimmed.startsWith('## ')) { flush(); html += `<h2>${inline(trimmed.slice(3))}</h2>`; continue; }
    if (trimmed.startsWith('# ')) { flush(); html += `<h1>${inline(trimmed.slice(2))}</h1>`; continue; }
    paragraph.push(trimmed);
  }
  flush();
  return html;
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\[([^\]]+)\]\[(\d+)\]/g, '$1')
    .replace(/\n/g, '<br />');
}

boot();
