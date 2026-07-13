(() => {
  const STORAGE_KEY = 'literary-underground:preferences:v1';
  const DEFAULTS = Object.freeze({ theme: 'unit-violet' });
  const THEMES = Object.freeze(['unit-violet', 'ember-white', 'azure-form', 'sovereign-obsidian', 'neon-shell']);
  const LEGACY_THEMES = Object.freeze({
    'unit-01': 'unit-violet',
    'unit-02': 'ember-white',
    kivotos: 'azure-form',
  });
  const THEME_COLORS = Object.freeze({
    'unit-violet': '#0c0d18',
    'ember-white': '#15110f',
    'azure-form': '#07131d',
    'sovereign-obsidian': '#0d0c0e',
    'neon-shell': '#071312',
  });
  const GISCUS_THEMES = Object.freeze({
    'unit-violet': 'giscus-unit-violet.css',
    'ember-white': 'giscus-ember-white.css',
    'azure-form': 'giscus-azure-form.css',
    'sovereign-obsidian': 'giscus-sovereign-obsidian.css',
    'neon-shell': 'giscus-neon-shell.css',
  });
  const GISCUS_BASE = 'https://cdn.jsdelivr.net/gh/SeAh-Yoo/SeAh-Yoo.github.io@main/styles/';

  const normalize = (value = {}) => {
    const migratedTheme = LEGACY_THEMES[value.theme] || value.theme;
    return {
      ...value,
      theme: THEMES.includes(migratedTheme) ? migratedTheme : DEFAULTS.theme,
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
