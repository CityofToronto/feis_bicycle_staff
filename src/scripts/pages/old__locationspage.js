/* global moment */
/* global query_objectToString query_stringToObject */
/* global renderDatatable */

let lastLocationsPageOption;

/* exported renderLocationsPage */
function renderLocationsPage($pageContainer, query, auth) {
  const queryObject = query_stringToObject(query);

  if (lastLocationsPageOption != queryObject.option) {
    clearLocationsState();
    lastLocationsPageOption = queryObject.option;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    ${queryObject.option === 'active' ? '<h2>All Active</h2>' : ''}

    <div class="datatable"></div>
  `);

  const columns = {};

  columns['Action'] = {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    render(data) {
      return `<a href="#locations/${data}${query}" class="btn btn-default">Open</a>`;
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
    title: 'Lockers',
    className: 'minWidthSmall',
    data: 'locker_count',
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
    type: 'string',
    render(data, settings, row) {
      return [row['primary_contact_first_name'], row['primary_contact_last_name']].filter((value) => value).join(' ');
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

  let columnCounter = 0;

  definition.columns[columnCounter++] = columns['Action'];

  definition.columns[columnCounter++] = columns['Site Name'];
  definition.order.push([columnCounter - 1, 'asc']);

  definition.columns[columnCounter++] = columns['Address'];

  definition.columns[columnCounter++] = columns['Lockers'];

  definition.columns[columnCounter++] = columns['Contact First Name'];
  definition.columns[columnCounter++] = columns['Contact Last Name'];
  definition.columns[columnCounter++] = columns['Contact Name'];

  definition.columns[columnCounter++] = columns['Contact Phone'];

  const related = [
    {
      title: 'All Active',
      fragment: `locations?${query_objectToString({ option: 'active', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `locations?${query_objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (queryObject.option) {
    case 'active':
      definition.columns[columnCounter++] = columns['Status'];
      definition.columns[columnCounter - 1].visible = false;
      definition.searchCols[columnCounter - 1] = { search: 'Active' };

      related[0].isCurrent = true;
      break;

    default:
      definition.columns[columnCounter++] = columns['Modified On'];
      definition.columns[columnCounter++] = columns['Modified By'];
      definition.columns[columnCounter++] = columns['Status'];

      related[1].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: `locations/new${query}`,

    stateSaveWebStorageKey: `locations`,

    related
  });
}

/* exported clearLocationsState */
function clearLocationsState() {
  sessionStorage.removeItem('locations');
}
