/* global moment */
/* global query__objectToString query__stringToObject  */
/* global renderDatatable */

/* exported renderLockersPage */
function renderLockersPage($pageContainer, query, auth) {
  const { option } = query__stringToObject(query);

  if (renderLockersPage.lastOption != option) {
    clearLockersState();
    renderLockersPage.lastOption = option;
  }

  const nextQuery = query__objectToString({ option, resetState: 'yes' });

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
      return `<a href="#lockers/${data}?${nextQuery}" class="btn btn-default">Open</a>`;
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

  let colIndex = 0;

  definition.columns[colIndex] = columns['Action'];
  colIndex++;

  definition.columns[colIndex] = columns['Location'];
  definition.order.push([colIndex, 'asc']);
  colIndex++;

  definition.columns[colIndex] = columns['Number'];
  colIndex++;

  definition.columns[colIndex] = columns['Customer First Name'];
  colIndex++;

  definition.columns[colIndex] = columns['Customer Last Name'];
  colIndex++;

  definition.columns[colIndex] = columns['Customer'];
  colIndex++;

  definition.columns[colIndex] = columns['Inspected On'];
  colIndex++;

  definition.columns[colIndex] = columns['Inspection Result'];
  colIndex++;

  const related = [
    {
      title: 'All',
      fragment: `lockers?${query__objectToString({ option: 'all', resetState: 'yes' })}`
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
    url: '/* @echo C3DATA_LOCKERS */',

    newButtonLabel: 'New Locker',
    newButtonFragment: `lockers/new?${nextQuery}`,

    stateSaveWebStorageKey: `lockers`,

    related
  });
}

/* exported clearLockersState */
function clearLockersState() {
  sessionStorage.removeItem('lockers');
}
