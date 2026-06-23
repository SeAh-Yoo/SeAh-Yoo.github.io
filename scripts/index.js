const legacyPost = location.hash.match(/^#\/post\/([a-z0-9-]+)$/i);

if (legacyPost) {
  location.replace(`/posts/${legacyPost[1]}/`);
}

const addPostImageCaptions = () => {
  document.querySelectorAll('.post img[alt]').forEach((image) => {
    if (image.closest('figure')) {
      return;
    }

    const caption = image.getAttribute('alt').trim();

    if (!caption) {
      return;
    }

    const paragraph = image.parentElement;

    if (!paragraph || paragraph.tagName !== 'P' || paragraph.childElementCount !== 1) {
      return;
    }

    const figure = document.createElement('figure');
    figure.className = 'post-image';

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;

    paragraph.replaceWith(figure);
    figure.append(image, figcaption);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addPostImageCaptions);
} else {
  addPostImageCaptions();
}

window.addEventListener('load', addPostImageCaptions);

// GoatCounter public counter origin for this site. If you copy/fork this site,
// replace this with your own GoatCounter subdomain so counts do not point here.
const GOATCOUNTER_COUNTER_ORIGIN = 'https://seah-yoo.goatcounter.com';

const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const shiftDate = (date, days) => {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);

  return shifted;
};

const buildGoatCounterUrl = (path, params = {}) => {
  // GoatCounter direct counter URLs expect the path as one encoded segment;
  // using encodeURI() leaves slashes unescaped and can return 404 for posts.
  const normalizedPath = path === 'TOTAL' ? path : path && path.startsWith('/') ? path : `/${path || ''}`;
  const encodedPath = encodeURIComponent(normalizedPath);
  const url = new URL(`/counter/${encodedPath}.json`, GOATCOUNTER_COUNTER_ORIGIN);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
};

const parseGoatCounterCount = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  const digits = String(value ?? '').replace(/[^\d-]/g, '');
  const parsed = Number.parseInt(digits, 10);

  return Number.isFinite(parsed) ? parsed : 0;
};

const formatGoatCounterCount = (value) =>
  new Intl.NumberFormat('ko-KR').format(Math.max(0, value));

const fetchGoatCounterCount = async (path, params = {}) => {
  const response = await fetch(buildGoatCounterUrl(path, params), {
    credentials: 'omit',
    cache: 'no-store',
  });

  // GoatCounter may return a JSON count of 0 with HTTP 404 when a path has
  // no recorded views yet. Treat that as a valid zero rather than an error.
  if (!response.ok && response.status !== 404) {
    throw new Error(`GoatCounter request failed: ${response.status}`);
  }

  const data = await response.json();

  return parseGoatCounterCount(data.count ?? data.count_unique ?? 0);
};

const setCounterText = (container, selector, value) => {
  const element = container.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
};

// GoatCounter's public TOTAL counter applies date boundaries in UTC. Its
// end=YYYY-MM-DD value points to the start of that date, so using the same
// start and end date only counts the midnight bucket. Avoid end entirely:
// today is "since today", yesterday is "since yesterday" minus "since today",
// and total is the unfiltered lifetime count.
const updateSiteVisitorCounter = async () => {
  const counter = document.querySelector('[data-goatcounter-summary]');

  if (!counter) {
    return;
  }

  const today = new Date();
  const yesterday = shiftDate(today, -1);

  const [todayResult, sinceYesterdayResult, totalResult] = await Promise.allSettled([
    fetchGoatCounterCount('TOTAL', { start: formatDate(today) }),
    fetchGoatCounterCount('TOTAL', { start: formatDate(yesterday) }),
    fetchGoatCounterCount('TOTAL'),
  ]);

  const todayText = todayResult.status === 'fulfilled'
    ? formatGoatCounterCount(todayResult.value)
    : '-';
  const yesterdayText = todayResult.status === 'fulfilled' && sinceYesterdayResult.status === 'fulfilled'
    ? formatGoatCounterCount(sinceYesterdayResult.value - todayResult.value)
    : '-';
  const totalText = totalResult.status === 'fulfilled'
    ? formatGoatCounterCount(totalResult.value)
    : '-';

  setCounterText(counter, '[data-goatcounter-value="today"]', todayText);
  setCounterText(counter, '[data-goatcounter-value="yesterday"]', yesterdayText);
  setCounterText(counter, '[data-goatcounter-value="total"]', totalText);

  [todayResult, sinceYesterdayResult, totalResult].forEach((result) => {
    if (result.status === 'rejected') {
      console.warn(result.reason);
    }
  });
};

const updatePostViewCounter = async () => {
  const counter = document.querySelector('[data-goatcounter-post-view]');

  if (!counter) {
    return;
  }

  try {
    const path = window.goatcounter && window.goatcounter.get_data
      ? window.goatcounter.get_data().p
      : window.location.pathname;
    const count = await fetchGoatCounterCount(path);

    setCounterText(counter, '[data-goatcounter-post-count]', formatGoatCounterCount(count));
  } catch (error) {
    setCounterText(counter, '[data-goatcounter-post-count]', '-');
    console.warn(error);
  }
};

const updateGoatCounterDisplays = () => {
  updateSiteVisitorCounter();
  updatePostViewCounter();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateGoatCounterDisplays);
} else {
  updateGoatCounterDisplays();
}
