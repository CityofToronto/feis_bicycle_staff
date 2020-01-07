/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityKeyfobs__columns */

const renderEntityKeyfobsPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Key Fobs',
    fragment: 'entities/keyfobs/all',
    stateSaveWebStorageKey: 'entity_keyfobs_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityKeyfobs__columns.action(renderEntityKeyfobsPage__views.all.fragment),

          entityKeyfobs__columns.id,
          entityKeyfobs__columns.number,
          entityKeyfobs__columns.description,
          entityKeyfobs__columns.stations,
          entityKeyfobs__columns.stations__site_name,
          entityKeyfobs__columns.latest_note,
          entityKeyfobs__columns.latest_note__date,
          entityKeyfobs__columns.latest_note__note,

          entityKeyfobs__columns.__CreatedOn,
          entityKeyfobs__columns.__ModifiedOn,
          entityKeyfobs__columns.__Owner,
          entityKeyfobs__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityKeyfobsPage */
function renderEntityKeyfobsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityKeyfobsPage__views)) {
    const fragment = renderEntityKeyfobsPage__views.all.fragment;
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

    const currentKeyfobView = renderEntityKeyfobsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentKeyfobView.stateSaveWebStorageKey);
    }

    const definition = currentKeyfobView.definition(auth, opt);

    const views = Object.keys(renderEntityKeyfobsPage__views).map((key) => ({
      title: renderEntityKeyfobsPage__views[key].title,
      fragment: `${renderEntityKeyfobsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_KEYFOBS_URL */',

        newButtonLabel: 'New Key Fob',
        newButtonFragment: `${currentKeyfobView.fragment}/new`,

        stateSaveWebStorageKey: currentKeyfobView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentKeyfobView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Key Fobs', link: `#${renderEntityKeyfobsPage__views.all.fragment}` },
        { name: currentKeyfobView.breadcrumb, link: `#${currentKeyfobView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Key Fobs');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
