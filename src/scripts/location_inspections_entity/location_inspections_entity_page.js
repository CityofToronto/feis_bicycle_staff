/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationInspectionsEntity__views */

/* exported renderEntityLocationInspectionsPage */
function renderEntityLocationInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in locationInspectionsEntity__views)) {
    const fragment = locationInspectionsEntity__views.all.fragment;
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
    const currentLocationView = locationInspectionsEntity__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationView.stateSaveWebStorageKey);
    }

    const definition = currentLocationView.definition(auth, opt);

    const views = Object.keys(locationInspectionsEntity__views).map((key) => ({
      title: locationInspectionsEntity__views[key].title,
      fragment: `${locationInspectionsEntity__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */',

        newButtonLabel: 'New Location Inspection',
        newButtonFragment: `${currentLocationView.fragment}/new`,

        stateSaveWebStorageKey: currentLocationView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentLocationView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Location Inpections', link: `#${locationInspectionsEntity__views.all.fragment}` },
        { name: currentLocationView.breadcrumb, link: `#${currentLocationView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Location Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
