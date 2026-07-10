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

const analyticsOriginMeta = document.querySelector('meta[name="goatcounter-counter-origin"]');
const analyticsCacheMeta = document.querySelector('meta[name="goatcounter-summary-cache-minutes"]');
const analyticsLabelMeta = document.querySelector('meta[name="goatcounter-summary-label"]');
const GOATCOUNTER_COUNTER_ORIGIN = analyticsOriginMeta?.content.replace(/\/$/, '') || '';
const SUMMARY_CACHE_MINUTES = Math.min(
  120,
  Math.max(5, Number.parseInt(analyticsCacheMeta?.content || '20', 10) || 20),
);
const SUMMARY_CACHE_KEY = 'literary-underground:goatcounter-summary:v2';
const SUMMARY_CACHE_DURATION = SUMMARY_CACHE_MINUTES * 60 * 1000;
const SUMMARY_LABEL = analyticsLabelMeta?.content || '익명 방문 집계';
const analyticsEventQueue = [];
let analyticsRetryId = 0;

const getCanonicalPath = () => {
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

  if (canonical) {
    try {
      const url = new URL(canonical, window.location.origin);

      if (url.origin === window.location.origin) {
        return `${url.pathname}${url.search}` || '/';
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return window.location.pathname || '/';
};

const buildGoatCounterUrl = (path, params = {}) => {
  if (!GOATCOUNTER_COUNTER_ORIGIN) {
    return null;
  }

  const normalizedPath = path === 'TOTAL'
    ? path
    : path && path.startsWith('/') ? path : `/${path || ''}`;
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

const formatCounterCount = (value) => new Intl.NumberFormat('ko-KR').format(
  Math.max(0, Math.trunc(value)),
);

const fetchGoatCounterCount = async (path, params = {}) => {
  const url = buildGoatCounterUrl(path, params);

  if (!url) {
    throw new Error('GoatCounter is not configured.');
  }

  const response = await fetch(url, {
    credentials: 'omit',
  });

  // GoatCounter returns a JSON count of 0 with HTTP 404 for unseen paths.
  if (!response.ok && response.status !== 404) {
    throw new Error(`GoatCounter request failed: ${response.status}`);
  }

  const data = await response.json();

  return parseGoatCounterCount(data.count ?? 0);
};

const readSummaryCache = () => {
  try {
    const cached = JSON.parse(window.sessionStorage.getItem(SUMMARY_CACHE_KEY) || 'null');

    if (!cached || !cached.updatedAt || Date.now() - cached.updatedAt > SUMMARY_CACHE_DURATION) {
      return null;
    }

    return cached;
  } catch (error) {
    return null;
  }
};

const writeSummaryCache = (summary) => {
  try {
    window.sessionStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(summary));
  } catch (error) {
    // The counter still works in browsers that deny session storage.
  }
};

const setCounterText = (container, selector, value) => {
  const element = container.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
};

const setColoredCounter = (container, selector, value) => {
  const element = container.querySelector(selector);

  if (!element) {
    return;
  }

  const displayValue = value === null ? '–' : formatCounterCount(value);
  const fragment = document.createDocumentFragment();

  Array.from(displayValue).forEach((character) => {
    const span = document.createElement('span');
    span.textContent = character;
    span.className = /^\d$/.test(character)
      ? `counter-digit counter-digit-${character}`
      : 'counter-separator';
    fragment.appendChild(span);
  });

  element.replaceChildren(fragment);
  element.setAttribute('aria-label', `${element.getAttribute('aria-label')?.replace(/\s+[^\s]+$/, '') || '방문 수'} ${displayValue}`);
};

const setSummaryStatus = (container, message) => {
  setCounterText(container, '[data-goatcounter-status]', message);
};

const renderSiteVisitorCounter = (container, summary, status) => {
  setColoredCounter(container, '[data-goatcounter-value="week"]', summary.week);
  setColoredCounter(container, '[data-goatcounter-value="month"]', summary.month);
  setColoredCounter(container, '[data-goatcounter-value="total"]', summary.total);
  container.setAttribute('aria-busy', 'false');
  setSummaryStatus(container, status);
};

const updateSiteVisitorCounter = async (container) => {
  const cached = readSummaryCache();

  if (cached) {
    renderSiteVisitorCounter(container, cached, `방문 집계를 ${SUMMARY_CACHE_MINUTES}분 동안 표시합니다.`);
    return;
  }

  setSummaryStatus(container, '방문 집계를 불러오는 중입니다.');

  const [weekResult, monthResult, totalResult] = await Promise.allSettled([
    fetchGoatCounterCount('TOTAL', { start: 'week' }),
    fetchGoatCounterCount('TOTAL', { start: 'month' }),
    fetchGoatCounterCount('TOTAL'),
  ]);

  const week = weekResult.status === 'fulfilled' ? weekResult.value : null;
  const month = monthResult.status === 'fulfilled'
    ? Math.max(monthResult.value, week ?? 0)
    : null;
  const total = totalResult.status === 'fulfilled'
    ? Math.max(totalResult.value, month ?? 0, week ?? 0)
    : null;
  const summary = { week, month, total, updatedAt: Date.now() };

  if (week === null && month === null && total === null) {
    renderSiteVisitorCounter(container, summary, '방문 집계를 불러오지 못했습니다.');
    return;
  }

  writeSummaryCache(summary);
  renderSiteVisitorCounter(container, summary, `${SUMMARY_LABEL}입니다.`);
};

const initSiteVisitorCounter = () => {
  const counter = document.querySelector('[data-goatcounter-summary]');

  if (!counter || !GOATCOUNTER_COUNTER_ORIGIN) {
    return;
  }

  let requested = false;
  const requestCounter = () => {
    if (requested) {
      return;
    }

    requested = true;
    updateSiteVisitorCounter(counter).catch((error) => {
      console.warn(error);
      counter.setAttribute('aria-busy', 'false');
      setSummaryStatus(counter, '방문 집계를 불러오지 못했습니다.');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        requestCounter();
      }
    }, { rootMargin: '160px 0px' });

    observer.observe(counter);
    return;
  }

  requestCounter();
};

const updatePostViewCounter = async () => {
  const counter = document.querySelector('[data-goatcounter-post-view]');

  if (!counter || !GOATCOUNTER_COUNTER_ORIGIN) {
    return;
  }

  try {
    const trackedPath = window.goatcounter?.get_data?.().p || getCanonicalPath();
    const count = await fetchGoatCounterCount(trackedPath);

    setCounterText(counter, '[data-goatcounter-post-count]', formatCounterCount(count));
    setCounterText(counter, '[data-goatcounter-post-note]', '회');
  } catch (error) {
    setCounterText(counter, '[data-goatcounter-post-count]', '표시할 수 없음');
    setCounterText(counter, '[data-goatcounter-post-note]', '');
    console.warn(error);
  } finally {
    counter.setAttribute('aria-busy', 'false');
  }
};

const sendAnalyticsEvent = (event) => {
  const counter = window.goatcounter;

  if (!counter || typeof counter.count !== 'function') {
    return false;
  }

  try {
    counter.count({
      path: event.name,
      title: event.title,
      event: true,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const flushAnalyticsEvents = (attempt = 0) => {
  analyticsRetryId = 0;

  while (analyticsEventQueue.length && sendAnalyticsEvent(analyticsEventQueue[0])) {
    analyticsEventQueue.shift();
  }

  if (analyticsEventQueue.length && attempt < 20) {
    analyticsRetryId = window.setTimeout(() => flushAnalyticsEvents(attempt + 1), 500);
  }
};

const trackSiteEvent = (name, title = document.title) => {
  if (!GOATCOUNTER_COUNTER_ORIGIN || !name) {
    return false;
  }

  const normalizedName = String(name).trim().replace(/^\/+/, '').slice(0, 180);

  if (!normalizedName) {
    return false;
  }

  const event = {
    name: normalizedName,
    title: String(title || normalizedName).trim().slice(0, 200),
  };

  if (sendAnalyticsEvent(event)) {
    return true;
  }

  if (analyticsEventQueue.length < 12) {
    analyticsEventQueue.push(event);
  }

  if (!analyticsRetryId) {
    flushAnalyticsEvents();
  }

  return false;
};

window.siteAnalytics = Object.assign(window.siteAnalytics || {}, {
  trackEvent: trackSiteEvent,
  getCanonicalPath,
});

const bindAnalyticsClickEvents = () => {
  document.querySelectorAll('[data-analytics-event]').forEach((element) => {
    element.addEventListener('click', () => {
      trackSiteEvent(
        element.dataset.analyticsEvent,
        element.dataset.analyticsTitle || element.textContent.trim(),
      );
    }, { once: true });
  });
};

const updateGoatCounterDisplays = () => {
  initSiteVisitorCounter();
  updatePostViewCounter();
  bindAnalyticsClickEvents();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateGoatCounterDisplays);
} else {
  updateGoatCounterDisplays();
}
