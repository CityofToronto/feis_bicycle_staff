/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLocationInspections__columns */

const renderEntityLocationInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Location Inspections',
    fragment: 'entities/location_inspections/all',
    stateSaveWebStorageKey: 'entity_location_inspections_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityLocationInspections__columns.action(renderEntityLocationInspectionsPage__views.all.fragment),

          entityLocationInspections__columns.id,
          entityLocationInspections__columns.location,
          entityLocationInspections__columns.location__site_name,
          entityLocationInspections__columns.date,
          entityLocationInspections__columns.result(auth),
          entityLocationInspections__columns.note,

          entityLocationInspections__columns.__CreatedOn,
          entityLocationInspections__columns.__ModifiedOn,
          entityLocationInspections__columns.__Owner,
          entityLocationInspections__columns.__Status
        ],

        order: [
          [1, 'asc']
        ],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityLocationInspectionsPage */
function renderEntityLocationInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLocationInspectionsPage__views)) {
    const fragment = renderEntityLocationInspectionsPage__views.all.fragment;
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
    const currentLocationView = renderEntityLocationInspectionsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationView.stateSaveWebStorageKey);
    }

    const definition = currentLocationView.definition(auth, opt);

    const views = Object.keys(renderEntityLocationInspectionsPage__views).map((key) => ({
      title: renderEntityLocationInspectionsPage__views[key].title,
      fragment: `${renderEntityLocationInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
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
        { name: 'Location Inpections', link: `#${renderEntityLocationInspectionsPage__views.all.fragment}` },
        { name: currentLocationView.breadcrumb, link: `#${currentLocationView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Location Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
