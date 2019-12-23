/* global Backbone */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global location_notes_datatable_columns */

/* exported renderLocationNotesPage */
function renderLocationNotesPage(app, $container, router, auth, opt, query) {
  if (opt == null) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`location_notes/all?${query}`, { trigger: true, replace: true });
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

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Locker Location Notes', link: '#location_notes' }];

    const views = [
      {
        title: 'All Location Notes',
        fragment: `location_notes/all?${query__objectToString({ resetState: 'yes' })}`
      }
    ];

    const definition = {
      columns: [],
      order: [],
      searchCols: []
    };

    let stateSaveWebStorageKey;

    const datatable_columns = location_notes_datatable_columns();

    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All' });
        $container.append('<h2>All Notes</h2>');
        views[0].isCurrent = true;
        stateSaveWebStorageKey = `location_notes__${opt}`;

        definition.columns.push(
          Object.assign({}, datatable_columns.action, {
            render(data) {
              const href = `#location_notes/${opt}/${data}?${query__objectToString({ resetState: 'yes' })}`;
              return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
            }
          }),

          datatable_columns.location__site_name,
          datatable_columns.date,
          datatable_columns.note,

          datatable_columns.__CreatedOn,
          datatable_columns.__ModifiedOn,
          datatable_columns.__Owner,
          datatable_columns.__Status
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
        url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

        newButtonLabel: 'New Locker Location Note',
        newButtonFragment: `location_notes/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locker Location Notes');
    }, (error) => {
      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
