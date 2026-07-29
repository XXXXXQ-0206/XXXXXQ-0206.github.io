(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('language-toggle');
  const translatable = [...document.querySelectorAll('[data-i18n][data-en][data-zh]')];
  const storageKey = 'xq-site-language';

  let language = 'en';
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'en' || saved === 'zh') language = saved;
  } catch {
    language = 'en';
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage === 'zh' ? 'zh' : 'en';
    translatable.forEach((node) => {
      node.textContent = node.dataset[language];
    });
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    toggle.textContent = language === 'zh' ? 'EN' : '中';
    toggle.setAttribute('aria-pressed', String(language === 'zh'));
    toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    document.title = language === 'zh' ? 'XQ. / 研究笔记' : 'XQ. / Research Notebook';
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // Private browsing may deny storage; the page remains fully usable.
    }
  }

  toggle.addEventListener('click', () => applyLanguage(language === 'en' ? 'zh' : 'en'));
  applyLanguage(language);
})();
