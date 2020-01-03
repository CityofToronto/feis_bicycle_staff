/* global moment */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */

const renderLockersPage__columns = {
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
    title: 'Location',
    className: 'minWidth',
    data: 'location'
  },
  location__site_name: {
    title: 'Location',
    className: 'minWidth',
    data: 'location__site_name'
  },

  number: {
    title: 'Number',
    className: 'minWidth',
    data: 'number'
  },

  latest_note__date: {
    title: 'Latest Note Date',
    className: 'minWidth',
    data: 'latest_note__date',
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
  latest_note__note: {
    title: 'Latest Note',
    className: 'minWidthLarge',
    data: 'latest_note__note',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  latest_inspection__date: {
    title: 'Latest Inspection Date',
    className: 'minWidth',
    data: 'latest_inspection__date',
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
  latest_inspection__result: (auth) => ({
    title: 'Latest Inspection Result',
    className: 'minWidth',
    data: 'latest_inspection__result',
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
      if (data) {
        return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problems' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
      }

      return '';
    }
  }),
  latest_inspection__note: {
    title: 'Latest Inspection Note',
    className: 'minWidthLarge',
    data: 'latest_inspection__note',
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

const renderLockersPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Lockers',
    fragment: `lockers/all`,

    definition: (auth) => {
      const definition = {
        columns: [
          renderLockersPage__columns.action(renderLockersPage__views.all.fragment),

          renderLockersPage__columns.location__site_name,
          renderLockersPage__columns.number,

          renderLockersPage__columns.latest_note__date,
          renderLockersPage__columns.latest_note__note,

          renderLockersPage__columns.latest_inspection__date,
          renderLockersPage__columns.latest_inspection__result(auth),
          renderLockersPage__columns.latest_inspection__note,

          renderLockersPage__columns.__CreatedOn,
          renderLockersPage__columns.__ModifiedOn,
          renderLockersPage__columns.__Owner,
          renderLockersPage__columns.__Status
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
