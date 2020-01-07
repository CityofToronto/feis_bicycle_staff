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
        columns: [
          entityStations__columns.action(renderEntityStationsPage__views.all.fragment),

          entityStations__columns.id,
          entityStations__columns.site_name,
          entityStations__columns.description,
          entityStations__columns.civic_address,
          entityStations__columns.municipality,
          entityStations__columns.province(auth),
          entityStations__columns.postal_code,
          entityStations__columns.primary_contact_first_name,
          entityStations__columns.primary_contact_last_name,
          entityStations__columns.primary_contact_email,
          entityStations__columns.primary_contact_primary_phone,
          entityStations__columns.primary_contact_alternate_phone,
          entityStations__columns.alternate_contact_first_name,
          entityStations__columns.alternate_contact_last_name,
          entityStations__columns.alternate_contact_email,
          entityStations__columns.alternate_contact_primary_phone,
          entityStations__columns.alternate_contact_alternate_phone,
          entityStations__columns.capacity,
          entityStations__columns.latest_note,
          entityStations__columns.latest_note__date,
          entityStations__columns.latest_note__note,
          entityStations__columns.latest_inspection,
          entityStations__columns.latest_inspection__date,
          entityStations__columns.latest_inspection__result(auth),
          entityStations__columns.latest_inspection__note,

          entityStations__columns.__CreatedOn,
          entityStations__columns.__ModifiedOn,
          entityStations__columns.__Owner,
          entityStations__columns.__Status
        ],

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
