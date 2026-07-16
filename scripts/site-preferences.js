(() => {
  const identityElement = document.getElementById('site-identity-data');
  let identity = {};

  try {
    identity = JSON.parse(identityElement?.textContent || '{}');
  } catch (error) {
    console.warn(error);
  }

  const languageOptions = Array.isArray(identity.settings?.supported_languages)
    ? identity.settings.supported_languages
    : [];
  const languages = languageOptions.map((option) => option.id).filter(Boolean);
  const defaultLanguage = languages.includes(identity.settings?.default_language)
    ? identity.settings.default_language
    : languages[0] || 'ko';
  const STORAGE_KEY = identity.settings?.preference_storage_key || 'literary-underground:preferences:v1';
  const DEFAULTS = Object.freeze({ theme: 'sewer-center', language: defaultLanguage });
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
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const originalDocumentTitle = document.title;
  const localizedMetaSelectors = [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ];
  const originalMetaContent = new Map(localizedMetaSelectors.map((selector) => {
    const element = document.querySelector(selector);
    return [element, element?.content || ''];
  }).filter(([element]) => element));
  const translationMaps = new Map();
  let postIndexPromise;
  let preferences;

  const normalize = (value = {}) => ({
    ...value,
    theme: THEMES.includes(value.theme) ? value.theme : DEFAULTS.theme,
    language: languages.includes(value.language) ? value.language : DEFAULTS.language,
  });

  const read = () => {
    try {
      return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (_error) {
      return { ...DEFAULTS };
    }
  };

  preferences = read();

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (_error) {
      // Storage may be unavailable in privacy-restricted contexts.
    }
  };

  const getNestedValue = (language, path) => String(path || '').split('.').filter(Boolean).reduce(
    (current, key) => current?.[key],
    identity.locales?.[language],
  );

  const getCopy = (path, fallback = '') => (
    getNestedValue(preferences.language, path)
    ?? getNestedValue(defaultLanguage, path)
    ?? fallback
  );

  const formatCopy = (path, variables = {}, fallback = '') => Object.entries(variables).reduce(
    (message, [key, value]) => String(message).replaceAll(`{${key}}`, String(value)),
    getCopy(path, fallback),
  );

  const collectTranslationPairs = (source, target, pairs = new Map()) => {
    if (typeof source === 'string' && typeof target === 'string' && source && source !== target) {
      pairs.set(source, target);
      return pairs;
    }

    if (!source || !target || typeof source !== 'object' || typeof target !== 'object') {
      return pairs;
    }

    Object.keys(source).forEach((key) => collectTranslationPairs(source[key], target[key], pairs));
    return pairs;
  };

  const getTranslationMap = (language) => {
    if (!translationMaps.has(language)) {
      const pairs = collectTranslationPairs(
        identity.locales?.[defaultLanguage],
        identity.locales?.[language],
      );
      translationMaps.set(language, Array.from(pairs.entries()).sort((a, b) => b[0].length - a[0].length));
    }

    return translationMaps.get(language);
  };

  const translateText = (value, language) => {
    if (language === defaultLanguage) {
      return value;
    }

    return getTranslationMap(language).reduce(
      (translated, [source, target]) => translated.replaceAll(source, target),
      String(value),
    );
  };

  const shouldSkipTranslation = (element) => element?.closest?.(
    'script, style, [data-no-interface-translation], [data-post-field], .post-content',
  );

  const localizeTextNodes = (language) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      if (!shouldSkipTranslation(node.parentElement) && node.nodeValue?.trim()) {
        if (!originalText.has(node)) {
          originalText.set(node, node.nodeValue);
        }
        node.nodeValue = translateText(originalText.get(node), language);
      }
      node = walker.nextNode();
    }
  };

  const localizeAttributes = (language) => {
    document.querySelectorAll('[aria-label], [title], [placeholder]').forEach((element) => {
      if (shouldSkipTranslation(element)) {
        return;
      }

      if (!originalAttributes.has(element)) {
        originalAttributes.set(element, new Map());
      }

      const savedAttributes = originalAttributes.get(element);
      ['aria-label', 'title', 'placeholder'].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) {
          return;
        }
        if (!savedAttributes.has(attribute)) {
          savedAttributes.set(attribute, element.getAttribute(attribute));
        }
        element.setAttribute(attribute, translateText(savedAttributes.get(attribute), language));
      });
    });
  };

  const dateOptions = {
    short: { year: 'numeric', month: 'long', day: 'numeric' },
    'month-day': { month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  const localizeDates = (language) => {
    const locale = getCopy('meta.number_locale', 'ko-KR');
    document.querySelectorAll('time[data-date-style][datetime]').forEach((element) => {
      const date = new Date(element.dateTime);
      if (!Number.isNaN(date.getTime())) {
        element.textContent = new Intl.DateTimeFormat(
          locale,
          dateOptions[element.dataset.dateStyle] || dateOptions.short,
        ).format(date);
      }
    });
  };

  const applyDocumentLanguage = (language) => {
    const htmlLanguage = getNestedValue(language, 'meta.html_lang') || language;
    document.documentElement.lang = htmlLanguage;
    document.documentElement.dataset.language = language;
    document.title = translateText(originalDocumentTitle, language);
    originalMetaContent.forEach((content, element) => {
      element.content = translateText(content, language);
    });
    localizeTextNodes(language);
    localizeAttributes(language);
    localizeDates(language);
    const giscusContainer = document.querySelector('[data-giscus-container]');
    if (giscusContainer) {
      giscusContainer.dataset.lang = language;
    }
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame?.contentWindow) {
      giscusFrame.contentWindow.postMessage({ giscus: { setConfig: { lang: language } } }, 'https://giscus.app');
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

  const formatPostDate = (value, style = 'short') => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(
      getCopy('meta.number_locale', 'ko-KR'),
      dateOptions[style] || dateOptions.short,
    ).format(date);
  };

  const selectPostTranslations = (items, language = preferences.language) => {
    const groups = new Map();

    items.forEach((item) => {
      const key = item.translationKey || item.url;
      if (!groups.has(key)) {
        groups.set(key, new Map());
      }
      groups.get(key).set(item.lang || defaultLanguage, item);
    });

    return Array.from(groups.values()).map((group) => (
      group.get(language) || group.get(defaultLanguage) || group.values().next().value
    ));
  };

  const loadPostIndex = () => {
    if (!postIndexPromise) {
      postIndexPromise = fetch(identity.links?.search_index || '/search.json', { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Post index request failed: ${response.status}`);
          }
          return response.json();
        });
    }
    return postIndexPromise;
  };

  const localizedCategory = (item) => {
    const categories = getCopy('pages.categories.items', []);
    return categories.find((category) => category.id === item.categoryKey)?.label || item.category || '';
  };

  const localizePostCards = async () => {
    const cards = Array.from(document.querySelectorAll('[data-post-card][data-translation-key]'));
    if (!cards.length) {
      return;
    }

    try {
      const items = await loadPostIndex();
      const selectedItems = selectPostTranslations(items);
      const localizedByKey = new Map(selectedItems.map((item) => [item.translationKey || item.url, item]));

      cards.forEach((card) => {
        const item = localizedByKey.get(card.dataset.translationKey);
        if (!item) {
          return;
        }

        if (card.matches('a')) {
          card.href = item.url;
        }
        if (card.dataset.postAriaPrefix) {
          card.setAttribute('aria-label', `${translateText(card.dataset.postAriaPrefix, preferences.language)}: ${item.title || ''}`);
        }
        card.dataset.postLanguage = item.lang || defaultLanguage;

        card.querySelectorAll('[data-post-title]').forEach((element) => { element.textContent = item.title || ''; });
        card.querySelectorAll('[data-post-initial]').forEach((element) => { element.textContent = (item.title || '').slice(0, 1); });
        card.querySelectorAll('[data-post-description]').forEach((element) => { element.textContent = item.description || ''; });
        card.querySelectorAll('[data-post-category]').forEach((element) => { element.textContent = localizedCategory(item); });
        card.querySelectorAll('[data-post-date]').forEach((element) => {
          element.textContent = formatPostDate(item.date, element.dataset.dateStyle || 'short');
          element.setAttribute('datetime', item.date);
        });
        card.querySelectorAll('a[data-post-link]').forEach((element) => { element.href = item.url; });
        card.querySelectorAll('img[data-post-image]').forEach((element) => {
          if (item.image) {
            element.src = item.image;
          }
        });
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const getPostTranslationData = () => {
    const element = document.getElementById('post-translation-data');
    if (!element) {
      return null;
    }
    try {
      return JSON.parse(element.textContent || 'null');
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  const redirectLocalizedPost = () => {
    const postTranslations = getPostTranslationData();
    if (!postTranslations?.urls) {
      return;
    }

    const target = postTranslations.urls[preferences.language] || postTranslations.urls[defaultLanguage];
    if (!target) {
      return;
    }

    const targetUrl = new URL(target, window.location.origin);
    const currentUrl = new URL(window.location.href);
    if (targetUrl.pathname !== currentUrl.pathname) {
      window.location.replace(targetUrl.href);
    }
  };

  const syncControls = () => {
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
      select.value = preferences.theme;
    });
    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.value = preferences.language;
    });
    const selectedOption = languageOptions.find((option) => option.id === preferences.language);
    document.querySelectorAll('[data-language-flag]').forEach((element) => {
      element.textContent = selectedOption?.flag || '';
    });
    document.querySelectorAll('[data-language-flag-image]').forEach((element) => {
      const icon = selectedOption?.icon;
      if (icon) {
        element.setAttribute('src', icon);
      }
    });
  };

  const set = (key, value) => {
    const next = key === 'theme' && !THEMES.includes(value)
      ? DEFAULTS.theme
      : key === 'language' && !languages.includes(value) ? DEFAULTS.language : value;
    preferences = normalize({ ...preferences, [key]: next });
    persist();

    if (key === 'theme') {
      applyTheme(preferences.theme);
    }
    if (key === 'language') {
      applyDocumentLanguage(preferences.language);
      localizePostCards();
      redirectLocalizedPost();
    }

    syncControls();
    window.dispatchEvent(new CustomEvent('site-preference-change', {
      detail: { key, value: preferences[key], preferences: { ...preferences } },
    }));
    return preferences[key];
  };

  window.siteIdentity = Object.freeze({
    data: identity,
    get language() { return preferences.language; },
    get: getCopy,
    format: formatCopy,
    formatPostDate,
    selectPostTranslations,
    loadPostIndex,
  });

  window.sitePreferences = Object.freeze({
    storageKey: STORAGE_KEY,
    themes: THEMES,
    languages,
    get: (key) => preferences[key],
    getAll: () => ({ ...preferences }),
    set,
  });

  applyTheme(preferences.theme);
  document.documentElement.lang = getCopy('meta.html_lang', preferences.language);
  document.documentElement.dataset.language = preferences.language;

  const bindControls = () => {
    applyTheme(preferences.theme);
    applyDocumentLanguage(preferences.language);
    syncControls();
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
      select.addEventListener('change', () => set('theme', select.value));
    });
    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.addEventListener('change', () => set('language', select.value));
    });
    localizePostCards();
    redirectLocalizedPost();
    document.documentElement.dataset.languageReady = 'true';
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
    applyDocumentLanguage(preferences.language);
    syncControls();
    localizePostCards();
    redirectLocalizedPost();
  });
})();
