/* global $ */
/* global ajaxes auth__checkLogin fixButtonLinks query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locations__views location_notes__views */

/* exported locationNotesPage_opt2 */
let locationNotesPage_opt2 = 'all';

/* exported locationNotesPage */
function locationNotesPage(app, $container, router, auth, opt1, id1, opt2, query) {

  // ---
  const PARENT_ENTITY_VIEWS = locations__views;
  const DEFAULT_PARENT_ENTITY_VIEW = PARENT_ENTITY_VIEWS.all;
  const CURRENT_PARENT_ENTITY_VIEW = PARENT_ENTITY_VIEWS[opt1];

  const ENTITY_VIEWS = location_notes__views;
  const DEFAULT_ENTITY_VIEW = ENTITY_VIEWS.all;
  const CURRENT_ENTITY_VIEW = ENTITY_VIEWS[opt2];

  const DEFAULT_REDIRECT_TO = CURRENT_PARENT_ENTITY_VIEW.title;
  const DEFAULT_REDIRECT_TO_FRAGMENT = CURRENT_PARENT_ENTITY_VIEW.fragment;

  const PLURAL_PARENT_ITEM = 'Locations';

  const ITEM = 'Locker Location Note';
  // const PLURAL_ITEM = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: PLURAL_PARENT_ITEM, link: `#${DEFAULT_PARENT_ENTITY_VIEW.fragment}` },
    { name: CURRENT_PARENT_ENTITY_VIEW.breadcrumb, link: `#${CURRENT_PARENT_ENTITY_VIEW.fragment}` }
  ];

  const PARENT_DATAACCESS_URL = '/* @echo C3DATA_LOCATIONS_URL */';
  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_NOTES_URL */';

  const GET_TAB_HTML = function (id) {
    return `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item" role="presentation">
            <a href="#${DEFAULT_REDIRECT_TO_FRAGMENT}/${id}" class="nav-link">Location</a>
          </li>
          <li class="nav-item active" role="presentation">
            <a href="#${DEFAULT_REDIRECT_TO_FRAGMENT}/${id}/notes/${opt2}" class="nav-link">Notes</a>
          </li>
        </ul>
      </div>
    `;

    //       <li class="nav-item" role="presentation">
    //         <a href="#${DEFAULT_REDIRECT_TO_FRAGMENT}/${id}/inspections/${renderLocationDetailsInspectionsPage__currentView}" class="nav-link">Inspections</a>
    //       </li>
    //       <li class="nav-item" role="presentation">
    //         <a href="#" class="nav-link">Lockers</a>
    //       </li>
  };
  // ---

  if (!(opt1 in PARENT_ENTITY_VIEWS)) {
    return router.navigate(`${DEFAULT_PARENT_ENTITY_VIEW.fragment}/${id1}/${DEFAULT_ENTITY_VIEW.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  if (!(opt2 in ENTITY_VIEWS)) {
    return router.navigate(`${CURRENT_PARENT_ENTITY_VIEW.fragment}/${id1}${DEFAULT_ENTITY_VIEW.fragment}?${query__objectToString({ resetState: 'yes' })}`,
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
    ajaxes({
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      dataType: 'json',
      method: 'GET',
      url: `${PARENT_DATAACCESS_URL}('${id1}')?$select=site_name`
    }).then(({ data } = {}) => {
      app.setBreadcrumb(BREADCRUMBS.concat({ name: data.site_name, link: `#${CURRENT_PARENT_ENTITY_VIEW.fragment}/${data.id}` }), true);
      app.setTitle(data.site_name);
    });

    // RESET SESSION STORAGE
    if (resetState === 'yes') {
      sessionStorage.removeItem(CURRENT_ENTITY_VIEW.stateSaveWebStorageKey);
    }

    // ADD REDIRECT
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    // ADD TABS
    const $tabContainer = $('<div></div>').appendTo($container);
    function renderNavBar(id) {
      $tabContainer.html(GET_TAB_HTML(id));
      fixButtonLinks($tabContainer);
    }
    if (id1 !== 'new') {
      renderNavBar(id1);
    }

    // ADD SUB TITLE
    $container.append(`<h2>${CURRENT_ENTITY_VIEW.title}</h2>`);

    // ADD DATATABLE
    return Promise.resolve().then(() => {
      return renderDatatable($container, CURRENT_ENTITY_VIEW.definition(auth, opt1, id1), {
        auth,
        url: DATAACCESS_URL,

        newButtonLabel: `New ${ITEM}`,
        newButtonFragment: `${CURRENT_ENTITY_VIEW.fragment}/new`,

        stateSaveWebStorageKey: CURRENT_ENTITY_VIEW.stateSaveWebStorageKey,

        views: Object.keys(ENTITY_VIEWS).map((key) => ({
          title: ENTITY_VIEWS[key].title,
          fragment: `${ENTITY_VIEWS[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
          isCurrent: key === opt2
        }))
      });
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
