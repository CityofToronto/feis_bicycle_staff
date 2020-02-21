/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global lockersEntity__views */

/* exported lockersEntityPage */
function lockersEntityPage(app, $container, router, auth, opt1, query) {

  // ---
  const VIEWS = lockersEntity__views;

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt1];

  const DEFAULT_REDIRECT = 'Entities';
  const DEFAULT_REDIRECT_FRAGMENT = 'entities';

  const TITLE = 'Lockers';

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: `#entities` },
    { name: 'Lockers', link: `#${VIEW__DEFAULT.fragment}` },
    { name: VIEW__CURRENT.breadcrumb, link: `#${VIEW__CURRENT.fragment}` }
  ];

  const ITEM = 'Locker';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCKERS_URL */';
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

    // RESET SESSION STORAGE
    if (resetState === 'yes') {
      sessionStorage.removeItem(VIEW__CURRENT.stateSaveWebStorageKey);
    }

    $container.empty();

    // SET TITLE AND BREADCRUMB
    app.setBreadcrumb(BREADCRUMBS, true);
    app.setTitle(TITLE);

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
