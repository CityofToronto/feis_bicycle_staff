/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationInspectionsEntity__views */

/* exported renderEntityLocationInspectionsPage */
function renderEntityLocationInspectionsPage(app, $container, router, auth, opt, query) {

  // ---
  const ENTITY_VIEWS = locationInspectionsEntity__views;
  const DEFAULT_ENTITY_VIEW = ENTITY_VIEWS.all;
  const CURRENT_ENTITY_VIEW = ENTITY_VIEWS[opt];

  const DEFAULT_REDIRECT_TO = 'Entities';
  const DEFAULT_REDIRECT_TO_FRAGMENT = 'entities';

  const ITEM = 'Locker Location Inspection';
  const PLURAL_ITEM = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: '#entities' },
    { name: PLURAL_ITEM, link: `#${DEFAULT_ENTITY_VIEW.fragment}` },
    { name: CURRENT_ENTITY_VIEW.breadcrumb, link: `#${CURRENT_ENTITY_VIEW.fragment}` }
  ];

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */';
  // ---

  if (!(opt in ENTITY_VIEWS)) {
    return router.navigate(`${DEFAULT_ENTITY_VIEW.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = DEFAULT_REDIRECT_TO,
      redirectToFragment = DEFAULT_REDIRECT_TO_FRAGMENT,
      resetState
    } = query__stringToObject(query);

    $container.empty();

    // SET TITLE AND BREADCRUMB
    app.setBreadcrumb(BREADCRUMBS, true);
    app.setTitle(PLURAL_ITEM);

    // RESET SESSION STORAGE
    if (resetState === 'yes') {
      sessionStorage.removeItem(CURRENT_ENTITY_VIEW.stateSaveWebStorageKey);
    }

    // ADD REDIRECT AND SUB TITLE
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${CURRENT_ENTITY_VIEW.title}</h2>`);

    // ADD DATATABLE
    return Promise.resolve().then(() => {
      return renderDatatable($container, CURRENT_ENTITY_VIEW.definition(auth), {
        auth,
        url: DATAACCESS_URL,

        newButtonLabel: `New ${ITEM}`,
        newButtonFragment: `${CURRENT_ENTITY_VIEW.fragment}/new`,

        stateSaveWebStorageKey: CURRENT_ENTITY_VIEW.stateSaveWebStorageKey,

        views: Object.keys(ENTITY_VIEWS).map((key) => ({
          title: ENTITY_VIEWS[key].title,
          fragment: `${ENTITY_VIEWS[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
          isCurrent: key === opt
        }))
      });
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
