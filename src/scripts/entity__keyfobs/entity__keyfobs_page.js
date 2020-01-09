/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityKeyfobs__columns */

const renderEntityKeyfobsPage__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Key Fobs',
    fragment: 'entities/keyfobs/all',
    stateSaveWebStorageKey: 'entity_keyfobs_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityKeyfobs__columns).map((key) => {
          if (key === 'action') {
            return entityKeyfobs__columns[key](renderEntityKeyfobsPage__views.all.fragment);
          }
          return typeof entityKeyfobs__columns[key] === 'function' ? entityKeyfobs__columns[key](auth)
            : entityKeyfobs__columns[key];
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
          const stations = [].concat(...response.value.map(({ stations }) => stations))
            .filter((station, index, array) => array.indexOf(station) === index);

          if (stations.length > 0) {
            const filter = encodeURIComponent(stations.map((id) => `id eq '${id}'`).join(' or '));
            return ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: `/* @echo C3DATA_STATIONS_URL */?$filter=${filter}`,
            }).then(({ data: response2 }) => {
              const stationMap = response2.value.reduce((acc, { id, site_name }) => {
                acc[id] = site_name;
                return acc;
              }, {});

              response.value.forEach((keyfob) => {
                keyfob.calc_stations_site_names = keyfob.stations.map((station) => stationMap[station]).join(', ');
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
              locationNote.calc_stations_site_names = null;
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

/* exported renderEntityKeyfobsPage */
function renderEntityKeyfobsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityKeyfobsPage__views)) {
    const fragment = renderEntityKeyfobsPage__views.all.fragment;
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

    const currentKeyfobView = renderEntityKeyfobsPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentKeyfobView.stateSaveWebStorageKey);
    }

    const definition = currentKeyfobView.definition(auth, opt);

    const views = Object.keys(renderEntityKeyfobsPage__views).map((key) => ({
      title: renderEntityKeyfobsPage__views[key].title,
      fragment: `${renderEntityKeyfobsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_KEYFOBS_URL */',

        newButtonLabel: 'New Key Fob',
        newButtonFragment: `${currentKeyfobView.fragment}/new`,

        stateSaveWebStorageKey: currentKeyfobView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentKeyfobView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Key Fobs', link: `#${renderEntityKeyfobsPage__views.all.fragment}` },
        { name: currentKeyfobView.breadcrumb, link: `#${currentKeyfobView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Key Fobs');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
