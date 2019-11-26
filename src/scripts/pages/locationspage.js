/* global moment query_stringToObject query_objectToString */
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

    ${queryObject.option === 'today' ? '<h2>Today</h2>' : ''}
    ${queryObject.option === 'thisyear' ? '<h2>This Year</h2>' : ''}

    <div class="datatable"></div>
  `);

  const columns = {
    'Action': {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href="#locations/${data}${query}" class="btn btn-default">Open</a>`;
      },
      searchable: false
    },
    'Name': {
      title: 'Name',
      className: 'minWidth',
      data: 'name',
      type: 'string'
    },
    'Description': {
      title: 'Description',
      className: 'minWidthLarge',
      data: 'description',
      type: 'string'
    },
    'Address': {
      title: 'Address',
      className: 'minWidth',
      data: 'civic_address',
      type: 'string'
    },
    'Lockers': {
      title: 'Lockers',
      className: 'minWidthSmall',
      data: 'id',
      type: 'string',
      render() {
        return '...';
      },
      searchable: false
    },
    'Modified On': {
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
    'Modified By': {
      title: 'Modified By',
      className: 'minWidthSmall',
      data: '__Owner',
      type: 'string'
    },
    'Status': {
      title: 'Status',
      className: 'statusWidth',
      data: '__Status',
      type: 'string',
      searchType: 'equals',
      choices: [{ text: 'Active' }, { text: 'Inactive' }],
      render(data) {
        return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
      }
    },
    'Hidden Modified On': {
      visible: false,
      data: '__ModifiedOn',
      type: 'date'
    },
    'Hidden Status': {
      visible: false,
      data: '__Status',
      type: 'string',
      searchType: 'equals'
    }
  };

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  definition.columns[0] = columns['Action'];
  definition.columns[1] = columns['Name'];
  definition.columns[2] = columns['Description'];
  definition.columns[3] = columns['Lockers'];
  definition.columns[4] = columns['Modified On'];
  definition.columns[5] = columns['Modified By'];

  definition.order.push([1, 'asc']);

  const related = [
    {
      title: 'Today',
      fragment: `locations?${query_objectToString({ option: 'today', resetState: 'yes' })}`
    },
    {
      title: 'This Year',
      fragment: `locations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `locations?${query_objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (queryObject.option) {
    case 'today':
      definition.columns[6] = columns['Hidden Modified On'];

      definition.searchCols[6] = { search: moment().format() };

      related[0].isCurrent = true;
      break;

    case 'thisyear':
      definition.columns[6] = columns['Hidden Modified On'];
      definition.columns[7] = columns['Hidden Status'];

      definition.searchCols[6] = { search: `${moment().startOf('year').format()} to ${moment().endOf('year').format()}` };
      definition.searchCols[7] = { search: 'Active' };

      related[1].isCurrent = true;
      break;

    default:
      definition.columns[6] = columns['Status'];

      related[2].isCurrent = true;
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
