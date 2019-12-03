/* global moment */
/* global oData_escapeValue query_objectToString query_stringToObject */
/* global renderDatatable */

/* exported renderLocationsPage */
function renderLocationsPage($pageContainer, query, auth) {
  const { option } = query_stringToObject(query);

  if (renderLocationsPage.lastOption != option) {
    clearLocationsState();
    renderLocationsPage.lastOption = option;
  }

  const nextQuery = query_objectToString({ option, resetState: 'yes' });

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>
    <div class="datatable"></div>
  `);

  const columns = {};

  columns['Action'] = {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    render(data) {
      return `<a href="#locations/${data}?${nextQuery}" class="btn btn-default">Open</a>`;
    },
    searchable: false
  };

  columns['Site Name'] = {
    title: 'Site Name',
    className: 'minWidth',
    data: 'site_name',
    type: 'string'
  };

  columns['Address'] = {
    title: 'Address',
    className: 'minWidth',
    data: 'civic_address',
    type: 'string'
  };

  columns['Lockers'] = {
    title: 'Total Lockers',
    className: 'minWidth',
    data: 'locker_count',
    type: 'number',
  };

  columns['Available Lockers'] = {
    title: 'Available Lockers',
    className: 'minWidth',
    data: 'locker_available',
    type: 'number',
  };

  columns['Contact First Name'] = {
    visible: false,
    title: 'Contact First Name',
    className: 'minWidth',
    data: 'primary_contact_first_name',
    type: 'string'
  };
  columns['Contact Last Name'] = {
    visible: false,
    title: 'Contact Last Name',
    className: 'minWidth',
    data: 'primary_contact_last_name',
    type: 'string'
  };
  columns['Contact Name'] = {
    title: 'Contact Name',
    className: 'minWidth',
    data: 'primary_contact_first_name',
    type: 'function',
    render(data, settings, row) {
      return [row['primary_contact_first_name'], row['primary_contact_last_name']].filter((value) => value).join(' ');
    },
    filter(column) {
      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `(contains(tolower(primary_contact_first_name),'${oData_escapeValue(value.toLowerCase())}') or contains(tolower(primary_contact_last_name),'${oData_escapeValue(value.toLowerCase())}'))`)
        .join(' and ');
    },
    orderBy(order) {
      return `tolower(primary_contact_first_name) ${order.dir},tolower(primary_contact_last_name) ${order.dir}`;
    }
  };

  columns['Contact Phone'] = {
    title: 'Contact Phone',
    className: 'minWidth',
    data: 'primary_contact_primary_phone',
    type: 'string'
  };

  columns['Modified On'] = {
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
  };

  columns['Modified By'] = {
    title: 'Modified By',
    className: 'minWidth',
    data: '__Owner',
    type: 'string'
  };

  columns['Status'] = {
    title: 'Status',
    className: 'statusWidth',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: [{ text: 'Active' }, { text: 'Inactive' }],
    render(data) {
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  };

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  let colIndex = 0;

  definition.columns[colIndex] = columns['Action'];
  colIndex++;

  definition.columns[colIndex] = columns['Site Name'];
  definition.order.push([colIndex, 'asc']);
  colIndex++;

  definition.columns[colIndex] = columns['Address'];
  colIndex++;

  definition.columns[colIndex] = columns['Lockers'];
  colIndex++;

  definition.columns[colIndex] = columns['Available Lockers'];
  colIndex++;

  definition.columns[colIndex] = columns['Contact First Name'];
  colIndex++;

  definition.columns[colIndex] = columns['Contact Last Name'];
  colIndex++;

  definition.columns[colIndex] = columns['Contact Name'];
  colIndex++;

  definition.columns[colIndex] = columns['Contact Phone'];
  colIndex++;

  const related = [
    {
      title: 'All',
      fragment: `locations?${query_objectToString({ option: 'all', resetState: 'yes' })}`
    }
  ];

  switch (option) {
    default:
      definition.columns[colIndex] = columns['Modified On'];
      colIndex++;

      definition.columns[colIndex] = columns['Modified By'];
      colIndex++;

      definition.columns[colIndex] = columns['Status'];
      definition.searchCols[colIndex] = { search: 'Active' };
      colIndex++;

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: `locations/new?${nextQuery}`,

    stateSaveWebStorageKey: `locations`,

    related
  });
}

/* exported clearLocationsState */
function clearLocationsState() {
  sessionStorage.removeItem('locations');
}
