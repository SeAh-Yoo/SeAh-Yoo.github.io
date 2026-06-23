(() => {
  const sidebar = document.querySelector('[data-mobile-sidebar]');

  if (!sidebar) {
    return;
  }

  const collapseRegion = sidebar.querySelector('[data-sidebar-collapse-region]');
  const topButton = sidebar.querySelector('[data-scroll-top]');

  if (!collapseRegion || !topButton) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const collapseThreshold = 120;
  let frameId = 0;

  const setCollapsed = (collapsed) => {
    const shouldCollapse = mobileQuery.matches && collapsed;

    sidebar.classList.toggle('is-compact', shouldCollapse);
    collapseRegion.setAttribute('aria-hidden', String(shouldCollapse));
    collapseRegion.inert = shouldCollapse;
  };

  const syncSidebarState = () => {
    frameId = 0;
    setCollapsed(window.scrollY > collapseThreshold);
  };

  const scheduleSidebarSync = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(syncSidebarState);
  };

  topButton.addEventListener('click', () => {
    setCollapsed(false);
    window.scrollTo({
      top: 0,
      behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
    });
  });

  window.addEventListener('scroll', scheduleSidebarSync, { passive: true });
  window.addEventListener('pageshow', syncSidebarState);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncSidebarState);
  } else {
    mobileQuery.addListener(syncSidebarState);
  }

  syncSidebarState();
})();
