/* global $ */
/* global ajaxes auth__checkLogin fixButtonLinks query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locations__views location_notes__views location_inspections__views */

/* exported locationInspectionsPage */
function locationInspectionsPage(app, $container, router, auth, opt1, id1, opt2, query) {

  // ---
  const PARENT_VIEWS = locations__views;

  const PARENT_VIEW__DEFAULT = PARENT_VIEWS.all;
  const PARENT_VIEW__CURRENT = PARENT_VIEWS[opt1];

  const VIEWS = location_inspections__views(PARENT_VIEW__CURRENT, id1);

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt2];

  const DEFAULT_REDIRECT = PARENT_VIEW__CURRENT.title;
  const DEFAULT_REDIRECT_FRAGMENT = PARENT_VIEW__CURRENT.fragment;

  const TITLE__FUNC = function (data) {
    return data.site_name;
  };

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Locker Locations', link: `#${PARENT_VIEW__DEFAULT.fragment}` },
    { name: PARENT_VIEW__CURRENT.breadcrumb, link: `#${PARENT_VIEW__CURRENT.fragment}` }
  ];
  const BREADCRUMBS__FUNC = (data) => BREADCRUMBS.concat({
    name: data.site_name,
    link: `#${VIEW__CURRENT.fragment}/${data.id}`
  });

  const ITEM = 'Location Inspections';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */';
  const DATAACCESS_URL__PARENT = '/* @echo C3DATA_LOCATIONS_URL */';

  const TABS = `
    <div class="navbar">
      <ul class="nav nav-tabs">
        <li class="nav-item" role="presentation">
          <a href="#${PARENT_VIEW__CURRENT.fragment}/${id1}" class="nav-link">Location</a>
        </li>
        <li class="nav-item" role="presentation">
          <a href="#${location_notes__views(PARENT_VIEW__CURRENT, id1)[location_notes__views.active_view_key].fragment}" class="nav-link">Notes</a>
        </li>
        <li class="nav-item active" role="presentation">
          <a href="#${VIEW__CURRENT.fragment}" class="nav-link">Inspections</a>
        </li>
      </ul>
    </div>
  `;

  const RESET_STATES__FUNC = () => { };
  // ---

  if (!(opt1 in PARENT_VIEWS)) {
    return router.navigate(`${PARENT_VIEW__DEFAULT.fragment}/${id1}/${VIEW__DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  if (!(opt2 in VIEWS)) {
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
      RESET_STATES__FUNC();
    }

    $container.empty();

    // SET TITLE AND BREADCRUMB
    ajaxes({
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: `${DATAACCESS_URL__PARENT}('${id1}')`
    }).then(({ data }) => {
      app.setBreadcrumb(BREADCRUMBS__FUNC(data), true);
      app.setTitle(TITLE__FUNC(data));
    });

    // ADD REDIRECT
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    // ADD TABS REGION
    const $tabContainer = $('<div></div>').appendTo($container);
    $tabContainer.html(TABS);
    fixButtonLinks($tabContainer);

    // ADD SUB TITLE
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
