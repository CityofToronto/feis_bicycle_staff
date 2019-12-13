/* global moment */
/* global oData__escapeValue query__objectToString query__stringToObject */
/* global renderDatatable */

const locationsPage__defaultOpt = 'all';

let locationsPage__lastOpt;
let locationsPage__stateSaveWebStorageKey = 'locations';

const locationsPage__columns = {
  action: {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
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
    title: 'Primary Phone Number (Primary Contact)',
    className: 'minWidth',
    data: 'primary_contact_primary_phone',
    type: 'string'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone Number (Primary Contact)',
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
    title: 'Primary Phone Number (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_primary_phone',
    type: 'string'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone Number (Alternate Contact)',
    className: 'minWidth',
    data: 'alternate_contact_alternate_phone',
    type: 'string'
  },

  notes: {
    title: 'Notes',
    className: 'minWidth',
    data: 'notes',
    type: 'string'
  },

  latest_inspection: {
    title: 'Last Inspection',
    className: 'minWidth',
    data: 'latest_inspection',
    type: 'string'
  },
  latest_inspection_date: {
    title: 'Last Inspection',
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
    title: 'Last Inspection Result',
    className: 'minWidth',
    data: 'latest_inspection_result',
    type: 'string',
    searchType: 'equals',
    choices: '/* @echo C3DATAMEDIA_INSPECTION_RESULT_CHOICES */',
    render(data) {
      if (data) {
        return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problem' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
      } else {
        return '';
      }
    }
  },
  latest_inspection_notes: {
    title: 'Last Inspection Notes',
    className: 'minWidth',
    data: 'latest_inspection_notes',
    type: 'string'
  },

  lockers_total: {
    title: 'Total Lockers',
    className: 'minWidth',
    data: 'lockers_total',
    type: 'string'
  },
  lockers_assigned: {
    title: 'Assigned Lockers',
    className: 'minWidth',
    data: 'lockers_assigned',
    type: 'string'
  },
  lockers_available: {
    title: 'Available Lockers',
    className: 'minWidth',
    data: 'lockers_available',
    type: 'string'
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
        return dataMoment.format('YYYY/MM/DD');
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

/* exported locationsPage__render */
function locationsPage__render($pageContainer, opt, query, auth) {
  opt = opt || locationsPage__defaultOpt;

  const { resetState } = query__stringToObject(query);
  if (locationsPage__lastOpt !== opt || resetState === 'yes') {
    sessionStorage.removeItem(locationsPage__stateSaveWebStorageKey);
    locationsPage__lastOpt = opt;
  }

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    <div class="datatable"></div>
  `);

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  const related = [
    {
      title: 'All',
      fragment: `locations/all?${query__objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (opt) {
    default:
      definition.columns.push(
        Object.assign({}, locationsPage__columns.action, {
          render(data) {
            return `<a href="#locations/${opt}/${data}?${query__objectToString({ resetState: 'yes' })}" class="btn btn-default dblclick-target">Open</a>`;
          }
        }),

        locationsPage__columns.site_name,
        locationsPage__columns.civic_address,

        locationsPage__columns.lockers_available,
        locationsPage__columns.lockers_assigned,
        locationsPage__columns.lockers_total,

        Object.assign({}, locationsPage__columns.primary_contact_name, { title: 'Name' }),
        Object.assign({}, locationsPage__columns.primary_contact_email, { title: 'Email' }),
        Object.assign({}, locationsPage__columns.primary_contact_primary_phone, { title: 'Phone Number' }),

        locationsPage__columns.latest_inspection_date,
        locationsPage__columns.latest_inspection_result,

        locationsPage__columns.__CreatedOn,
        locationsPage__columns.__ModifiedOn,
        locationsPage__columns.__Owner,
        locationsPage__columns.__Status
      );

      definition.order.push([1, 'asc']);

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: `locations/${opt}/new`,

    stateSaveWebStorageKey: locationsPage__stateSaveWebStorageKey,

    related
  });
}
