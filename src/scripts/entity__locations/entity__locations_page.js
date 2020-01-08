/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLocations__columns */

const renderEntityLocationsPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locations',
    fragment: 'entities/locations/all',
    stateSaveWebStorageKey: 'entity_locations_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityLocations__columns).map((key) => {
          if (key === 'action') {
            return entityLocations__columns[key](renderEntityLocationsPage__views.all.fragment);
          }
          return typeof entityLocations__columns[key] === 'function' ? entityLocations__columns[key](auth)
            : entityLocations__columns[key];
        }),

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityLocationsPage */
function renderEntityLocationsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLocationsPage__views)) {
    const fragment = renderEntityLocationsPage__views.all.fragment;
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

    const currentLocationView = renderEntityLocationsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationView.stateSaveWebStorageKey);
    }

    const definition = currentLocationView.definition(auth, opt);

    const views = Object.keys(renderEntityLocationsPage__views).map((key) => ({
      title: renderEntityLocationsPage__views[key].title,
      fragment: `${renderEntityLocationsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATIONS_URL */',

        newButtonLabel: 'New Location',
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
        { name: 'Locations', link: `#${renderEntityLocationsPage__views.all.fragment}` },
        { name: currentLocationView.breadcrumb, link: `#${currentLocationView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
