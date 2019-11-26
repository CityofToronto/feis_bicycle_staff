/* global $ renderDatatable query_objectToString query_stringToObject moment */

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

    ${queryObject.option === 'today' ? '<h2>Today</h2>' : ''}
    ${queryObject.option === 'thisyear' ? '<h2>This Year</h2>' : ''}

    <div class="datatable"></div>
  `);

  let locationMap = {};

  const columns = {
    'Action': {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href="#lockers/${data}${query}" class="btn btn-default">Open</a>`;
      },
      searchable: false
    },
    'Location': {
      title: 'Location',
      className: 'minWidth',
      data: 'location',
      type: 'string',
      choices: {
        url: '/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=__Status eq \'Active\'&$top=5000',
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      },
      choicesMap(data) {
        console.log(data);
        if (data && data.value) {
          return data.value.map((value) => ({ text: value.name, value: value.id }));
        }
        return [];
      },
      render(data) {
        return locationMap[data] || '-';
      }
    },
    'Number': {
      title: 'Number',
      className: 'minWidthSmall',
      data: 'number',
      type: 'string'
    },
    'Description': {
      title: 'Description',
      className: 'minWidthLarge',
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
      },
      width: '200px'
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
  definition.columns[1] = columns['Location'];
  definition.columns[2] = columns['Number'];
  definition.columns[3] = columns['Description'];
  definition.columns[4] = columns['Modified On'];
  definition.columns[5] = columns['Modified By'];

  definition.order.push([1, 'asc']);

  definition.initComplete = function (settings, json) {
    console.log(json);

    if (json && json.data && json.data.length > 0) {
      const filter = json.data
        .map((value) => value.location)
        .filter((value, index, array) => array.indexOf(value) === index)
        .map((value) => `id eq '${value}'`)
        .join(' or ');

      console.log(filter);

      $.ajax(`/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=${filter}`, {
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      }).then((response) => {
        locationMap = response.value.reduce((accumulator, value) => {
          accumulator[value.id] = value.name;
          return accumulator;
        }, {});
        this.dataTable().api().columns.adjust().draw();
      });
    }
  };

  const related = [
    {
      title: 'Today',
      fragment: `lockers?${query_objectToString({ option: 'today', resetState: 'yes' })}`
    },
    {
      title: 'This Year',
      fragment: `lockers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `lockers?${query_objectToString({ resetState: 'yes' })}`
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
