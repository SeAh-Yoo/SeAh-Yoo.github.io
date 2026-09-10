const test = require('node:test');
const assert = require('node:assert/strict');
const { createCatalog, findMatches, pageKey } = require('./wiki-autolinks.js');

const base = 'https://example.com';
const source = `${base}/wiki/season-1/`;
const entries = [
  { title: '봉누도 시즌1', url: '/wiki/season-1/' },
  { title: '봉누도 시즌2', aliases: ['봉누도2', 'Bongnudo 2'], url: '/wiki/season-2/' },
  { title: '봉누도', url: '/wiki/bongnudo/' },
];
const match = (text, custom = entries, seen) => findMatches(text, createCatalog(custom, base), source, seen);

test('spacing variants keep the displayed spelling and point to the same page', () => {
  for (const text of ['봉누도 시즌2', '봉누도 시즌 2', '봉누도  시즌\n2']) {
    assert.deepEqual(match(text), [{ start: 0, end: text.length, text, url: `${base}/wiki/season-2/` }]);
  }
});
test('Korean particles, punctuation, aliases, and English case', () => {
  for (const text of ['봉누도 시즌2가 시작된다.', '“봉누도 시즌 2”', '봉누도2는', 'BONGNUDO 2', 'Bongnudo 2는']) {
    assert.equal(match(text)[0].url, `${base}/wiki/season-2/`);
  }
});
test('no accidental matches inside longer words, seasons, or identifiers', () => {
  for (const text of ['봉누도 시즌20', '큰봉누도 시즌2', '봉누도 시즌2abc', '_봉누도 시즌2', '봉누도 시즌2게임']) {
    assert.equal(match(text).length, 0, text);
  }
});
test('longest name wins and self references remain unlinked', () => {
  assert.equal(match('봉누도 시즌2')[0].text, '봉누도 시즌2');
  assert.equal(match('봉누도 시즌1은').length, 0);
});
test('each destination is linked once across text nodes and aliases', () => {
  const seen = new Set();
  assert.equal(match('봉누도 시즌2', entries, seen).length, 1);
  assert.equal(match('봉누도 시즌 2 또는 봉누도2', entries, seen).length, 0);
});
test('ambiguous titles and aliases never select an arbitrary page', () => {
  assert.equal(match('봉누도 시즌 2', [...entries, { title: '다른 서버', aliases: ['봉누도 시즌 2'], url: '/wiki/other/' }]).length, 0);
  assert.equal(match('봉누도 시즌1', [...entries, { title: '다른 서버', aliases: ['봉누도 시즌1'], url: '/wiki/other/' }]).length, 0);
});
test('regex metacharacters are literal and external destinations are excluded', () => {
  const custom = [{ title: 'C++', url: '/wiki/cpp/' }, { title: '외부', url: 'https://other.com/wiki/external/' }];
  assert.equal(match('C++', custom)[0].text, 'C++');
  assert.equal(match('외부', custom).length, 0);
  assert.equal(match('anything', []).length, 0);
});
test('URL comparison supports Korean encoding, index.html and subdirectory hosting', () => {
  assert.equal(pageKey(new URL(`${base}/wiki/%ED%95%9C%EA%B8%80/index.html#part`)), `${base}/wiki/한글`);
  assert.equal(match('봉누도 시즌2', [{ title: '봉누도 시즌2', url: '/preview/wiki/season-2/' }])[0].url, `${base}/preview/wiki/season-2/`);
});
