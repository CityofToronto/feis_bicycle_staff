/* global $ */
/* global ajaxes auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */
/* global entityKeyfobNotes__columns */

const renderEntityKeyfobNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Key Fob Notes',
    fragment: 'entities/keyfob_notes/all',
    stateSaveWebStorageKey: 'entity_keyfob_notes_all',

    definition: (auth, opt) => { // eslint-disable-line no-unused-vars
      const definition = {
        columns: Object.keys(entityKeyfobNotes__columns).map((key) => {
          if (key === 'action') {
            return entityKeyfobNotes__columns[key](renderEntityKeyfobNotesPage__views.all.fragment);
          }
          return typeof entityKeyfobNotes__columns[key] === 'function' ? entityKeyfobNotes__columns[key](auth)
            : entityKeyfobNotes__columns[key];
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
          const keyfobs = response.value.map(({ keyfob }) => keyfob)
            .filter((keyfob, index, array) => array.indexOf(keyfob) === index);

          if (keyfobs.length > 0) {
            const filter = encodeURIComponent(keyfobs.map((id) => `id eq '${id}'`).join(' or '));
            return ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: `/* @echo C3DATA_KEYFOBS_URL */?$filter=${filter}`,
            }).then(({ data: response2 }) => {
              const keyfobMap = response2.value.reduce((acc, { id, number }) => {
                acc[id] = number;
                return acc;
              }, {});

              response.value.forEach((keyfobNote) => {
                keyfobNote.calc_keyfob_number = keyfobMap[keyfobNote.keyfob];
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
  }
};

/* exported renderEntityKeyfobNotesPage */
function renderEntityKeyfobNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderEntityKeyfobNotesPage__views)) {
    const fragment = renderEntityKeyfobNotesPage__views.all.fragment;
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
    const currentKeyfobNoteView = renderEntityKeyfobNotesPage__views[opt];

    const {
      redirectTo = 'Entities',
      redirectToFragment = 'entities',
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      sessionStorage.removeItem(currentKeyfobNoteView.stateSaveWebStorageKey);
    }

    const definition = currentKeyfobNoteView.definition(auth, opt);

    const views = Object.keys(renderEntityKeyfobNotesPage__views).map((key) => ({
      title: renderEntityKeyfobNotesPage__views[key].title,
      fragment: `${renderEntityKeyfobNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_KEYFOB_NOTES_URL */',

        newButtonLabel: 'New Key Fob Note',
        newButtonFragment: `${currentKeyfobNoteView.fragment}/new`,

        stateSaveWebStorageKey: currentKeyfobNoteView.stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
      $containerTop.append(`<h2>${currentKeyfobNoteView.title}</h2>`);

      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Entities', link: '#entities' },
        { name: 'Key Fob Notes', link: `#${renderEntityKeyfobNotesPage__views.all.fragment}` },
        { name: currentKeyfobNoteView.breadcrumb, link: `#${currentKeyfobNoteView.fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);
      app.setTitle('Key Fob Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
