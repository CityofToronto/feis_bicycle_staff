/* global */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockers__columns */

const renderLockersPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Lockers',
    fragment: `lockers/all`,

    definition: (auth) => {
      const definition = {
        columns: [
          entityLockers__columns.action(renderLockersPage__views.all.fragment),

          entityLockers__columns.calc_location_site_name,
          entityLockers__columns.number,

          entityLockers__columns.latest_inspection__date,
          entityLockers__columns.latest_inspection__result(auth),

          entityLockers__columns.__Status(auth)
        ],

        order: [[2, 'asc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      definition.ajaxCore = definition.ajaxCore || function (data, callback, settings, queryObject, url, options = {}) {
        const { auth } = options;

        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `${url}?${query__objectToString(queryObject)}`
        }).then(({ data: response }) => {
          const locations = response.value.map(({ location }) => location)
            .filter((location, index, array) => array.indexOf(location) === index);

          if (locations.length > 0) {
            const filter = encodeURIComponent(locations.map((id) => `id eq '${id}'`).join(' or '));
            return ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: `/* @echo C3DATA_LOCATIONS_URL */?$filter=${filter}`,
            }).then(({ data: response2 }) => {
              const locationMap = response2.value.reduce((acc, { id, site_name }) => {
                acc[id] = site_name;
                return acc;
              }, {});

              response.value.forEach((locationNote) => {
                locationNote.calc_location_site_name = locationMap[locationNote.location];
              });

              callback({
                data: response.value,
                draw: data.draw,
                recordsTotal: response['@odata.count'],
                recordsFiltered: response['@odata.count']
              });
            });
          } else {
            response.value.forEach((locationNote) => {
              locationNote.calc_location_site_name = null;
            });

            callback({
              data: response.value,
              draw: data.draw,
              recordsTotal: response['@odata.count'],
              recordsFiltered: response['@odata.count']
            });
          }
        }).catch((error) => {
          callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });
          throw error;
        });
      };

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
          entityLockers__columns.action(renderLockersPage__views.all.fragment),

          entityLockers__columns.latest_inspection__date,
          entityLockers__columns.latest_inspection__result(auth),

          entityLockers__columns.site_name,
          entityLockers__columns.address,

          entityLockers__columns.lockers_total,

          entityLockers__columns.contact,
          entityLockers__columns.phone,

          entityLockers__columns.__Status(auth)
        ],

        order: [[1, 'desc']],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderLockersPage */
function renderLockersPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderLockersPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLockersPage__views.all.fragment}?${query}`, { trigger: true, replace: true });
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

    const stateSaveWebStorageKey = `lockers_${opt}`;
    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${renderLockersPage__views[opt].title}</h2>`);

    const definition = renderLockersPage__views[opt].definition(auth, opt);

    const views = Object.keys(renderLockersPage__views).map((key) => ({
      title: renderLockersPage__views[key].title,
      fragment: `${renderLockersPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKERS_URL */',

        newButtonLabel: 'New Locker',
        newButtonFragment: `lockers/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Lockers', link: `#${renderLockersPage__views.all.fragment}` },
        { name: renderLockersPage__views[opt].breadcrumb, link: `#${renderLockersPage__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Lockers');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
