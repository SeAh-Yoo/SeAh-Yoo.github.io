const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const root = resolve(__dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('legacy redirects preserve query strings and tag anchors', () => {
  for (const targetPath of ['/tags/', '/visitor-stats/', '/preview/tags/']) {
    let destination;
    vm.runInNewContext(read('scripts/legacy-redirect.js'), {
      URL,
      document: { querySelector: () => ({ href: `https://example.com${targetPath}` }) },
      window: { location: {
        href: 'https://example.com/topics/?source=old#ai-and-society',
        search: '?source=old', hash: '#ai-and-society',
        replace: (url) => { destination = url; },
      } },
    });
    assert.equal(destination, `https://example.com${targetPath}?source=old#ai-and-society`);
  }
});

test('built routes use new canonicals and preserve historical analytics paths', () => {
  const sitemap = read('_site/sitemap.xml');
  for (const [oldPath, newPath] of [['topics', 'tags'], ['reading-pulse', 'visitor-stats']]) {
    const oldPage = read(`_site/${oldPath}/index.html`);
    const newPage = read(`_site/${newPath}/index.html`);
    assert.match(oldPage, /noindex, follow/);
    assert.match(oldPage, new RegExp(`rel="canonical" href="[^"]*/${newPath}/"`));
    assert.doesNotMatch(oldPage, /gc\.zgo\.at/);
    assert.match(newPage, new RegExp(`rel="canonical" href="[^"]*/${newPath}/"`));
    assert.match(newPage, new RegExp(`data-goatcounter-settings='\{"path": "/${oldPath}/"\}'`));
    assert.ok(sitemap.includes(`/${newPath}/</loc>`));
    assert.ok(!sitemap.includes(`/${oldPath}/</loc>`));
  }
});

test('all built localization bindings resolve for every language', () => {
  for (const path of ['', 'tags/', 'visitor-stats/', 'about/', 'categories/', 'start-here/', 'timeline/', 'references/']) {
    const html = read(`_site/${path}index.html`);
    const data = JSON.parse(html.match(/<script id="site-identity-data"[^>]*>(.*?)<\/script>/s)[1]);
    for (const [, key] of html.matchAll(/data-i18n(?:-html|-alt|-aria-label|-title)?="([^"]+)"/g)) {
      for (const locale of Object.values(data.locales)) {
        assert.equal(typeof key.split('.').reduce((value, part) => value?.[part], locale), 'string', key);
      }
    }
  }
  const start = read('_site/start-here/index.html');
  assert.match(start, /id="path-ai-issues"/);
  assert.match(start, /id="path-ai-society"/);
});
