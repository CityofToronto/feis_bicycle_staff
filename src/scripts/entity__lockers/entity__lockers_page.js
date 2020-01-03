/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockers__columns */

const renderEntityLockersPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Lockers',
    fragment: 'entities/lockers/all',
    stateSaveWebStorageKey: 'entity_lockers_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityLockers__columns.action(renderEntityLockersPage__views.all.fragment),

          entityLockers__columns.id,
          entityLockers__columns.location,
          entityLockers__columns.location__site_name,
          entityLockers__columns.number,
          entityLockers__columns.description,
          entityLockers__columns.latest_note,
          entityLockers__columns.latest_note__date,
          entityLockers__columns.latest_note__note,
          entityLockers__columns.latest_inspection,
          entityLockers__columns.latest_inspection__date,
          entityLockers__columns.latest_inspection__result(auth),
          entityLockers__columns.latest_inspection__note,

          entityLockers__columns.__CreatedOn,
          entityLockers__columns.__ModifiedOn,
          entityLockers__columns.__Owner,
          entityLockers__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityLockersPage */
function renderEntityLockersPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLockersPage__views)) {
    const fragment = renderEntityLockersPage__views.all.fragment;
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

    const currentLockerView = renderEntityLockersPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLockerView.stateSaveWebStorageKey);
    }

    const definition = currentLockerView.definition(auth, opt);

    const views = Object.keys(renderEntityLockersPage__views).map((key) => ({
      title: renderEntityLockersPage__views[key].title,
      fragment: `${renderEntityLockersPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKERS_URL */',

        newButtonLabel: 'New Locker',
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
        { name: 'Lockers', link: `#${renderEntityLockersPage__views.all.fragment}` },
        { name: currentLockerView.breadcrumb, link: `#${currentLockerView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Lockers');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
