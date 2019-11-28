/* global moment query_stringToObject query_objectToString */
/* global renderDatatable */

let lastRegistrationsPageOption;

/* exported renderRegistrationsPage */
function renderRegistrationsPage($pageContainer, query, auth) {
  const queryObject = query_stringToObject(query);

  if (lastRegistrationsPageOption != queryObject.option) {
    clearRegistrationsState();
    lastRegistrationsPageOption = queryObject.option;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    ${queryObject.option === 'today' ? `<h2>Entries for ${moment().format('dddd, MMMM Do YYYY')}</h2>` : ''}
    ${queryObject.option === 'thisyear' ? `<h2>Entries for Year ${moment().format('YYYY')}</h2>` : ''}

    <div class="datatable"></div>
  `);

  const columns = {
    'Action': {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href="#registrations/${data}${query}" class="btn btn-default">Open</a>`;
      },
      searchable: false
    },
    'Created On': {
      title: 'Created On',
      className: 'minWidth',
      data: '__CreatedOn',
      type: 'date',
      render(data) {
        const dataMoment = moment(data);
        if (dataMoment.isValid()) {
          return dataMoment.format('YYYY/MM/DD hh:mmA');
        } else {
          return '-';
        }
      }
    },
    'Request Type': {
      title: 'Request Type',
      className: 'minWidth',
      data: 'request_type',
      type: 'string',
      choices: [{ text: 'Bicycle Lockers' }, { text: 'Bicycle Stations' }]
    },
    'Subscription': {
      title: 'Subscription',
      className: 'minWidth',
      data: 'subscription',
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
  definition.columns[1] = columns['Created On'];
  definition.columns[2] = columns['Request Type'];
  definition.columns[3] = columns['Subscription'];
  definition.columns[4] = columns['Modified On'];
  definition.columns[5] = columns['Modified By'];

  definition.order.push([1, 'desc']);

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
      definition.columns[7] = columns['Hidden Status'];

      definition.searchCols[6] = { search: moment().format() };
      definition.searchCols[7] = { search: 'Active' };

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
    url: '/* @echo C3DATA_REGISTRATIONS */',

    newButtonLabel: 'New Registration',
    newButtonFragment: `registrations/new${query}`,

    stateSaveWebStorageKey: `registrations`,

    related
  });
}

/* exported clearRegistrationsState */
function clearRegistrationsState() {
  sessionStorage.removeItem('registrations');
}
