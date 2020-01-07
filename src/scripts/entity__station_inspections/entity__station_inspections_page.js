/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityStationInspections__columns */

const renderEntityStationInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Station Inspections',
    fragment: 'entities/station_inspections/all',
    stateSaveWebStorageKey: 'entity_station_inspections_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityStationInspections__columns.action(renderEntityStationInspectionsPage__views.all.fragment),

          entityStationInspections__columns.id,
          entityStationInspections__columns.station,
          entityStationInspections__columns.station__site_name,
          entityStationInspections__columns.date,
          entityStationInspections__columns.result(auth),
          entityStationInspections__columns.note,

          entityStationInspections__columns.__CreatedOn,
          entityStationInspections__columns.__ModifiedOn,
          entityStationInspections__columns.__Owner,
          entityStationInspections__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityStationInspectionsPage */
function renderEntityStationInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityStationInspectionsPage__views)) {
    const fragment = renderEntityStationInspectionsPage__views.all.fragment;
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
    const currentStationInspectionView = renderEntityStationInspectionsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentStationInspectionView.stateSaveWebStorageKey);
    }

    const definition = currentStationInspectionView.definition(auth, opt);

    const views = Object.keys(renderEntityStationInspectionsPage__views).map((key) => ({
      title: renderEntityStationInspectionsPage__views[key].title,
      fragment: `${renderEntityStationInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_STATION_INSPECTIONS_URL */',

        newButtonLabel: 'New Station Inspection',
        newButtonFragment: `${currentStationInspectionView.fragment}/new`,

        stateSaveWebStorageKey: currentStationInspectionView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentStationInspectionView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Station Inpections', link: `#${renderEntityStationInspectionsPage__views.all.fragment}` },
        { name: currentStationInspectionView.breadcrumb, link: `#${currentStationInspectionView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Station Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
