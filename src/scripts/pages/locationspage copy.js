/* global moment */
/* global oData__escapeValue query__objectToString query__stringToObject */
/* global renderDatatable */

/* exported locationsPage */
const locationsPage = {

};

/* exported renderLocationsPage */
function renderLocationsPage($pageContainer, query, auth) {
  const { locations } = query__stringToObject(query);

  if (renderLocationsPage.lastLocation != location) {
    clearLocationsPageState();
    renderLocationsPage.lastLocation = location;
  }

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>
    <div class="datatable"></div>
  `);

  const columns = {
    action: {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href=#locations/${data}?${query__objectToString({ locations, inspections: 'all', lockers: 'all', resetState: 'yes' })} class="btn btn-default">Open</a>`;
      },
      searchable: false
    },

    site_name: {
      title: 'Site Name',
      className: 'minWidth',
      data: 'site_name',
      type: 'string'
    },

    civic_address: {
      title: 'Address',
      className: 'minWidth',
      data: 'civic_address',
      type: 'string'
    },
    municipality: {
      title: 'City',
      className: 'minWidth',
      data: 'municipality',
      type: 'string'
    },
    province: {
      title: 'Province',
      className: 'minWidth',
      data: 'province',
      type: 'string',
      searchType: 'equals',
      choices: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
    },
    postal_code: {
      title: 'Postal Code',
      className: 'minWidth',
      data: 'postal_code',
      type: 'string'
    },

    primary_contact_first_name: {
      title: 'First Name (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_first_name',
      type: 'string'
    },
    primary_contact_last_name: {
      title: 'Last Name (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_last_name',
      type: 'string'
    },
    primary_contact_name: {
      title: 'Name (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_first_name',
      select: 'primary_contact_last_name',
      type: 'function',
      render(data, settings, row) {
        return [data, row['primary_contact_last_name']].filter((value) => value).join(' ');
      },
      filter(column) {
        return column.search.value
          .split(' ')
          .filter((value, index, array) => value && array.indexOf(value) === index)
          .map((value) => `contains(tolower(concat(concat(primary_contact_first_name,' '),primary_contact_last_name)),'${oData__escapeValue(value.toLowerCase())}')`)
          .join(' and ');
      },
      orderBy(order) {
        return `tolower(concat(concat(primary_contact_first_name,' '),primary_contact_last_name)) ${order.dir}`;
      }
    },
    primary_contact_email: {
      title: 'Email (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_email',
      type: 'string'
    },
    primary_contact_primary_phone: {
      title: 'Primary Phone (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_primary_phone',
      type: 'string'
    },
    primary_contact_alternate_phone: {
      title: 'Alternate Phone (Primary Contact)',
      className: 'minWidth',
      data: 'primary_contact_alternate_phone',
      type: 'string'
    },

    alternate_contact_first_name: {
      title: 'First Name (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_first_name',
      type: 'string'
    },
    alternate_contact_last_name: {
      title: 'Last Name (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_last_name',
      type: 'string'
    },
    alternate_contact_name: {
      title: 'Name (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_first_name',
      select: 'alternate_contact_last_name',
      type: 'function',
      render(data, settings, row) {
        return [data, row['alternate_contact_last_name']].filter((value) => value).join(' ');
      },
      filter(column) {
        return column.search.value
          .split(' ')
          .filter((value, index, array) => value && array.indexOf(value) === index)
          .map((value) => `contains(tolower(concat(concat(alternate_contact_first_name,' '),alternate_contact_last_name)),'${oData__escapeValue(value.toLowerCase())}')`)
          .join(' and ');
      },
      orderBy(order) {
        return `tolower(concat(concat(alternate_contact_first_name,' '),alternate_contact_last_name)) ${order.dir}`;
      }
    },
    alternate_contact_email: {
      title: 'Email (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_email',
      type: 'string'
    },
    alternate_contact_primary_phone: {
      title: 'Primary Phone (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_primary_phone',
      type: 'string'
    },
    alternate_contact_alternate_phone: {
      title: 'Alternate Phone (Alternate Contact)',
      className: 'minWidth',
      data: 'alternate_contact_alternate_phone',
      type: 'string'
    },

    notes: {
      title: 'Note',
      className: 'minWidth',
      data: 'notes',
      type: 'string'
    },

    latest_inspection: {
      title: 'Inspection',
      className: 'minWidth',
      data: 'latest_inspection',
      type: 'string'
    },
    latest_inspection_date: {
      title: 'Inspection Date',
      className: 'minWidth',
      data: 'latest_inspection_date',
      type: 'date',
      render(data) {
        const dataMoment = moment(data);
        if (dataMoment.isValid()) {
          return dataMoment.format('YYYY/MM/DD');
        } else {
          return '';
        }
      }
    },
    latest_inspection_result: {
      title: 'Inspection Result',
      className: 'minWidth',
      data: 'latest_inspection_result',
      type: 'string',
      searchType: 'equals',
      choices: '/* @echo C3DATAMEDIA_INSPECTION_RESULT_CHOICES */'
    },
    latest_inspection_notes: {
      title: 'Inspections Note',
      className: 'minWidth',
      data: 'latest_inspection_notes',
      type: 'string'
    },

    lockers_total: {
      title: 'Total Lockers',
      className: 'minWidthSmall',
      data: 'lockers_total',
      type: 'number'
    },
    lockers_assigned: {
      title: 'Assigned Lockers',
      className: 'minWidthSmall',
      data: 'lockers_assigned',
      type: 'number'
    },
    lockers_available: {
      title: 'Available Lockers',
      className: 'minWidthSmall',
      data: 'lockers_available',
      type: 'number'
    },

    __CreatedOn: {
      title: 'Created On',
      className: 'minWidth',
      data: '__CreatedOn',
      type: 'date',
      render(data) {
        const dataMoment = moment(data);
        if (dataMoment.isValid()) {
          return dataMoment.format('YYYY/MM/DD');
        } else {
          return '-';
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
          return dataMoment.format('YYYY/MM/DD');
        } else {
          return '-';
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

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  const related = [
    {
      title: 'All',
      fragment: `locations?${query__objectToString({ location: 'all', resetState: 'yes' })}`
    }
  ];

  switch (location) {
    default:
      columns.primary_contact_name.title = 'Contact Name';
      columns.primary_contact_email.title = 'Contact Email';
      columns.primary_contact_primary_phone.title = 'Contact Phone';

      definition.columns.push(
        columns.action,
        columns.site_name,
        columns.civic_address,

        columns.lockers_available,
        columns.lockers_assigned,
        columns.lockers_total,

        columns.primary_contact_name,
        columns.primary_contact_email,
        columns.primary_contact_primary_phone,

        columns.latest_inspection_date,
        columns.latest_inspection_result,

        columns.__CreatedOn,
        columns.__ModifiedOn,
        columns.__Owner,
        columns.__Status
      );

      definition.order.push([1, 'asc']);

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: `locations/new?${query__objectToString({ locations, inspections: 'all', lockers: 'all', resetState: 'yes' })}`,

    stateSaveWebStorageKey: `locations`,

    related
  });
}

/* exported clearLocationsPageState */
function clearLocationsPageState() {
  sessionStorage.removeItem('locations');
}
