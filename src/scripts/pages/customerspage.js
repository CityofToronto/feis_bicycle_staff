/* global moment */
/* global oData__escapeValue query__stringToObject query__objectToString */
/* global renderDatatable */

const customersPage__defaultOpt = 'lockers';
const customersPage__defaultOpt2 = 'all';

let customersPage__lastOpt;
let customersPage__lastOpt2;

const customersPage__stateSaveWebStorageKey = 'customers';

const customersPage__columns = {
  action: {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    searchable: false
  },

  name: {
    title: 'Name',
    className: 'minWidth',
    data: 'first_name',
    select: 'last_name',
    type: 'function',
    render(data, settings, row) {
      return [data, row['last_name']].filter((value) => value).join(' ');
    },
    filter(column) {
      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `contains(tolower(concat(concat(first_name,' '),last_name)),'${oData__escapeValue(value.toLowerCase())}')`)
        .join(' and ');
    },
    orderBy(order) {
      return `tolower(concat(concat(first_name,' '),last_name)) ${order.dir}`;
    }
  },

  __CreatedOn: {
    title: 'Created On',
    className: 'minWidth',
    data: '__CreatedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD');
      } else {
        return '';
      }
    }
  },
  __ModifiedOn: {
    title: 'Modified On',
    className: 'minWidth',
    data: '__ModifiedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD');
      } else {
        return '';
      }
    }
  },
  __Owner: {
    title: 'Modified By',
    className: 'minWidth',
    data: '__Owner',
    type: 'string'
  },
  __Status: {
    title: 'Status',
    className: 'statusWidth',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: [{ text: 'Active' }, { text: 'Inactive' }],
    render(data) {
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }
};

/* exported customersPage__render */
function customersPage__render($pageContainer, opt, opt2, query, auth) {
  opt = opt || customersPage__defaultOpt;
  opt2 = opt2 || customersPage__defaultOpt2;

  const { resetState } = query__stringToObject(query);
  if (customersPage__lastOpt !== opt || customersPage__lastOpt2 !== opt2 || resetState === 'yes') {
    sessionStorage.removeItem(customersPage__stateSaveWebStorageKey);
    customersPage__lastOpt = opt;
    customersPage__lastOpt2 = opt2;
  }

  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    <div class="datatable"></div>
  `);

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  const related = [
    {
      title: 'All',
      fragment: `customers/${opt}/all?${query__objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (opt2) {
    default:
      definition.columns.push(
        Object.assign({}, customersPage__columns.action, {
          render(data) {
            return `<a href="#customers/${opt}/${opt2}/${data}?${query__objectToString({ resetState: 'yes' })}" class="btn btn-default dblclick-target">Open</a>`;
          }
        }),

        customersPage__columns.name,

        customersPage__columns.__CreatedOn,
        customersPage__columns.__ModifiedOn,
        customersPage__columns.__Owner,
        customersPage__columns.__Status
      );

      definition.order.push([1, 'asc']);

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_CUSTOMERS */',

    newButtonLabel: 'New Customer',
    newButtonFragment: `customers/${opt}/${opt2}/new`,

    stateSaveWebStorageKey: customersPage__stateSaveWebStorageKey,

    related
  });
}




// let lastLocationsPageOption;

// /* exported renderCustomersPage */
// function renderCustomersPage($pageContainer, query, auth) {
//   const queryObject = query__stringToObject(query);

//   if (lastLocationsPageOption != queryObject.option) {
//     clearCustomersState();
//     lastLocationsPageOption = queryObject.option;
//   }

//   if (query) {
//     query = `?${query}`;
//   } else {
//     query = '';
//   }

//   $pageContainer.html(`
//     <p><a href="#home">Back to Home</a></p>

//     ${queryObject.option === 'active' ? '<h2>All Active</h2>' : ''}

//     <div class="datatable"></div>
//   `);

//   const columns = {};

//   columns['Action'] = {
//     title: 'Action',
//     className: 'excludeFromButtons openButtonWidth',
//     data: 'id',
//     orderable: false,
//     render(data) {
//       return `<a href="#customers/${data}${query}" class="btn btn-default">Open</a>`;
//     },
//     searchable: false
//   };

//   columns['Name'] = {
//     title: 'Name',
//     className: 'minWidth',
//     type: 'function',
//     select: ['first_name', 'last_name'],
//     render(data, settings, row) {
//       return [row['first_name'], row['last_name']].filter((value) => value).join(' ');
//     },
//     filter(column) {
//       return column.search.value
//         .split(' ')
//         .filter((value, index, array) => value && array.indexOf(value) === index)
//         .map((value) => `(contains(tolower(first_name),'${oData__escapeValue(value.toLowerCase())}') or contains(tolower(last_name),'${oData__escapeValue(value.toLowerCase())}'))`)
//         .join(' and ');
//     },
//     orderBy(order) {
//       return `tolower(first_name) ${order.dir},tolower(last_name) ${order.dir}`;
//     }
//   };

//   columns['Modified On'] = {
//     title: 'Modified On',
//     className: 'minWidth',
//     data: '__ModifiedOn',
//     type: 'date',
//     render(data) {
//       const dataMoment = moment(data);
//       if (dataMoment.isValid()) {
//         return dataMoment.format('YYYY/MM/DD');
//       } else {
//         return '-';
//       }
//     }
//   };

//   columns['Modified By'] = {
//     title: 'Modified By',
//     className: 'minWidth',
//     data: '__Owner',
//     type: 'string'
//   };


//   columns['Status'] = {
//     title: 'Status',
//     className: 'statusWidth',
//     data: '__Status',
//     type: 'string',
//     searchType: 'equals',
//     choices: [{ text: 'Active' }, { text: 'Inactive' }],
//     render(data) {
//       return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
//     }
//   };

//   const definition = {
//     columns: [],
//     order: [],
//     searchCols: []
//   };

//   let columnCounter = 0;

//   definition.columns[columnCounter++] = columns['Action'];

//   definition.columns[columnCounter++] = columns['Name'];
//   definition.order.push([columnCounter - 1, 'asc']);

//   const related = [
//     {
//       title: 'All Active',
//       fragment: `customers?${query__objectToString({ option: 'active', resetState: 'yes' })}`
//     },
//     {
//       title: 'All',
//       fragment: `customers?${query__objectToString({ resetState: 'yes' })}`
//     }
//   ];

//   switch (queryObject.option) {
//     case 'active':
//       definition.columns[columnCounter++] = columns['Status'];
//       definition.columns[columnCounter - 1].visible = false;
//       definition.searchCols[columnCounter - 1] = { search: 'Active' };

//       related[0].isCurrent = true;
//       break;

//     default:
//       definition.columns[columnCounter++] = columns['Modified On'];
//       definition.columns[columnCounter++] = columns['Modified By'];
//       definition.columns[columnCounter++] = columns['Status'];

//       related[1].isCurrent = true;
//   }

//   renderDatatable($pageContainer.find('.datatable'), definition, {
//     auth,
//     url: '/* @echo C3DATA_CUSTOMERS */',

//     newButtonLabel: 'New Customer',
//     newButtonFragment: `customers/new${query}`,

//     stateSaveWebStorageKey: `customers`,

//     related
//   });
// }

// /* exported clearCustomersState */
// function clearCustomersState() {
//   sessionStorage.removeItem('customers');
// }
