/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockerNotes__columns */

const renderEntityLockerNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Locker Notes',
    fragment: 'entities/locker_notes/all',
    stateSaveWebStorageKey: 'entity_locker_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityLockerNotes__columns.action(renderEntityLockerNotesPage__views.all.fragment),

          entityLockerNotes__columns.id,
          entityLockerNotes__columns.locker,
          entityLockerNotes__columns.locker__name,
          entityLockerNotes__columns.date,
          entityLockerNotes__columns.note,

          entityLockerNotes__columns.__CreatedOn,
          entityLockerNotes__columns.__ModifiedOn,
          entityLockerNotes__columns.__Owner,
          entityLockerNotes__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityLockerNotesPage */
function renderEntityLockerNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLockerNotesPage__views)) {
    const fragment = renderEntityLockerNotesPage__views.all.fragment;
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
    const currentLocationView = renderEntityLockerNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationView.stateSaveWebStorageKey);
    }

    const definition = currentLocationView.definition(auth, opt);

    const views = Object.keys(renderEntityLockerNotesPage__views).map((key) => ({
      title: renderEntityLockerNotesPage__views[key].title,
      fragment: `${renderEntityLockerNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKER_NOTES_URL */',

        newButtonLabel: 'New Locker Note',
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
        { name: 'Locker Notes', link: `#${renderEntityLockerNotesPage__views.all.fragment}` },
        { name: currentLocationView.breadcrumb, link: `#${currentLocationView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locker Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
