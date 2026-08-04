(() => {
  const copy = (path, fallback = '') => window.siteIdentity?.get(path, fallback) ?? fallback;
  const sidebar = document.querySelector('[data-mobile-sidebar]');

  if (!sidebar) {
    return;
  }

  const collapseRegion = sidebar.querySelector('[data-sidebar-collapse-region]');
  const quickActions = sidebar.querySelector('.sidebar-quick-actions');
  const topButton = sidebar.querySelector('[data-scroll-top]');

  if (!collapseRegion || !quickActions || !topButton) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const regionId = collapseRegion.id || 'mobile-sidebar-navigation';
  collapseRegion.id = regionId;

  const menuButton = document.createElement('button');
  menuButton.className = 'sidebar-menu-button sidebar-top-button';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-controls', regionId);
  menuButton.setAttribute('data-sidebar-menu', '');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', copy('ui.menu_open_label'));
  menuButton.innerHTML = `<span class="sidebar-menu-icon" aria-hidden="true">☰</span><span class="sidebar-top-label">${copy('ui.menu_button_label')}</span>`;
  quickActions.insertBefore(menuButton, topButton);

  const setExpanded = (expanded, options = {}) => {
    const isMobile = mobileQuery.matches;
    const shouldExpand = !isMobile || expanded;

    sidebar.classList.toggle('is-compact', isMobile && !shouldExpand);
    sidebar.classList.toggle('is-menu-open', isMobile && shouldExpand);
    collapseRegion.setAttribute('aria-hidden', String(isMobile && !shouldExpand));
    collapseRegion.inert = isMobile && !shouldExpand;
    menuButton.hidden = !isMobile;
    menuButton.setAttribute('aria-expanded', String(isMobile && shouldExpand));
    menuButton.setAttribute('aria-label', shouldExpand ? copy('ui.menu_close_label') : copy('ui.menu_open_label'));

    const icon = menuButton.querySelector('.sidebar-menu-icon');
    if (icon) {
      icon.textContent = shouldExpand ? '×' : '☰';
    }

    if (options.focusButton && isMobile) {
      menuButton.focus({ preventScroll: true });
    }
  };

  const isExpanded = () => !sidebar.classList.contains('is-compact');

  const resetSidebarState = () => {
    setExpanded(!mobileQuery.matches);
  };

  menuButton.addEventListener('click', () => {
    setExpanded(!isExpanded());
  });

  topButton.addEventListener('click', () => {
    if (mobileQuery.matches) {
      setExpanded(false);
    }

    window.scrollTo({
      top: 0,
      behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
    });
  });

  collapseRegion.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (link && mobileQuery.matches) {
      setExpanded(false);
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (
      mobileQuery.matches &&
      isExpanded() &&
      !sidebar.contains(event.target)
    ) {
      setExpanded(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileQuery.matches && isExpanded()) {
      setExpanded(false, { focusButton: true });
    }
  });

  window.addEventListener('pageshow', resetSidebarState);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', resetSidebarState);
  } else {
    mobileQuery.addListener(resetSidebarState);
  }

  resetSidebarState();
})();
