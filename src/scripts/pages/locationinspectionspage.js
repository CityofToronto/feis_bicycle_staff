/* global Backbone */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global location_inspections_datatable_columns */

/* exported renderLocationInspectionsPage */
function renderLocationInspectionsPage(app, $container, router, auth, opt, query) {
  if (opt == null) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`location_inspections/all?${query}`, { trigger: true, replace: true });
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

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Location Inspections', link: '#location_notes' }];

    const views = [
      {
        title: 'All Location Inspections',
        fragment: `location_inspections/all?${query__objectToString({ resetState: 'yes' })}`
      }
    ];

    const definition = {
      columns: [],
      order: [],
      searchCols: []
    };

    let stateSaveWebStorageKey;

    const datatable_columns = location_inspections_datatable_columns();

    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All' });
        $container.append('<h2>All Location Inspections</h2>');
        views[0].isCurrent = true;
        stateSaveWebStorageKey = `location_inspections__${opt}`;

        definition.columns.push(
          Object.assign({}, datatable_columns.action, {
            render(data) {
              const href = `#location_inspections/${opt}/${data}?${query__objectToString({ resetState: 'yes' })}`;
              return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
            }
          }),

          datatable_columns.date,
          datatable_columns.result,
          datatable_columns.note,

          datatable_columns.__CreatedOn,
          datatable_columns.__ModifiedOn,
          datatable_columns.__Owner,
          datatable_columns.__Status
        );

        definition.order.push([1, 'desc']);

        definition.searchCols[definition.columns.length - 1] = { search: 'Active' };
    }

    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */',

        newButtonLabel: 'New Location Inspection',
        newButtonFragment: `location_inspections/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Location Inspections');
    }, (error) => {
      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
