#!/usr/bin/env node

/**
 * Refresh the committed public GoatCounter snapshot (no API key).
 * Run jekyll build --safe first: the manifest uses Jekyll's actual published
 * URLs, including collection permalinks, publication rules, and baseurl.
 * Optional argument: path to a manifest from a different build destination.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const analyticsPath = join(repositoryDirectory, '_data', 'analytics.json');
const snapshotPath = join(repositoryDirectory, '_data', 'reading_pulse.json');
const manifestPath = process.argv[2]
  ? resolve(process.argv[2])
  : join(repositoryDirectory, '_site', 'reading-pulse-index.json');
const requestTimeoutMs = 20_000;
const requestConcurrency = 4;

const normalizeGoatCounterOrigin = (code) => {
  const rawCode = String(code || '').trim();
  if (!rawCode) throw new Error('_data/analytics.json needs a non-empty goatcounterCode.');
  const url = new URL(/^https?:\/\//i.test(rawCode)
    ? rawCode
    : `https://${rawCode.includes('.') ? rawCode : `${rawCode}.goatcounter.com`}`);
  if (url.protocol !== 'https:' || !/^[a-z0-9][a-z0-9-]*\.goatcounter\.com$/i.test(url.hostname)
      || url.username || url.password || url.port) {
    throw new Error('goatcounterCode must be a standard HTTPS GoatCounter address or code.');
  }
  return url.origin;
};

const readManifest = async () => {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`Build the site with jekyll build --safe before refreshing counters: ${error.message}`);
  }
  if (!Array.isArray(manifest.posts) || !Array.isArray(manifest.wiki)) {
    throw new Error('The reading-pulse manifest must contain posts and wiki arrays.');
  }
  const paths = new Set();
  const eventKeys = new Set();
  for (const [kind, entries] of [['posts', manifest.posts], ['wiki', manifest.wiki]]) {
    for (const entry of entries) {
      if (typeof entry.title !== 'string' || !entry.title.trim()) {
        throw new Error(`Missing ${kind} title in the manifest.`);
      }
      for (const key of ['path', 'url']) {
        if (typeof entry[key] !== 'string' || !entry[key].startsWith('/')
            || entry[key].startsWith('//') || /[?#]/.test(entry[key])) {
          throw new Error(`Invalid ${kind} ${key}: ${entry[key]}`);
        }
      }
      if (paths.has(entry.path)) throw new Error(`Duplicate counter path: ${entry.path}`);
      paths.add(entry.path);
      if (kind === 'posts') {
        if (typeof entry.slug !== 'string' || !entry.slug || eventKeys.has(entry.slug)) {
          throw new Error(`Missing or duplicate post event slug: ${entry.slug}`);
        }
        eventKeys.add(entry.slug);
      }
    }
    entries.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  }
  return manifest;
};

// Thirty calendar dates including today, in the site's configured timezone.
// Store the range with the snapshot so an older snapshot never claims to be live.
const recentPeriod = (now, timezone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type).value;
  const end = `${part('year')}-${part('month')}-${part('day')}`;
  const start = new Date(`${end}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 29);
  return { start: start.toISOString().slice(0, 10), end, timezone };
};

const parseCounterCount = (payload, url) => {
  const raw = payload?.count ?? payload?.count_unique;
  if (raw === null || raw === undefined) throw new Error(`Missing counter count: ${url}`);
  const value = String(raw).replaceAll(',', '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) {
    throw new Error(`Invalid counter count from ${url}`);
  }
  return Math.max(0, Math.trunc(Number(value)));
};

const fetchCounter = async (origin, path, parameters = {}) => {
  const url = new URL(`/counter/${encodeURIComponent(path)}.json`, origin);
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SeAh-Yoo-reading-pulse/2.0 (+https://seah-yoo.github.io/)',
      },
      signal: controller.signal,
    });
    // A path never visited before legitimately has no public counter.
    if (response.status === 404) return 0;
    if (!response.ok) throw new Error(`GoatCounter request failed (${response.status}) for ${url}`);
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
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

const readExistingSnapshot = async () => {
  try {
    return JSON.parse(await readFile(snapshotPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') console.warn(`Unreadable existing snapshot: ${error.message}`);
    return null;
  }
};

const snapshotSignature = ({ schema_version, period, site, posts, wiki }) =>
  JSON.stringify({ schema_version, period, site, posts, wiki });

const writeSnapshot = async (snapshot) => {
  const existing = await readExistingSnapshot();
  if (existing && snapshotSignature(existing) === snapshotSignature(snapshot)) {
    console.log('Reading-pulse metrics and date range are unchanged; snapshot left untouched.');
    return;
  }
  await mkdir(dirname(snapshotPath), { recursive: true });
  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, snapshotPath);
  console.log(`Reading-pulse snapshot updated: ${snapshot.posts.length} post(s), ${snapshot.wiki.length} wiki page(s).`);
};

const main = async () => {
  const [analytics, manifest] = await Promise.all([
    readFile(analyticsPath, 'utf8').then(JSON.parse),
    readManifest(),
  ]);
  const origin = normalizeGoatCounterOrigin(analytics.goatcounterCode);
  const now = new Date();
  const period = recentPeriod(now, manifest.timezone || 'UTC');
  const range = { start: period.start, end: period.end };
  // Bound ALL public requests, including per-post events, to four in flight.
  const requests = [{ path: 'TOTAL' }];
  const prepare = (entry, kind) => {
    const offset = requests.length;
    requests.push({ path: entry.path, parameters: range }, { path: entry.path });
    if (kind === 'post') {
      requests.push({ path: `read-75--${entry.slug}` }, { path: `read-complete--${entry.slug}` });
    }
    return { entry, offset };
  };
  const posts = manifest.posts.map((entry) => prepare(entry, 'post'));
  const wiki = manifest.wiki.map((entry) => prepare(entry, 'wiki'));
  const counts = await mapWithConcurrency(requests, requestConcurrency,
    ({ path, parameters }) => fetchCounter(origin, path, parameters));
  const visits = ({ entry, offset }) => ({
    ...entry, month: counts[offset], total: counts[offset + 1],
  });

  // All requests must succeed before replacing the last successful snapshot.
  await writeSnapshot({
    schema_version: 2,
    generated_at: now.toISOString(),
    period,
    site: { total: counts[0] },
    posts: posts.map((item) => ({
      ...visits(item), read75: counts[item.offset + 2], readComplete: counts[item.offset + 3],
    })),
    wiki: wiki.map(visits),
  });
};

main().catch((error) => {
  console.error(`Reading-pulse refresh failed; existing snapshot retained: ${error.message}`);
  process.exitCode = 1;
});
