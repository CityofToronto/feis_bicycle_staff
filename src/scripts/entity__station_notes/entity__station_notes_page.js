/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityStationNotes__columns */

const renderEntityStationNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Station Notes',
    fragment: 'entities/station_notes/all',
    stateSaveWebStorageKey: 'entity_station_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityStationNotes__columns).map((key) => {
          if (key === 'action') {
            return entityStationNotes__columns[key](renderEntityStationNotesPage__views.all.fragment);
          }
          return typeof entityStationNotes__columns[key] === 'function' ? entityStationNotes__columns[key](auth)
            : entityStationNotes__columns[key];
        }),

        order: [
          [1, 'asc']
        ],

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
          const stations = response.value.map(({ station }) => station)
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

              response.value.forEach((stationNote) => {
                stationNote.calc_station_site_name = stationMap[stationNote.station];
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
              locationNote.calc_station_site_name = null;
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

/* exported renderEntityStationNotesPage */
function renderEntityStationNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityStationNotesPage__views)) {
    const fragment = renderEntityStationNotesPage__views.all.fragment;
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
    const currentStationNoteView = renderEntityStationNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentStationNoteView.stateSaveWebStorageKey);
    }

    const definition = currentStationNoteView.definition(auth, opt);

    const views = Object.keys(renderEntityStationNotesPage__views).map((key) => ({
      title: renderEntityStationNotesPage__views[key].title,
      fragment: `${renderEntityStationNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_STATION_NOTES_URL */',

        newButtonLabel: 'New Station Note',
        newButtonFragment: `${currentStationNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentStationNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentStationNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Station Notes', link: `#${renderEntityStationNotesPage__views.all.fragment}` },
        { name: currentStationNoteView.breadcrumb, link: `#${currentStationNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Station Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
