/* global $ */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityCustomers__columns */

const renderEntityCustomersPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Customers',
    fragment: 'entities/customers/all',
    stateSaveWebStorageKey: 'entity_customers_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityCustomers__columns.action(renderEntityCustomersPage__views.all.fragment),

          entityCustomers__columns.id,
          entityCustomers__columns.site_name,
          entityCustomers__columns.description,
          entityCustomers__columns.civic_address,
          entityCustomers__columns.municipality,
          entityCustomers__columns.province(auth),
          entityCustomers__columns.postal_code,
          entityCustomers__columns.primary_contact_first_name,
          entityCustomers__columns.primary_contact_last_name,
          entityCustomers__columns.primary_contact_email,
          entityCustomers__columns.primary_contact_primary_phone,
          entityCustomers__columns.primary_contact_alternate_phone,
          entityCustomers__columns.alternate_contact_first_name,
          entityCustomers__columns.alternate_contact_last_name,
          entityCustomers__columns.alternate_contact_email,
          entityCustomers__columns.alternate_contact_primary_phone,
          entityCustomers__columns.alternate_contact_alternate_phone,
          entityCustomers__columns.lockers_total,
          entityCustomers__columns.latest_note,
          entityCustomers__columns.latest_note__date,
          entityCustomers__columns.latest_note__note,
          entityCustomers__columns.latest_inspection,
          entityCustomers__columns.latest_inspection__date,
          entityCustomers__columns.latest_inspection__result(auth),
          entityCustomers__columns.latest_inspection__note,

          entityCustomers__columns.__CreatedOn,
          entityCustomers__columns.__ModifiedOn,
          entityCustomers__columns.__Owner,
          entityCustomers__columns.__Status
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderEntityCustomersPage */
function renderEntityCustomersPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityCustomersPage__views)) {
    const fragment = renderEntityCustomersPage__views.all.fragment;
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

    const currentCustomerView = renderEntityCustomersPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentCustomerView.stateSaveWebStorageKey);
    }

    const definition = currentCustomerView.definition(auth, opt);

    const views = Object.keys(renderEntityCustomersPage__views).map((key) => ({
      title: renderEntityCustomersPage__views[key].title,
      fragment: `${renderEntityCustomersPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_CUSTOMERS_URL */',

        newButtonLabel: 'New Customer',
        newButtonFragment: `${currentCustomerView.fragment}/new`,

        stateSaveWebStorageKey: currentCustomerView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentCustomerView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Customers', link: `#${renderEntityCustomersPage__views.all.fragment}` },
        { name: currentCustomerView.breadcrumb, link: `#${currentCustomerView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Customers');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
