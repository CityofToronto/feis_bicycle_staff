/* global $ renderDatatable query__stringToObject query__objectToString moment */

let lastKeyfobsPageOption;

/* exported renderKeyfobsPage */
function renderKeyfobsPage($pageContainer, query, auth) {
  const queryObject = query__stringToObject(query);

  if (lastKeyfobsPageOption != queryObject.option) {
    clearKeyfobsState();
    lastKeyfobsPageOption = queryObject.option;
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

  let stationMap = {};

  const columns = {
    'Action': {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href="#keyfobs/${data}${query}" class="btn btn-default">Open</a>`;
      },
      searchable: false
    },
    'Stations': {
      title: 'Stations',
      className: 'minWidthLarge',
      data: 'stations',
      type: 'string',
      choices: {
        url: '/* @echo C3DATA_STATIONS */?$select=id,name&$filter=__Status eq \'Active\'&$top=5000',
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      },
      choicesMap(data) {
        if (data && data.value) {
          return data.value.map((value) => ({ text: value.name, value: value.id }));
        }
        return [];
      },
      render(data) {
        return data.map((data) => stationMap[data] || '...').join(', ');
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
  definition.columns[1] = columns['Number'];
  definition.columns[2] = columns['Description'];
  definition.columns[3] = columns['Stations'];
  definition.columns[4] = columns['Modified On'];
  definition.columns[5] = columns['Modified By'];

  definition.order.push([1, 'asc']);

  definition.initComplete = function (settings, json) {
    if (json && json.data && json.data.length > 0) {
      const filter = json.data
        .map((value) => value.stations)
        .flat()
        .filter((value, index, array) => array.indexOf(value) === index)
        .map((value) => `id eq '${value}'`)
        .join(' or ');

      $.ajax(`/* @echo C3DATA_STATIONS */?$select=id,name&$filter=${filter}`, {
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      }).then((response) => {
        stationMap = response.value.reduce((accumulator, value) => {
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
      fragment: `keyfobs?${query__objectToString({ option: 'today', resetState: 'yes' })}`
    },
    {
      title: 'This Year',
      fragment: `keyfobs?${query__objectToString({ option: 'thisyear', resetState: 'yes' })}`
    },
    {
      title: 'All',
      fragment: `keyfobs?${query__objectToString({ resetState: 'yes' })}`
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
    url: '/* @echo C3DATA_KEYFOBS */',

    newButtonLabel: 'New Station Key Fobs',
    newButtonFragment: `keyfobs/new${query}`,

    stateSaveWebStorageKey: 'keyfobs',

    related
  });
}

/* exported clearKeyfobsState */
function clearKeyfobsState() {
  sessionStorage.removeItem('keyfobs');
}
