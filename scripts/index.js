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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const shiftDate = (date, days) => {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);

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

const fetchGoatCounterCount = async (path, params) => {
  const response = await fetch(buildGoatCounterUrl(path, params), { credentials: 'omit' });

  if (!response.ok) {
    throw new Error(`GoatCounter request failed: ${response.status}`);
  }

  const data = await response.json();

  return data.count || data.count_unique || '0';
};

const setCounterText = (container, selector, value) => {
  const element = container.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
};

// Sidebar summary: request the public counter three times with date ranges
// for Today, Yesterday, and a long Total range.
const updateSiteVisitorCounter = async () => {
  const counter = document.querySelector('[data-goatcounter-summary]');

  if (!counter) {
    return;
  }

  const today = new Date();
  const yesterday = shiftDate(today, -1);
  const ranges = {
    today: { start: formatDate(today), end: formatDate(today) },
    yesterday: { start: formatDate(yesterday), end: formatDate(yesterday) },
    total: { start: '2000-01-01', end: formatDate(today) },
  };

  const [todayResult, yesterdayResult, totalResult] = await Promise.allSettled([
    fetchGoatCounterCount('TOTAL', ranges.today),
    fetchGoatCounterCount('TOTAL', ranges.yesterday),
    fetchGoatCounterCount('TOTAL', ranges.total),
  ]);

  setCounterText(counter, '[data-goatcounter-value="today"]', todayResult.status === 'fulfilled' ? todayResult.value : '-');
  setCounterText(counter, '[data-goatcounter-value="yesterday"]', yesterdayResult.status === 'fulfilled' ? yesterdayResult.value : '-');
  setCounterText(counter, '[data-goatcounter-value="total"]', totalResult.status === 'fulfilled' ? totalResult.value : '-');

  [todayResult, yesterdayResult, totalResult].forEach((result) => {
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
    const count = await fetchGoatCounterCount(path, {
      start: '2000-01-01',
      end: formatDate(new Date()),
    });

    setCounterText(counter, '[data-goatcounter-post-count]', count);
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
