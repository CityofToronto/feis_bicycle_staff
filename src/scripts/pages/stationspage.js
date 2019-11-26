/* global renderDatatable query_stringToObject query_objectToString moment */

let lastStationsPageOption;

/* exported renderStationsPage */
function renderStationsPage($pageContainer, query, auth) {
  const queryObject = query_stringToObject(query);

  if (lastStationsPageOption != queryObject.option) {
    clearStationsState();
    lastStationsPageOption = queryObject.option;
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
        return `<a href="#stations/${data}${query}" class="btn btn-default">Open</a>`;
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
      className: 'minWidth',
      data: 'description',
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

  definition.columns[0] = columns['Action'];
  definition.columns[1] = columns['Name'];
  definition.columns[2] = columns['Description'];
  definition.columns[3] = columns['Modified On'];
  definition.columns[4] = columns['Modified By'];

  definition.order.push([1, 'asc']);

  const related = [
    {
      title: 'Today',
      fragment: `stations?${query_objectToString({ option: 'today', resetState: 'yes' })}`
    },
    {
      title: 'This Year',
      fragment: `stations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `stations?${query_objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (queryObject.option) {
    case 'today':
      definition.columns[5] = columns['Hidden Modified On'];
      definition.columns[6] = columns['Hidden Status'];

      definition.searchCols[5] = { search: moment().format() };
      definition.searchCols[6] = { search: 'Active' };

      related[0].isCurrent = true;
      break;

    case 'thisyear':
      definition.columns[5] = columns['Hidden Modified On'];
      definition.columns[6] = columns['Hidden Status'];

      definition.searchCols[5] = { search: `${moment().startOf('year').format()} to ${moment().endOf('year').format()}` };
      definition.searchCols[6] = { search: 'Active' };

      related[1].isCurrent = true;
      break;

    default:
      definition.columns[5] = columns['Status'];

      related[2].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_STATIONS */',

    newButtonLabel: 'New Station',
    newButtonFragment: `stations/new${query}`,

    stateSaveWebStorageKey: 'stations',

    related
  });
}

/* exported clearStationsState */
function clearStationsState() {
  sessionStorage.removeItem('stations');
}
