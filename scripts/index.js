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
  const normalizedPath = path && path.startsWith('/') ? path : `/${path || ''}`;
  const url = new URL(`/counter/${encodeURI(normalizedPath)}.json`, GOATCOUNTER_COUNTER_ORIGIN);

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

  try {
    const [todayCount, yesterdayCount, totalCount] = await Promise.all([
      fetchGoatCounterCount('/', ranges.today),
      fetchGoatCounterCount('/', ranges.yesterday),
      fetchGoatCounterCount('/', ranges.total),
    ]);

    counter.querySelector('[data-goatcounter-value="today"]').textContent = todayCount;
    counter.querySelector('[data-goatcounter-value="yesterday"]').textContent = yesterdayCount;
    counter.querySelector('[data-goatcounter-value="total"]').textContent = totalCount;
  } catch (error) {
    counter.hidden = true;
    console.warn(error);
  }
};

const updatePostViewCounter = async () => {
  const counter = document.querySelector('[data-goatcounter-post-view]');

  if (!counter) {
    return;
  }

  try {
    const count = await fetchGoatCounterCount(window.location.pathname, {
      start: '2000-01-01',
      end: formatDate(new Date()),
    });

    counter.querySelector('[data-goatcounter-post-count]').textContent = count;
  } catch (error) {
    counter.hidden = true;
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
