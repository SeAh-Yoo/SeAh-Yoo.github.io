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
  const topRevealThreshold = 24;
  const revealDistance = 96;
  const directionDeadZone = 2;
  let frameId = 0;
  let lastScrollY = Math.max(0, window.scrollY);
  let upwardTravel = 0;

  const setCollapsed = (collapsed) => {
    const shouldCollapse = mobileQuery.matches && collapsed;

    sidebar.classList.toggle('is-compact', shouldCollapse);
    collapseRegion.setAttribute('aria-hidden', String(shouldCollapse));
    collapseRegion.inert = shouldCollapse;
  };

  const syncSidebarState = () => {
    frameId = 0;

    const currentScrollY = Math.max(0, window.scrollY);
    const scrollDelta = currentScrollY - lastScrollY;

    if (!mobileQuery.matches) {
      upwardTravel = 0;
      setCollapsed(false);
    } else if (currentScrollY <= topRevealThreshold) {
      upwardTravel = 0;
      setCollapsed(false);
    } else if (scrollDelta > directionDeadZone) {
      upwardTravel = 0;

      if (currentScrollY > collapseThreshold) {
        setCollapsed(true);
      }
    } else if (scrollDelta < -directionDeadZone) {
      if (sidebar.classList.contains('is-compact')) {
        upwardTravel += Math.abs(scrollDelta);

        if (upwardTravel >= revealDistance) {
          upwardTravel = 0;
          setCollapsed(false);
        }
      } else {
        upwardTravel = 0;
      }
    }

    lastScrollY = currentScrollY;
  };

  const resetSidebarState = () => {
    lastScrollY = Math.max(0, window.scrollY);
    upwardTravel = 0;
    setCollapsed(mobileQuery.matches && lastScrollY > collapseThreshold);
  };

  const scheduleSidebarSync = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(syncSidebarState);
  };

  topButton.addEventListener('click', () => {
    upwardTravel = 0;
    window.scrollTo({
      top: 0,
      behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
    });

    if (reducedMotionQuery.matches) {
      window.requestAnimationFrame(syncSidebarState);
    }
  });

  window.addEventListener('scroll', scheduleSidebarSync, { passive: true });
  window.addEventListener('pageshow', resetSidebarState);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', resetSidebarState);
  } else {
    mobileQuery.addListener(resetSidebarState);
  }

  resetSidebarState();
})();