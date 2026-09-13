(() => {
  const link = document.querySelector('[data-redirect-target]');
  if (!link) return;
  const target = new URL(link.href, window.location.href);
  target.search = window.location.search;
  target.hash = window.location.hash;
  window.location.replace(target.href);
})();
