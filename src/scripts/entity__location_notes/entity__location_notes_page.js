/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityLocationNotes__columns */

const renderEntityLocationNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Location Notes',
    fragment: 'entities/location_notes/all',
    stateSaveWebStorageKey: 'entity_location_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: [
          entityLocationNotes__columns.action(renderEntityLocationNotesPage__views.all.fragment),

          entityLocationNotes__columns.id,
          entityLocationNotes__columns.location,
          entityLocationNotes__columns.location__site_name,
          entityLocationNotes__columns.date,
          entityLocationNotes__columns.note,

          entityLocationNotes__columns.__CreatedOn,
          entityLocationNotes__columns.__ModifiedOn,
          entityLocationNotes__columns.__Owner,
          entityLocationNotes__columns.__Status
        ],

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
                locationNote.location__site_name = locationMap[locationNote.location];
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
              locationNote.location__site_name = null;
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

/* exported renderEntityLocationNotesPage */
function renderEntityLocationNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityLocationNotesPage__views)) {
    const fragment = renderEntityLocationNotesPage__views.all.fragment;
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
    const currentLocationNoteView = renderEntityLocationNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentLocationNoteView.stateSaveWebStorageKey);
    }

    const definition = currentLocationNoteView.definition(auth, opt);

    const views = Object.keys(renderEntityLocationNotesPage__views).map((key) => ({
      title: renderEntityLocationNotesPage__views[key].title,
      fragment: `${renderEntityLocationNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

        newButtonLabel: 'New Location Note',
        newButtonFragment: `${currentLocationNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentLocationNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentLocationNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Location Notes', link: `#${renderEntityLocationNotesPage__views.all.fragment}` },
        { name: currentLocationNoteView.breadcrumb, link: `#${currentLocationNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Location Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
