/* global moment */
/* global oData_escapeValue query_stringToObject query_objectToString */
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
      return `<a href="#customers/${data}${query}" class="btn btn-default">Open</a>`;
    },
    searchable: false
  };

  columns['First Name'] = {
    title: 'First Name',
    className: 'minWidth',
    data: 'first_name',
    type: 'string'
  };

  columns['Last Name'] = {
    title: 'Last Name',
    className: 'minWidth',
    data: 'last_name',
    type: 'string'
  };

  columns['Name'] = {
    title: 'Name',
    className: 'minWidth',
    type: 'function',
    render(data, settings, row) {
      return [row['first_name'], row['last_name']].filter((value) => value).join(' ');
    },
    filter(column) {
      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `(contains(tolower(first_name),'${oData_escapeValue(value.toLowerCase())}') or contains(tolower(last_name),'${oData_escapeValue(value.toLowerCase())}'))`)
        .join(' and ');
    },
    orderBy(order) {
      return `tolower(first_name) ${order.dir},tolower(last_name) ${order.dir}`;
    }
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

  definition.columns[columnCounter++] = columns['Name'];
  definition.order.push([columnCounter - 1, 'asc']);

  // definition.columns[columnCounter++] = columns['Last Name'];

  const related = [
    {
      title: 'All Active',
      fragment: `customers?${query_objectToString({ option: 'active', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `customers?${query_objectToString({ resetState: 'yes' })}`
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
