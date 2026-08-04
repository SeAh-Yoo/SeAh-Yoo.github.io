#!/usr/bin/env node

/**
 * Build a small, committed reading-pulse snapshot from GoatCounter's public
 * counter endpoints. This deliberately uses no API key: every request below
 * is a public /counter/*.json request that a visitor could make as well.
 */

import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = dirname(scriptDirectory);
const postsDirectory = join(repositoryDirectory, '_posts');
const analyticsPath = join(repositoryDirectory, '_data', 'analytics.json');
const snapshotPath = join(repositoryDirectory, '_data', 'reading_pulse.json');
const siteConfigPath = join(repositoryDirectory, '_config.yml');
const requestTimeoutMs = 20_000;
const requestConcurrency = 4;

const postFilenamePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.(?:md|markdown)$/i;

const stripPlainYamlComment = (value) => {
  let quote = null;
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote === '"') {
      if (character === '"' && !escaped) {
        quote = null;
      }
      escaped = character === '\\' && !escaped;
      continue;
    }

    if (quote === "'") {
      if (character === "'") {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '#' && (index === 0 || /\s/.test(value[index - 1]))) {
      return value.slice(0, index).trimEnd();
    }
  }

  return value.trimEnd();
};

const parseYamlScalar = (rawValue) => {
  const value = stripPlainYamlComment(rawValue.trim());

  if (!value || value === 'null' || value === '~') {
    return '';
  }

  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }

  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replace(/''/g, "'");
  }

  return value;
};

/**
 * The blog only needs a handful of top-level scalar fields. Parsing those
 * directly keeps the refresh job dependency-free while still handling quoted,
 * commented, folded, and literal YAML values safely.
 */
const parseTopLevelYamlScalars = (documentText) => {
  const values = {};
  const lines = documentText.replace(/^\uFEFF/, '').split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    const compactValue = rawValue.trim();

    if (/^[>|][+-]?$/.test(compactValue)) {
      const folded = compactValue.startsWith('>');
      const block = [];
      let indentation = null;
      let cursor = index + 1;

      for (; cursor < lines.length; cursor += 1) {
        const nextLine = lines[cursor];

        if (!nextLine.trim()) {
          block.push('');
          continue;
        }

        const nextIndentation = nextLine.match(/^\s*/)[0].length;

        if (nextIndentation === 0) {
          break;
        }

        indentation ??= nextIndentation;
        block.push(nextLine.slice(Math.min(indentation, nextIndentation)));
      }

      values[key] = folded
        ? block.join(' ').replace(/\s+/g, ' ').trim()
        : block.join('\n').trim();
      index = cursor - 1;
      continue;
    }

    values[key] = parseYamlScalar(rawValue);
  }

  return values;
};

const extractFrontMatter = (source, fileName) => {
  const match = source.replace(/^\uFEFF/, '').match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);

  if (!match) {
    throw new Error(`${fileName} is missing YAML front matter.`);
  }

  return parseTopLevelYamlScalars(match[1]);
};

const filenameSlug = (fileName) => {
  const match = basename(fileName).match(postFilenamePattern);
  const fallback = basename(fileName, extname(fileName));
  const candidate = match ? match[2] : fallback;

  return candidate.trim().replace(/\s+/g, '-').replace(/^[-/]+|[-/]+$/g, '');
};

const normalizeSlug = (value, fallback, fileName) => {
  const slug = String(value || fallback)
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-');

  if (!slug) {
    throw new Error(`Could not determine a slug for ${fileName}.`);
  }

  return slug;
};

const fallbackTitle = (slug) => slug.replace(/[-_]+/g, ' ');

const buildPostPath = (permalink, defaultPermalink, slug, fileName) => {
  const template = String(permalink || defaultPermalink || '/posts/:slug/').trim();

  if (/^https?:\/\//i.test(template) || template.startsWith('//')) {
    throw new Error(`${fileName} has an unsupported absolute permalink.`);
  }

  let path = template.replace(/:slug|:title/g, slug);

  if (/:\w+/.test(path)) {
    throw new Error(`${fileName} has a permalink token this snapshot script cannot resolve: ${template}`);
  }

  path = path.split(/[?#]/, 1)[0] || '/';
  path = `/${path}`.replace(/\/{2,}/g, '/');

  if (!path.endsWith('/') && !/\.[A-Za-z0-9]+$/.test(path)) {
    path += '/';
  }

  return path;
};

const readPosts = async (defaultPermalink) => {
  const entries = await readdir(postsDirectory, { withFileTypes: true });
  const postFiles = entries
    .filter((entry) => entry.isFile() && /\.(?:md|markdown)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, 'en'));

  const posts = await Promise.all(postFiles.map(async (fileName) => {
    const source = await readFile(join(postsDirectory, fileName), 'utf8');
    const frontMatter = extractFrontMatter(source, fileName);
    const slug = normalizeSlug(frontMatter.slug, filenameSlug(fileName), fileName);
    const title = String(frontMatter.title || fallbackTitle(slug)).trim();

    return {
      slug,
      title,
      path: buildPostPath(frontMatter.permalink, defaultPermalink, slug, fileName),
    };
  }));

  const seenSlugs = new Set();
  const seenPaths = new Set();

  posts.forEach((post) => {
    if (seenSlugs.has(post.slug)) {
      throw new Error(`Duplicate post slug found: ${post.slug}`);
    }
    if (seenPaths.has(post.path)) {
      throw new Error(`Duplicate post permalink found: ${post.path}`);
    }
    seenSlugs.add(post.slug);
    seenPaths.add(post.path);
  });

  return posts;
};

const normalizeGoatCounterOrigin = (code) => {
  const rawCode = String(code || '').trim();

  if (!rawCode) {
    throw new Error('_data/analytics.json needs a non-empty goatcounterCode value.');
  }

  const input = /^https?:\/\//i.test(rawCode)
    ? rawCode
    : `https://${rawCode.includes('.') ? rawCode : `${rawCode}.goatcounter.com`}`;
  const url = new URL(input);

  if (
    url.protocol !== 'https:'
    || !/^[a-z0-9][a-z0-9-]*\.goatcounter\.com$/i.test(url.hostname)
    || url.username
    || url.password
    || url.port
  ) {
    throw new Error('goatcounterCode must be a standard https://<code>.goatcounter.com address or just <code>.');
  }

  return url.origin;
};

const buildCounterUrl = (origin, path, parameters = {}) => {
  const url = new URL(`/counter/${encodeURIComponent(path)}.json`, origin);

  Object.entries(parameters).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
};

const parseCounterCount = (payload, url) => {
  const value = payload?.count ?? payload?.count_unique ?? 0;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`GoatCounter returned a non-finite count for ${url}.`);
    }
    return Math.max(0, Math.trunc(value));
  }

  const normalized = String(value).replaceAll(',', '').trim();

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new Error(`GoatCounter returned an invalid count for ${url}.`);
  }

  return Math.max(0, Math.trunc(Number(normalized)));
};

const fetchCounter = async (origin, path, parameters = {}) => {
  const url = buildCounterUrl(origin, path, parameters);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SeAh-Yoo-reading-pulse/1.0 (+https://seah-yoo.github.io/)',
      },
      signal: controller.signal,
    });

    // A never-seen counter path responds with 404. It is a legitimate zero,
    // especially for newly published posts and newly introduced events.
    if (response.status === 404) {
      return 0;
    }

    if (!response.ok) {
      throw new Error(`GoatCounter request failed (${response.status}) for ${url}.`);
    }

    return parseCounterCount(await response.json(), url);
  } finally {
    clearTimeout(timeout);
  }
};

const mapWithConcurrency = async (items, limit, mapper) => {
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

const readExistingSnapshot = async () => {
  try {
    return JSON.parse(await readFile(snapshotPath, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return null;
    }

    console.warn(`Ignoring an unreadable existing reading-pulse snapshot: ${error.message}`);
    return null;
  }
};

const snapshotSignature = (snapshot) => JSON.stringify({
  schema_version: snapshot.schema_version,
  site: snapshot.site,
  posts: snapshot.posts,
});

const writeSnapshot = async (snapshot) => {
  const existing = await readExistingSnapshot();

  // Do not advance generated_at on an otherwise identical run. This keeps the
  // scheduled workflow from making a commit merely because a day has passed.
  if (existing && snapshotSignature(existing) === snapshotSignature(snapshot)) {
    console.log('Reading-pulse metrics are unchanged; snapshot left untouched.');
    return false;
  }

  await mkdir(dirname(snapshotPath), { recursive: true });
  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
  const document = `${JSON.stringify(snapshot, null, 2)}\n`;

  await writeFile(temporaryPath, document, 'utf8');
  await rename(temporaryPath, snapshotPath);
  console.log(`Reading-pulse snapshot updated for ${snapshot.posts.length} post(s).`);
  return true;
};

const main = async () => {
  const [analytics, config] = await Promise.all([
    readFile(analyticsPath, 'utf8').then((source) => JSON.parse(source)),
    readFile(siteConfigPath, 'utf8').then(parseTopLevelYamlScalars),
  ]);
  const origin = normalizeGoatCounterOrigin(analytics.goatcounterCode);
  const posts = await readPosts(config.permalink);

  const [siteTotal, postMetrics] = await Promise.all([
    fetchCounter(origin, 'TOTAL'),
    mapWithConcurrency(posts, requestConcurrency, async (post) => {
      const [month, total, read75, readComplete] = await Promise.all([
        fetchCounter(origin, post.path, { start: 'month' }),
        fetchCounter(origin, post.path),
        fetchCounter(origin, `read-75--${post.slug}`),
        fetchCounter(origin, `read-complete--${post.slug}`),
      ]);

      return {
        ...post,
        month,
        total,
        read75,
        readComplete,
      };
    }),
  ]);

  await writeSnapshot({
    schema_version: 1,
    generated_at: new Date().toISOString(),
    site: {
      total: siteTotal,
    },
    posts: postMetrics,
  });
};

main().catch((error) => {
  console.error(`Reading-pulse refresh failed: ${error.message}`);
  process.exitCode = 1;
});
