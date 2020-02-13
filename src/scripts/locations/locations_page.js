/* global */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entity__columns locationsEntity__columns */

const page__locations__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locations',
    fragment: `locations/all`,

    definition(auth) {
      const definition = {
        columns: [
          locationsEntity__columns.action({ view: this }),

          locationsEntity__columns.site_name,
          locationsEntity__columns.address,

          locationsEntity__columns.lockers_total,

          locationsEntity__columns.contact,
          locationsEntity__columns.phone,

          entity__columns.__Status({ auth })
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

    definition(auth) {
      const definition = {
        columns: [
          locationsEntity__columns.action({ view: this }),

          locationsEntity__columns.latest_inspection__date,
          locationsEntity__columns.latest_inspection__result({ auth }),

          locationsEntity__columns.site_name,
          locationsEntity__columns.address,

          locationsEntity__columns.lockers_total,

          locationsEntity__columns.contact,
          locationsEntity__columns.phone,

          locationsEntity__columns.__Status({ auth })
        ],

        order: [[1, 'desc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported page__locations */
function page__locations(app, $container, router, auth, opt, query) {
  if (!(opt in page__locations__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${page__locations__views.all.fragment}?${query}`, { trigger: true, replace: true });
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
    $container.append(`<h2>${page__locations__views[opt].title}</h2>`);

    const definition = page__locations__views[opt].definition(auth, opt);

    const views = Object.keys(page__locations__views).map((key) => ({
      title: page__locations__views[key].title,
      fragment: `${page__locations__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
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
        { name: 'Locations', link: `#${page__locations__views.all.fragment}` },
        { name: page__locations__views[opt].breadcrumb, link: `#${page__locations__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
