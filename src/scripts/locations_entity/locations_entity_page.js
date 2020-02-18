/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationsEntity__views */

/* exported locationsEntityPage */
function locationsEntityPage(app, $container, router, auth, opt, query) {

  // ---
  const ENTITY_VIEWS = locationsEntity__views;
  const ENTITY_VIEW = ENTITY_VIEWS[opt];
  const ENTITY_VIEW_DEFAULT = ENTITY_VIEWS.all;

  const REDIRECT_TO_DEFAULT = 'Entities';
  const REDIRECT_TO_FRAGMENT_DEFAULT = 'entities';

  const RESET_STATES = function () {
    sessionStorage.removeItem(ENTITY_VIEW.stateSaveWebStorageKey);
  };

  const ITEM = 'Locker Location';
  const ITEM_PLURAL = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: '#entities' },
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

    if (resetState === 'yes') {
      RESET_STATES();
    }

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    return Promise.resolve().then(() => {
      return renderDatatable($container, ENTITY_VIEW.definition(auth), {
        auth,
        url: DATAACCESS_URL,

        newButtonLabel: `New ${ITEM}`,
        newButtonFragment: `${ENTITY_VIEW.fragment}/new`,

        stateSaveWebStorageKey: ENTITY_VIEW.stateSaveWebStorageKey,

        views: Object.keys(ENTITY_VIEWS).map((key) => ({
          title: ENTITY_VIEWS[key].title,
          fragment: `${ENTITY_VIEWS[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
          isCurrent: key === opt
        }))
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${ENTITY_VIEW.title}</h2>`);

      app.setBreadcrumb(BREADCRUMBS, true);
      app.setTitle(ITEM_PLURAL);
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
