(() => {
  const root = document.documentElement;
  const languageToggle = document.getElementById('language-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = themeToggle.querySelector('[data-theme-icon="moon"]');
  const sunIcon = themeToggle.querySelector('[data-theme-icon="sun"]');
  const themeColor = document.getElementById('theme-color');
  const translatable = [...document.querySelectorAll('[data-i18n][data-en][data-zh]')];
  const languageStorageKey = 'xq-site-language';
  const themeStorageKey = 'xq-site-theme';

  let language = 'en';
  try {
    const saved = window.localStorage.getItem(languageStorageKey);
    if (saved === 'en' || saved === 'zh') language = saved;
  } catch {
    language = 'en';
  }

  let theme = root.dataset.theme === 'dark' || root.dataset.theme === 'light'
    ? root.dataset.theme
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function updateThemeControl() {
    const darkMode = theme === 'dark';
    const actionLabel = language === 'zh'
      ? darkMode ? '切换到白天模式' : '切换到暗黑模式'
      : darkMode ? 'Switch to light mode' : 'Switch to dark mode';

    themeToggle.setAttribute('aria-pressed', String(darkMode));
    themeToggle.setAttribute('aria-label', actionLabel);
    themeToggle.title = actionLabel;
    moonIcon.toggleAttribute('hidden', darkMode);
    sunIcon.toggleAttribute('hidden', !darkMode);
    themeColor.setAttribute('content', darkMode ? '#090a0b' : '#f9f8f4');
  }

  function applyTheme(nextTheme, persist = true) {
    theme = nextTheme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = theme;
    updateThemeControl();
    if (!persist) return;

    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Private browsing may deny storage; the current theme remains active.
    }
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage === 'zh' ? 'zh' : 'en';
    translatable.forEach((node) => {
      node.textContent = node.dataset[language];
    });
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    languageToggle.textContent = language === 'zh' ? 'EN' : '中';
    languageToggle.setAttribute('aria-pressed', String(language === 'zh'));
    languageToggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    document.title = language === 'zh' ? 'XQ. / 研究笔记' : 'XQ. / Research Notebook';
    updateThemeControl();
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Private browsing may deny storage; the page remains fully usable.
    }
  }

  themeToggle.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
  languageToggle.addEventListener('click', () => applyLanguage(language === 'en' ? 'zh' : 'en'));
  applyLanguage(language);
  applyTheme(theme, false);
})();
