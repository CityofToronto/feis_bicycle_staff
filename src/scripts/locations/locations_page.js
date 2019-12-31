/* global moment */
/* global auth__checkLogin oData__escapeValue query__objectToString query__stringToObject */
/* global renderDatatable */

const renderLocationsPage__columns = {
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

  site_name: {
    title: 'Site Name',
    className: 'minWidth',
    data: 'site_name'
  },

  civic_address: {
    title: 'Street Address',
    className: 'minWidth',
    data: 'civic_address'
  },
  municipality: {
    title: 'City',
    className: 'minWidth',
    data: 'municipality'
  },
  province: (auth) => ({
    title: 'Province',
    className: 'minWidth',
    data: 'province',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
    },
  }),
  postal_code: {
    title: 'Postal Code',
    className: 'minWidth',
    data: 'postal_code'
  },

  address: {
    title: 'Address',
    className: 'minWidth',
    data: 'civic_address',
    select: ['municipality', 'province', 'postal_code'],
    type: 'function',
    render(data, settings, row) {
      const line1 = data;
      const line2 = [row['municipality'], row['province'], row['postal_code']].filter((value) => value).join(' ');
      return [line1, line2].filter((value) => value).join('<br>');
    },
    filter(column) {
      let filterColumns = `concat(concat(province,' '),postal_code)`;
      filterColumns = `concat(concat(municipality,' '),${filterColumns})`;
      filterColumns = `concat(concat(civic_address,' '),${filterColumns})`;

      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `contains(tolower(${filterColumns}),'${oData__escapeValue(value.toLowerCase())}')`)
        .join(' and ');
    },
    orderBy(order) {
      let orderColumns = `concat(concat(province,' '),postal_code)`;
      orderColumns = `concat(concat(municipality,' '),${orderColumns})`;
      orderColumns = `concat(concat(civic_address,' '),${orderColumns})`;

      return `tolower(${orderColumns}) ${order.dir}`;
    }
  },

  primary_contact_first_name: {
    title: 'First Name (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_first_name'
  },
  primary_contact_last_name: {
    title: 'Last Name (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_last_name'
  },
  primary_contact_email: {
    title: 'Email (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_email'
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_primary_phone'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_alternate_phone'
  },

  alternate_contact_first_name: {
    title: 'First Name (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_first_name'
  },
  alternate_contact_last_name: {
    title: 'Last Name (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_last_name'
  },
  alternate_contact_email: {
    title: 'Email (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_email'
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_primary_phone'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_alternate_phone'
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

const renderLocationsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Locations',
    fragment: `locations/all`,

    definition: (auth) => {
      const definition = {
        columns: [
          renderLocationsPage__columns.action(renderLocationsPage__views.all.fragment),

          renderLocationsPage__columns.site_name,
          renderLocationsPage__columns.civic_address,

          Object.assign({}, renderLocationsPage__columns.primary_contact_first_name, { title: 'Contact - First Name'}),
          Object.assign({}, renderLocationsPage__columns.primary_contact_last_name, { title: 'Contact - Last Name'}),
          Object.assign({}, renderLocationsPage__columns.primary_contact_email, { title: 'Contact - Email'}),
          Object.assign({}, renderLocationsPage__columns.primary_contact_primary_phone, { title: 'Contact - Phone'}),
          // renderLocationsPage__columns.primary_contact_alternate_phone,

          // renderLocationsPage__columns.alternate_contact_first_name,
          // renderLocationsPage__columns.alternate_contact_last_name,
          // renderLocationsPage__columns.alternate_contact_email,
          // renderLocationsPage__columns.alternate_contact_primary_phone,
          // renderLocationsPage__columns.alternate_contact_alternate_phone,

          renderLocationsPage__columns.latest_note__date,
          renderLocationsPage__columns.latest_note__note,

          renderLocationsPage__columns.latest_inspection__date,
          renderLocationsPage__columns.latest_inspection__result(auth),
          renderLocationsPage__columns.latest_inspection__note,

          renderLocationsPage__columns.__CreatedOn,
          renderLocationsPage__columns.__ModifiedOn,
          renderLocationsPage__columns.__Owner,
          renderLocationsPage__columns.__Status
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

/* exported renderLocationsPage */
function renderLocationsPage(app, $container, router, auth, opt, query) {
  if (!(opt in renderLocationsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationsPage__views.all.fragment}?${query}`, { trigger: true, replace: true });
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

    const stateSaveWebStorageKey = `locations_${opt}`;
    if (resetState === 'yes') {
      sessionStorage.removeItem(stateSaveWebStorageKey);
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);
    $container.append(`<h2>${renderLocationsPage__views[opt].title}</h2>`);

    const definition = renderLocationsPage__views[opt].definition(auth);

    const views = Object.keys(renderLocationsPage__views).map((key) => ({
      title: renderLocationsPage__views[key].title,
      fragment: `${renderLocationsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
      isCurrent: key === opt
    }));

    return Promise.resolve().then(() => {
      return renderDatatable($container, definition, {
        auth,
        url: '/* @echo C3DATA_LOCATIONS_URL */',

        newButtonLabel: 'New Location',
        newButtonFragment: `locations/${opt}/new`,

        stateSaveWebStorageKey,

        views
      });
    }).then(() => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
        { name: renderLocationsPage__views[opt].breadcrumb, link: `#${renderLocationsPage__views[opt].fragment}` }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('Locations');
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
