const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeHeading } = require('./wiki-markdown.js');

test('heading lookup normalization trims, folds whitespace, and uses NFC', () => {
  assert.equal(normalizeHeading('  공무직\n  오리엔테이션  '), '공무직 오리엔테이션');
  assert.equal(normalizeHeading('e\u0301'), 'é');
});

test('heading lookup remains case and punctuation sensitive', () => {
  assert.notEqual(normalizeHeading('Title'), normalizeHeading('title'));
  assert.notEqual(normalizeHeading('제목.'), normalizeHeading('제목'));
});
