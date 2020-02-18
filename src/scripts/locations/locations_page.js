/* global */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locations__views */

/* exported locationsPage */
function locationsPage(app, $container, router, auth, opt, query) {
  // ---
  const ENTITY_VIEWS = locations__views;
  const ENTITY_VIEW = ENTITY_VIEWS[opt];
  const ENTITY_VIEW_DEFAULT = ENTITY_VIEWS.all;

  const REDIRECT_TO_DEFAULT = 'Home';
  const REDIRECT_TO_FRAGMENT_DEFAULT = 'home';

  const RESET_STATES = function (opt, id) {
    renderLocationDetailsNotesPage__resetState(opt, id);
    renderLocationDetailsInspectionsPage__resetState(opt, id);
  };

  const ITEM = 'Locker Location';
  const ITEM_PLURAL = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: ITEM_PLURAL, link: `#${ENTITY_VIEW_DEFAULT.fragment}` },
    { name: ENTITY_VIEW.breadcrumb, link: `#${ENTITY_VIEW.fragment}` }
  ];

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATIONS_URL */';
  // ---

  if (!(opt in ENTITY_VIEWS)) {
    return router.navigate(`${ENTITY_VIEW_DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = REDIRECT_TO_DEFAULT,
      redirectToFragment = REDIRECT_TO_FRAGMENT_DEFAULT,
      resetState
    } = query__stringToObject(query);

    // const stateSaveWebStorageKey = `locations_${opt}`;
    if (resetState === 'yes') {
      // sessionStorage.removeItem(stateSaveWebStorageKey);
      RESET_STATES();
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${ENTITY_VIEW.title}</h2>`);

    const definition = ENTITY_VIEW.definition(auth, opt);

    const views = Object.keys(ENTITY_VIEWS).map((key) => ({
      title: ENTITY_VIEWS[key].title,
      fragment: `${ENTITY_VIEWS[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: DATAACCESS_URL,

        newButtonLabel: 'New Location',
        newButtonFragment: `locations/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      app.setBreadcrumb(BREADCRUMBS, true);
      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
