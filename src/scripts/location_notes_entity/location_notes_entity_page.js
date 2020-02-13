/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationNotesEntity__views */
/* exported renderEntityLocationNotesPage */
function renderEntityLocationNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in locationNotesEntity__views)) {
    const fragment = locationNotesEntity__views.all.fragment;
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
    const currentLocationNoteView = locationNotesEntity__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationNoteView.stateSaveWebStorageKey);
    }

    const definition = currentLocationNoteView.definition(auth, opt);

    const views = Object.keys(locationNotesEntity__views).map((key) => ({
      title: locationNotesEntity__views[key].title,
      fragment: `${locationNotesEntity__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

        newButtonLabel: 'New Location Note',
        newButtonFragment: `${currentLocationNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentLocationNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentLocationNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Location Notes', link: `#${locationNotesEntity__views.all.fragment}` },
        { name: currentLocationNoteView.breadcrumb, link: `#${currentLocationNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Location Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
