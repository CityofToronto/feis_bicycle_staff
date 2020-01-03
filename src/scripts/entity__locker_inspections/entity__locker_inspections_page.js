/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockerInspections__columns */

const renderEntityLockerInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Locker Inspections',
    fragment: 'entities/locker_inspections/all',
    stateSaveWebStorageKey: 'entity_locker_inspections_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityLockerInspections__columns.action(renderEntityLockerInspectionsPage__views.all.fragment),

          entityLockerInspections__columns.id,
          entityLockerInspections__columns.locker,
          entityLockerInspections__columns.locker__name,
          entityLockerInspections__columns.date,
          entityLockerInspections__columns.result(auth),
          entityLockerInspections__columns.note,

          entityLockerInspections__columns.__CreatedOn,
          entityLockerInspections__columns.__ModifiedOn,
          entityLockerInspections__columns.__Owner,
          entityLockerInspections__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityLockerInspectionsPage */
function renderEntityLockerInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLockerInspectionsPage__views)) {
    const fragment = renderEntityLockerInspectionsPage__views.all.fragment;
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
    const currentLockerView = renderEntityLockerInspectionsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLockerView.stateSaveWebStorageKey);
    }

    const definition = currentLockerView.definition(auth, opt);

    const views = Object.keys(renderEntityLockerInspectionsPage__views).map((key) => ({
      title: renderEntityLockerInspectionsPage__views[key].title,
      fragment: `${renderEntityLockerInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKER_INSPECTIONS_URL */',

        newButtonLabel: 'New Locker Inspection',
        newButtonFragment: `${currentLockerView.fragment}/new`,

        stateSaveWebStorageKey: currentLockerView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentLockerView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Locker Inpections', link: `#${renderEntityLockerInspectionsPage__views.all.fragment}` },
        { name: currentLockerView.breadcrumb, link: `#${currentLockerView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locker Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
