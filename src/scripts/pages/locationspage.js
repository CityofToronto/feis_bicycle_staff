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

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Locations', link: '#locations' }];

    const views = [
      {
        title: 'All Locations',
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
          locations_datatable_columns.action(`locations/${opt}`),

          locations_datatable_columns.site_name,

          locations_datatable_columns.civic_address,
          locations_datatable_columns.municipality,
          locations_datatable_columns.province(auth),
          locations_datatable_columns.postal_code,

          locations_datatable_columns.primary_contact_first_name,
          locations_datatable_columns.primary_contact_last_name,
          locations_datatable_columns.primary_contact_email,
          locations_datatable_columns.primary_contact_primary_phone,
          locations_datatable_columns.primary_contact_alternate_phone,

          locations_datatable_columns.alternate_contact_first_name,
          locations_datatable_columns.alternate_contact_last_name,
          locations_datatable_columns.alternate_contact_email,
          locations_datatable_columns.alternate_contact_primary_phone,
          locations_datatable_columns.alternate_contact_alternate_phone,

          locations_datatable_columns.latest_note__date,
          locations_datatable_columns.latest_note__note,

          locations_datatable_columns.latest_inspection__date,
          locations_datatable_columns.latest_inspection__result(auth),
          locations_datatable_columns.latest_inspection__note,

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

        newButtonLabel: 'New Location',
        newButtonFragment: `locations/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locations');
    }, (error) => {
      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
