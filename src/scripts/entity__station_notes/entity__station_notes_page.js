/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityStationNotes__columns */

const renderEntityStationNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Station Notes',
    fragment: 'entities/station_notes/all',
    stateSaveWebStorageKey: 'entity_station_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityStationNotes__columns.action(renderEntityStationNotesPage__views.all.fragment),

          entityStationNotes__columns.id,
          entityStationNotes__columns.station,
          entityStationNotes__columns.station__site_name,
          entityStationNotes__columns.date,
          entityStationNotes__columns.note,

          entityStationNotes__columns.__CreatedOn,
          entityStationNotes__columns.__ModifiedOn,
          entityStationNotes__columns.__Owner,
          entityStationNotes__columns.__Status
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

/* exported renderEntityStationNotesPage */
function renderEntityStationNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityStationNotesPage__views)) {
    const fragment = renderEntityStationNotesPage__views.all.fragment;
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
    const currentStationNoteView = renderEntityStationNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentStationNoteView.stateSaveWebStorageKey);
    }

    const definition = currentStationNoteView.definition(auth, opt);

    const views = Object.keys(renderEntityStationNotesPage__views).map((key) => ({
      title: renderEntityStationNotesPage__views[key].title,
      fragment: `${renderEntityStationNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_STATION_NOTES_URL */',

        newButtonLabel: 'New Station Note',
        newButtonFragment: `${currentStationNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentStationNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentStationNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Station Notes', link: `#${renderEntityStationNotesPage__views.all.fragment}` },
        { name: currentStationNoteView.breadcrumb, link: `#${currentStationNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Station Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
