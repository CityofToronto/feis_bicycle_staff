/* global moment query_stringToObject query_objectToString */
/* global renderDatatable */

let lastLocationsPageOption;

/* exported renderCustomersPage */
function renderCustomersPage($pageContainer, query, auth) {
  const queryObject = query_stringToObject(query);

  if (lastLocationsPageOption != queryObject.option) {
    clearCustomersState();
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
        return `<a href="#customers/${data}${query}" class="btn btn-default">Open</a>`;
      },
      searchable: false
    },
    'First Name': {
      title: 'First Name',
      className: 'minWidth',
      data: 'first_name',
      type: 'string'
    },
    'Last Name': {
      title: 'Last Name',
      className: 'minWidth',
      data: 'last_name',
      type: 'string'
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
      className: 'minWidth',
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

  let colIndex = 0;

  definition.columns[colIndex] = columns['Action'];

  definition.columns[++colIndex] = columns['First Name'];
  definition.order.push([colIndex, 'asc']);

  definition.columns[++colIndex] = columns['Last Name'];

  definition.columns[++colIndex] = columns['Modified On'];

  definition.columns[++colIndex] = columns['Modified By'];

  const related = [
    {
      title: 'Today\'s Entries',
      fragment: `customers?${query_objectToString({ option: 'today', resetState: 'yes' })}`
    },
    {
      title: 'This Year\'s Entries',
      fragment: `customers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}`
    },
    {
      title: 'All Entries',
      fragment: `customers?${query_objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (queryObject.option) {
    case 'today':
      definition.columns[++colIndex] = columns['Hidden Modified On'];
      definition.searchCols[colIndex] = { search: moment().format() };

      definition.columns[++colIndex] = columns['Hidden Status'];
      definition.searchCols[colIndex] = { search: 'Active' };

      related[0].isCurrent = true;
      break;

    case 'thisyear':
      definition.columns[++colIndex] = columns['Hidden Modified On'];
      definition.searchCols[colIndex] = { search: `${moment().startOf('year').format()} to ${moment().endOf('year').format()}` };

      definition.columns[++colIndex] = columns['Hidden Status'];
      definition.searchCols[colIndex] = { search: 'Active' };

      related[1].isCurrent = true;
      break;

    default:
      definition.columns[++colIndex] = columns['Status'];

      related[2].isCurrent = true;
  }

  console.log(definition);

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_CUSTOMERS */',

    newButtonLabel: 'New Customer',
    newButtonFragment: `customers/new${query}`,

    stateSaveWebStorageKey: `customers`,

    related
  });
}

/* exported clearCustomersState */
function clearCustomersState() {
  sessionStorage.removeItem('customers');
}
