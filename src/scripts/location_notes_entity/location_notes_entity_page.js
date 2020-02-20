/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationNotesEntity__views */

/* exported locationNotesEntityPage */
function locationNotesEntityPage(app, $container, router, auth, opt1, query) {

  // ---
  const VIEWS = locationNotesEntity__views;

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt1];

  const DEFAULT_REDIRECT = 'Entities';
  const DEFAULT_REDIRECT_FRAGMENT = 'entities';

  const TITLE = 'Location Notes';

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: `#entities` },
    { name: 'Location Notes', link: `#${VIEW__DEFAULT.fragment}` },
    { name: VIEW__CURRENT.breadcrumb, link: `#${VIEW__CURRENT.fragment}` }
  ];

  const ITEM = 'Note';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_NOTES_URL */';
  // ---

  if (!(opt1 in VIEWS)) {
    return router.navigate(`${VIEW__DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = DEFAULT_REDIRECT,
      redirectToFragment = DEFAULT_REDIRECT_FRAGMENT,
      resetState
    } = query__stringToObject(query);

    $container.empty();

    // SET TITLE AND BREADCRUMB
    app.setBreadcrumb(BREADCRUMBS, true);
    app.setTitle(TITLE);

    // RESET SESSION STORAGE
    if (resetState === 'yes') {
      sessionStorage.removeItem(VIEW__CURRENT.stateSaveWebStorageKey);
    }

    // ADD REDIRECT AND SUB TITLE
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${VIEW__CURRENT.title}</h2>`);

    // ADD DATATABLE
    return Promise.resolve().then(() => {
      return renderDatatable($container, VIEW__CURRENT.definition(auth), {
        auth,
        url: DATAACCESS_URL,

        newButtonLabel: `New ${ITEM}`,
        newButtonFragment: `${VIEW__CURRENT.fragment}/new`,

        stateSaveWebStorageKey: VIEW__CURRENT.stateSaveWebStorageKey,

        views: Object.keys(VIEWS).map((key) => ({
          title: VIEWS[key].title,
          fragment: `${VIEWS[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
          isCurrent: key === opt1
        }))
      });
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
