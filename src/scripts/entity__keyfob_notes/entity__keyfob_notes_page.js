/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityKeyfobNotes__columns */

const renderEntityKeyfobNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Key Fob Notes',
    fragment: 'entities/keyfob_notes/all',
    stateSaveWebStorageKey: 'entity_keyfob_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityKeyfobNotes__columns.action(renderEntityKeyfobNotesPage__views.all.fragment),

          entityKeyfobNotes__columns.id,
          entityKeyfobNotes__columns.keyfob,
          entityKeyfobNotes__columns.keyfob__number,
          entityKeyfobNotes__columns.date,
          entityKeyfobNotes__columns.note,

          entityKeyfobNotes__columns.__CreatedOn,
          entityKeyfobNotes__columns.__ModifiedOn,
          entityKeyfobNotes__columns.__Owner,
          entityKeyfobNotes__columns.__Status
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

/* exported renderEntityKeyfobNotesPage */
function renderEntityKeyfobNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityKeyfobNotesPage__views)) {
    const fragment = renderEntityKeyfobNotesPage__views.all.fragment;
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
    const currentKeyfobNoteView = renderEntityKeyfobNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentKeyfobNoteView.stateSaveWebStorageKey);
    }

    const definition = currentKeyfobNoteView.definition(auth, opt);

    const views = Object.keys(renderEntityKeyfobNotesPage__views).map((key) => ({
      title: renderEntityKeyfobNotesPage__views[key].title,
      fragment: `${renderEntityKeyfobNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_KEYFOB_NOTES_URL */',

        newButtonLabel: 'New Key Fob Note',
        newButtonFragment: `${currentKeyfobNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentKeyfobNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentKeyfobNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Key Fob Notes', link: `#${renderEntityKeyfobNotesPage__views.all.fragment}` },
        { name: currentKeyfobNoteView.breadcrumb, link: `#${currentKeyfobNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Key Fob Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
