/* global moment */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */

const renderLocationInspectionsPage__columns = {
  action: (fragmentPrefix) => ({
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    render(data) {
      const href = `#${fragmentPrefix}/${data}?${query__objectToString({ resetState: 'yes' })}`;
      return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
    },
    searchable: false
  }),

  location: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location'
  },

  location__site_name: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location__site_name'
  },

  date: {
    title: 'Date',
    className: 'minWidth',
    data: 'date',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },

  result: (auth) => ({
    title: 'Result',
    className: 'minWidth',
    data: 'result',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_LOCATION_INSPECTION_CHOICES */'
    },
    render(data) {
      return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problems' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }),

  note: {
    title: 'Note',
    className: 'minWidthLarge',
    data: 'note',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  __CreatedOn: {
    title: 'Created On',
    className: 'minWidth',
    data: '__CreatedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },
  __ModifiedOn: {
    title: 'Modified On',
    className: 'minWidth',
    data: '__ModifiedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },
  __Owner: {
    title: 'Modified By',
    className: 'minWidth',
    data: '__Owner',
    type: 'string'
  },
  __Status: {
    title: 'Status',
    className: 'statusWidth',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: [{ text: 'Active' }, { text: 'Inactive' }],
    render(data) {
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }
};

const renderLocationInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Location Inspections',
    fragment: `location_inspections/all`,

    definition(auth) {
      const definition = {
        columns: [
          renderLocationInspectionsPage__columns.action(renderLocationInspectionsPage__views.all.fragment),

          renderLocationInspectionsPage__columns.location__site_name,

          renderLocationInspectionsPage__columns.date,

          renderLocationInspectionsPage__columns.result(auth),

          renderLocationInspectionsPage__columns.note,

          renderLocationInspectionsPage__columns.__CreatedOn,
          renderLocationInspectionsPage__columns.__ModifiedOn,
          renderLocationInspectionsPage__columns.__Owner,
          renderLocationInspectionsPage__columns.__Status
        ],

        order: [
          [1, 'asc']
        ],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      return definition;
    }
  }
};

/* exported renderLocationInspectionsPage */
function renderLocationInspectionsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderLocationInspectionsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationInspectionsPage__views.all.fragment}?${query}`, { trigger: true, replace: true });
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

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${renderLocationInspectionsPage__views[opt].title}</h2>`);

    const definition = renderLocationInspectionsPage__views[opt].definition(auth);
    const stateSaveWebStorageKey = `location_inspections_${opt}`;
    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }
    const views = Object.keys(renderLocationInspectionsPage__views).map((key) => ({
      title: renderLocationInspectionsPage__views[key].title,
      fragment: `${renderLocationInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */',

        newButtonLabel: 'New Location Inspection',
        newButtonFragment: `${renderLocationInspectionsPage__views[opt].fragment}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Location Inspections', link: `#${renderLocationInspectionsPage__views.all.fragment}` },
        { name: renderLocationInspectionsPage__views[opt].breadcrumb, link: `#${renderLocationInspectionsPage__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Location Inspections');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
