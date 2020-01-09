/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLockerInspections__columns */

const renderEntityLockerInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Locker Inspections',
    fragment: 'entities/locker_inspections/all',
    stateSaveWebStorageKey: 'entity_locker_inspections_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityLockerInspections__columns).map((key) => {
          if (key === 'action') {
            return entityLockerInspections__columns[key](renderEntityLockerInspectionsPage__views.all.fragment);
          }
          return typeof entityLockerInspections__columns[key] === 'function' ? entityLockerInspections__columns[key](auth)
            : entityLockerInspections__columns[key];
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
          const lockers = response.value.map(({ locker }) => locker)
            .filter((locker, index, array) => array.indexOf(locker) === index);

          if (lockers.length > 0) {
            const filter = encodeURIComponent(lockers.map((id) => `id eq '${id}'`).join(' or '));
            return ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: `/* @echo C3DATA_LOCKERS_URL */?$filter=${filter}`,
            }).then(({ data: response2 }) => {
              const lockerMap = response2.value.reduce((acc, { id, number }) => {
                acc[id] = number;
                return acc;
              }, {});

              response.value.forEach((lockerInspection) => {
                lockerInspection.calc_locker_number = lockerMap[lockerInspection.locker];
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
              locationNote.calc_locker_number = null;
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
  }
};

/* exported renderEntityLockerInspectionsPage */
function renderEntityLockerInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLockerInspectionsPage__views)) {
    const fragment = renderEntityLockerInspectionsPage__views.all.fragment;
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
    const currentLockerView = renderEntityLockerInspectionsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLockerView.stateSaveWebStorageKey);
    }

    const definition = currentLockerView.definition(auth, opt);

    const views = Object.keys(renderEntityLockerInspectionsPage__views).map((key) => ({
      title: renderEntityLockerInspectionsPage__views[key].title,
      fragment: `${renderEntityLockerInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCKER_INSPECTIONS_URL */',

        newButtonLabel: 'New Locker Inspection',
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
        { name: 'Locker Inpections', link: `#${renderEntityLockerInspectionsPage__views.all.fragment}` },
        { name: currentLockerView.breadcrumb, link: `#${currentLockerView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Locker Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
