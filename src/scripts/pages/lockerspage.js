/* global renderDatatable query_objectToString query_stringToObject moment */

let lastLockersPageOption;

/* exported renderLockersPage */
function renderLockersPage($pageContainer, query, auth) {
  const queryObject = query_stringToObject(query);

  if (lastLockersPageOption != queryObject.option) {
    clearLockersState();
    lastLockersPageOption = queryObject.option;
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
      return `<a href="#lockers/${data}${query}" class="btn btn-default">Open</a>`;
    },
    searchable: false
  };

  columns['Location'] = {
    title: 'Location',
    className: 'minWidth',
    data: 'location_site_name',
    type: 'string'
  };

  columns['Number'] = {
    title: 'Number',
    className: 'minWidthSmall',
    data: 'number',
    type: 'string'
  };

  columns['Customer First Name'] = {
    visible: false,
    title: 'Customer First Name',
    className: 'minWidth',
    data: 'customer_first_name',
    type: 'string'
  };
  columns['Customer Last Name'] = {
    visible: false,
    title: 'Customer Last Name',
    className: 'minWidth',
    data: 'customer_last_name',
    type: 'string'
  };
  columns['Customer'] = {
    title: 'Customer',
    className: 'minWidth',
    data: 'customer_first_name',
    type: 'string',
    render(data, settings, row) {
      console.log(data, row);
      return [row['customer_first_name'], row['customer_last_name']].filter((value) => value).join(' ');
    }
  };

  columns['Inspected On'] = {
    title: 'Inspected On',
    className: 'minWidth',
    data: 'latest_inspection_date',
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

  columns['Inspection Result'] = {
    title: 'Inspection Result',
    className: 'minWidth',
    data: 'latest_inspection_result',
    type: 'string',
    choices: [{ text: 'Unknown' }, { text: 'Ok' }, { text: 'Problem' }]
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

  definition.columns[columnCounter++] = columns['Location'];
  definition.order.push([columnCounter - 1, 'asc']);

  definition.columns[columnCounter++] = columns['Number'];

  definition.columns[columnCounter++] = columns['Customer First Name'];
  definition.columns[columnCounter++] = columns['Customer Last Name'];
  definition.columns[columnCounter++] = columns['Customer'];

  definition.columns[columnCounter++] = columns['Inspected On'];

  definition.columns[columnCounter++] = columns['Inspection Result'];

  const related = [
    {
      title: 'All Active',
      fragment: `lockers?${query_objectToString({ option: 'active', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `lockers?${query_objectToString({ resetState: 'yes' })}`
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
    url: '/* @echo C3DATA_LOCKERS */',

    newButtonLabel: 'New Locker',
    newButtonFragment: `lockers/new${query}`,

    stateSaveWebStorageKey: `lockers`,

    related
  });
}

/* exported clearLockersState */
function clearLockersState() {
  sessionStorage.removeItem('lockers');
}
