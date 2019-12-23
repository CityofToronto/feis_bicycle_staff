/* global Backbone */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locations_datatable_columns */

/* exported renderLocationsPage */
function renderLocationsPage(app, $container, router, auth, opt, query) {
  if (opt == null) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`locations/all?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      const query = query__objectToString({ redirect: Backbone.history.getFragment() });
      router.navigate(`login?${query}`, { trigger: true });
      return;
    }

    const {
      redirectTo = 'Home',
      redirectToFragment = 'home',
      resetState
    } = query__stringToObject(query);
    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Locker Location', link: '#locations' }];

    const views = [
      {
        title: 'All',
        fragment: `locations/all?${query__objectToString({ resetState: 'yes' })}`
      }
    ];

    const definition = {
      columns: [],
      order: [],
      searchCols: []
    };

    let stateSaveWebStorageKey;

    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All' });
        $container.append('<h2>All Locations</h2>');
        views[0].isCurrent = true;
        stateSaveWebStorageKey = `locations__${opt}`;

        definition.columns.push(
          Object.assign({}, locations_datatable_columns.action, {
            render(data) {
              const href = `#locations/${opt}/${data}?${query__objectToString({ resetState: 'yes' })}`;
              return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
            }
          }),

          locations_datatable_columns.site_name,

          locations_datatable_columns.__CreatedOn,
          locations_datatable_columns.__ModifiedOn,
          locations_datatable_columns.__Owner,
          locations_datatable_columns.__Status
        );

        definition.order.push([1, 'asc']);

        definition.searchCols[definition.columns.length - 1] = { search: 'Active' };
    }

    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATIONS_URL */',

        newButtonLabel: 'New Locker Location',
        newButtonFragment: `locations/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locker Locations');
    }, (error) => {
      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
