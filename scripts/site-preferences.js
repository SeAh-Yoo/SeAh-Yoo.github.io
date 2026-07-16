(() => {
  const STORAGE_KEY = 'literary-underground:preferences:v1';
  const DEFAULTS = Object.freeze({ theme: 'sewer-center' });
  const THEMES = Object.freeze(['sewer-center', 'brick-road-pipeline', 'sewage-reservoir', 'dim-passage', 'moss-pipeline']);
  const THEME_COLORS = Object.freeze({
    'sewer-center': '#0c0d18',
    'brick-road-pipeline': '#15110f',
    'sewage-reservoir': '#07131d',
    'dim-passage': '#0d0c0e',
    'moss-pipeline': '#071312',
  });
  const GISCUS_THEMES = Object.freeze({
    'sewer-center': 'giscus-sewer-center.css',
    'brick-road-pipeline': 'giscus-brick-road-pipeline.css',
    'sewage-reservoir': 'giscus-sewage-reservoir.css',
    'dim-passage': 'giscus-dim-passage.css',
    'moss-pipeline': 'giscus-moss-pipeline.css',
  });
  const GISCUS_BASE = 'https://cdn.jsdelivr.net/gh/SeAh-Yoo/SeAh-Yoo.github.io@main/styles/';

  const normalize = (value = {}) => {
    return {
      ...value,
      theme: THEMES.includes(value.theme) ? value.theme : DEFAULTS.theme,
    };
  };

  const read = () => {
    try {
      return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (_error) {
      return { ...DEFAULTS };
    }
  };

  let preferences = read();

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (_error) {
      // Storage may be unavailable in privacy-restricted contexts.
    }
  };

  const giscusThemeUrl = (theme) => `${GISCUS_BASE}${GISCUS_THEMES[theme] || GISCUS_THEMES[DEFAULTS.theme]}`;

  const applyTheme = (theme) => {
    const selectedTheme = THEMES.includes(theme) ? theme : DEFAULTS.theme;
    document.documentElement.dataset.theme = selectedTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = THEME_COLORS[selectedTheme];
    }

    const giscusContainer = document.querySelector('[data-giscus-container]');
    const themeUrl = giscusThemeUrl(selectedTheme);
    if (giscusContainer) {
      giscusContainer.dataset.theme = themeUrl;
    }

    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame?.contentWindow) {
      giscusFrame.contentWindow.postMessage({ giscus: { setConfig: { theme: themeUrl } } }, 'https://giscus.app');
    }
  };

  const syncControls = () => {
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
      select.value = preferences.theme;
    });
  };

  const set = (key, value) => {
    const next = key === 'theme' && !THEMES.includes(value) ? DEFAULTS.theme : value;
    preferences = normalize({ ...preferences, [key]: next });
    persist();

    if (key === 'theme') {
      applyTheme(preferences.theme);
    }

    syncControls();
    window.dispatchEvent(new CustomEvent('site-preference-change', {
      detail: { key, value: preferences[key], preferences: { ...preferences } },
    }));
    return preferences[key];
  };

  window.sitePreferences = Object.freeze({
    storageKey: STORAGE_KEY,
    themes: THEMES,
    get: (key) => preferences[key],
    getAll: () => ({ ...preferences }),
    set,
  });

  applyTheme(preferences.theme);

  const bindControls = () => {
    applyTheme(preferences.theme);
    syncControls();
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
      select.addEventListener('change', () => set('theme', select.value));
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindControls, { once: true });
  } else {
    bindControls();
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    preferences = read();
    applyTheme(preferences.theme);
    syncControls();
  });
})();
