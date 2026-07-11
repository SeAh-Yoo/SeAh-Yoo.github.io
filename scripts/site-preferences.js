(() => {
  const STORAGE_KEY = 'literary-underground:preferences:v1';
  const DEFAULTS = Object.freeze({ theme: 'unit-01' });
  const THEMES = Object.freeze(['unit-01', 'unit-02', 'kivotos']);
  const THEME_LABELS = Object.freeze({
    'unit-01': '초호기',
    'unit-02': '2호기',
    kivotos: '키보토스',
  });
  const THEME_COLORS = Object.freeze({
    'unit-01': '#100d24',
    'unit-02': '#21080d',
    kivotos: '#06172a',
  });
  const GISCUS_THEMES = Object.freeze({
    'unit-01': 'giscus-unit-01.css',
    'unit-02': 'giscus-unit-02.css',
    kivotos: 'giscus-kivotos.css',
  });
  const GISCUS_BASE = 'https://cdn.jsdelivr.net/gh/SeAh-Yoo/SeAh-Yoo.github.io@main/styles/';

  const normalize = (value = {}) => ({
    ...value,
    theme: THEMES.includes(value.theme) ? value.theme : DEFAULTS.theme,
  });

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
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      const active = button.dataset.themeOption === preferences.theme;
      button.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-theme-status]').forEach((status) => {
      status.textContent = THEME_LABELS[preferences.theme];
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
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => set('theme', button.dataset.themeOption));
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
