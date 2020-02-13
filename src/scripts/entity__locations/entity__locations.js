/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entity__locations__views */

/* exported entity__locations */
function entity__locations(app, $container, router, auth, opt, query) {
  if (!(opt in entity__locations__views)) {
    const fragment = entity__locations__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const currentView = entity__locations__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentView.stateSaveWebStorageKey);
    }

    const definition = currentView.definition(auth);

    const views = Object.keys(entity__locations__views).map((key) => ({
      title: entity__locations__views[key].title,
      fragment: `${entity__locations__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATIONS_URL */',

        newButtonLabel: 'New Location',
        newButtonFragment: `${currentView.fragment}/new`,

        stateSaveWebStorageKey: currentView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Locations', link: `#${entity__locations__views.all.fragment}` },
        { name: currentView.breadcrumb, link: `#${currentView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
