/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockers__columns */

const renderEntityLockersPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Lockers',
    fragment: 'entities/lockers/all',
    stateSaveWebStorageKey: 'entity_lockers_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityLockers__columns).map((key) => {
          if (key === 'action') {
            return entityLockers__columns[key](renderEntityLockersPage__views.all.fragment);
          }
          return typeof entityLockers__columns[key] === 'function' ? entityLockers__columns[key](auth)
            : entityLockers__columns[key];
        }),

        order: [[1, 'asc']],

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
          const promises = [];

          const locations = response.value.map(({ location }) => location)
            .filter((location, index, array) => array.indexOf(location) === index);
          if (locations.length > 0) {
            const filter = encodeURIComponent(locations.map((id) => `id eq '${id}'`).join(' or '));
            promises.push(ajaxes({
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
              response.value.forEach((location) => location.calc_location_site_name = locationMap[location.location]);
            }));
          } else {
            response.value.forEach((location) => location.calc_location_site_name = null);
          }

          const customers = response.value.map(({ customer }) => customer)
            .filter((customer, index, array) => array.indexOf(customer) === index);
          if (customers.length > 0) {
            const filter = encodeURIComponent(customers.map((id) => `id eq '${id}'`).join(' or '));
            promises.push(ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: `/* @echo C3DATA_CUSTOMERS_URL */?$filter=${filter}`,
            }).then(({ data: response3 }) => {
              const customerMap = response3.value.reduce((acc, { id, first_name, last_name }) => {
                acc[id] = `${first_name} ${last_name}`;
                return acc;
              }, {});
              response.value.forEach((customer) => customer.calc_customer_name = customerMap[customer.customer]);
            }));
          } else {
            response.value.forEach((location) => location.calc_customer_name = null);
          }

          Promise.all(promises).then(() => {
            callback({
              data: response.value,
              draw: data.draw,
              recordsTotal: response['@odata.count'],
              recordsFiltered: response['@odata.count']
            });
          });
        }).catch((error) => {
          callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });
          throw error;
        });
      };

      return definition;
    }
  }
};

/* exported renderEntityLockersPage */
function renderEntityLockersPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLockersPage__views)) {
    const fragment = renderEntityLockersPage__views.all.fragment;
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

    const currentLockerView = renderEntityLockersPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLockerView.stateSaveWebStorageKey);
    }

    const definition = currentLockerView.definition(auth, opt);

    const views = Object.keys(renderEntityLockersPage__views).map((key) => ({
      title: renderEntityLockersPage__views[key].title,
      fragment: `${renderEntityLockersPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKERS_URL */',

        newButtonLabel: 'New Locker',
        newButtonFragment: `${currentLockerView.fragment}/new`,

        stateSaveWebStorageKey: currentLockerView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentLockerView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Lockers', link: `#${renderEntityLockersPage__views.all.fragment}` },
        { name: currentLockerView.breadcrumb, link: `#${currentLockerView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Lockers');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
