/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityStations__columns */

const renderEntityStationsPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Stations',
    fragment: 'entities/stations/all',
    stateSaveWebStorageKey: 'entity_stations_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityStations__columns).map((key) => {
          if (key === 'action') {
            return entityStations__columns[key](renderEntityStationsPage__views.all.fragment);
          }
          return typeof entityStations__columns[key] === 'function' ? entityStations__columns[key](auth)
            : entityStations__columns[key];
        }),

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityStationsPage */
function renderEntityStationsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityStationsPage__views)) {
    const fragment = renderEntityStationsPage__views.all.fragment;
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

    const currentStationView = renderEntityStationsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentStationView.stateSaveWebStorageKey);
    }

    const definition = currentStationView.definition(auth, opt);

    const views = Object.keys(renderEntityStationsPage__views).map((key) => ({
      title: renderEntityStationsPage__views[key].title,
      fragment: `${renderEntityStationsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_STATIONS_URL */',

        newButtonLabel: 'New Station',
        newButtonFragment: `${currentStationView.fragment}/new`,

        stateSaveWebStorageKey: currentStationView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentStationView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Stations', link: `#${renderEntityStationsPage__views.all.fragment}` },
        { name: currentStationView.breadcrumb, link: `#${currentStationView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Stations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
