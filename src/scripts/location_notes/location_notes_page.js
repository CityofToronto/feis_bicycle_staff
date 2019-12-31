/* global moment */
/* global auth__checkLogin query__objectToString query__stringToObject */
/* global renderDatatable */

const renderLocationNotesPage__columns = {
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

const renderLocationNotesPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Location Notes',
    fragment: `location_notes/all`,

    definition() {
      const definition = {
        columns: [
          renderLocationNotesPage__columns.action('location_notes/all'),

          renderLocationNotesPage__columns.location__site_name,

          renderLocationNotesPage__columns.date,

          renderLocationNotesPage__columns.note,

          renderLocationNotesPage__columns.__CreatedOn,
          renderLocationNotesPage__columns.__ModifiedOn,
          renderLocationNotesPage__columns.__Owner,
          renderLocationNotesPage__columns.__Status
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

/* exported renderLocationNotesPage */
function renderLocationNotesPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderLocationNotesPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${router.navigate(`${renderLocationNotesPage__views.all.fragment}?${query}`, { trigger: true, replace: true })}?${query}`, { trigger: true, replace: true });
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
    $container.append(`<h2>${renderLocationNotesPage__views[opt].title}</h2>`);

    const definition = renderLocationNotesPage__views[opt].definition();
    const stateSaveWebStorageKey = `location_notes_${opt}`;
    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }
    const views = Object.keys(renderLocationNotesPage__views).map((key) => ({
      title: renderLocationNotesPage__views[key].title,
      fragment: `${renderLocationNotesPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

        newButtonLabel: 'New Location Note',
        newButtonFragment: `location_notes/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Location Notes', link: `#${renderLocationNotesPage__views.all.fragment}` },
        { name: renderLocationNotesPage__views[opt].breadcrumb, link: `#${renderLocationNotesPage__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Location Notes');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
