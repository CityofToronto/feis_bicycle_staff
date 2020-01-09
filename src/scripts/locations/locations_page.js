/* global */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLocations__columns */

const renderLocationsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Locations',
    fragment: `locations/all`,

    definition: (auth) => {
      const definition = {
        columns: [
          entityLocations__columns.action(renderLocationsPage__views.all.fragment),

          entityLocations__columns.site_name,
          entityLocations__columns.address,

          entityLocations__columns.lockers_total,

          entityLocations__columns.contact,
          entityLocations__columns.phone,

          entityLocations__columns.__Status(auth)
        ],

        order: [[1, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  },
  upforinspection: {
    breadcrumb: 'Up For Inspection',

    title: 'Up For Inspection',
    fragment: `locations/upforinspection`,

    definition: (auth) => {
      const definition = {
        columns: [
          entityLocations__columns.action(renderLocationsPage__views.all.fragment),

          entityLocations__columns.latest_inspection__date,
          entityLocations__columns.latest_inspection__result(auth),

          entityLocations__columns.site_name,
          entityLocations__columns.address,

          entityLocations__columns.lockers_total,

          entityLocations__columns.contact,
          entityLocations__columns.phone,

          entityLocations__columns.__Status(auth)
        ],

        order: [[1, 'desc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderLocationsPage */
function renderLocationsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderLocationsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationsPage__views.all.fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const {
      redirectTo = 'Home',
      redirectToFragment = 'home',
      resetState
    } = query__stringToObject(query);

    const stateSaveWebStorageKey = `locations_${opt}`;
    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${renderLocationsPage__views[opt].title}</h2>`);

    const definition = renderLocationsPage__views[opt].definition(auth, opt);

    const views = Object.keys(renderLocationsPage__views).map((key) => ({
      title: renderLocationsPage__views[key].title,
      fragment: `${renderLocationsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

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
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
        { name: renderLocationsPage__views[opt].breadcrumb, link: `#${renderLocationsPage__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
