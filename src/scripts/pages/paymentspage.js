/* global moment */
/* global oData__escapeValue query__stringToObject query__objectToString */
/* global renderDatatable */

const paymentsPage__defaultOpt = 'lockers';
const paymentsPage__defaultOpt2 = 'all';

let paymentsPage__lastOpt;
let paymentsPage__lastOpt2;

const paymentsPage__stateSaveWebStorageKey = 'payments';

const paymentsPage__columns = {
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

/* exported paymentsPage__render */
function paymentsPage__render($pageContainer, opt, opt2, query, auth) {
  opt = opt || paymentsPage__defaultOpt;
  opt2 = opt2 || paymentsPage__defaultOpt2;

  const { resetState } = query__stringToObject(query);
  if (paymentsPage__lastOpt !== opt || paymentsPage__lastOpt2 !== opt2 || resetState === 'yes') {
    sessionStorage.removeItem(paymentsPage__stateSaveWebStorageKey);
    paymentsPage__lastOpt = opt;
    paymentsPage__lastOpt2 = opt2;
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
      fragment: `payments/${opt}/all?${query__objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (opt2) {
    default:
      definition.columns.push(
        Object.assign({}, paymentsPage__columns.action, {
          render(data) {
            return `<a href="#payments/${opt}/${opt2}/${data}?${query__objectToString({ resetState: 'yes' })}" class="btn btn-default dblclick-target">Open</a>`;
          }
        }),

        // paymentsPage__columns.name,

        paymentsPage__columns.__CreatedOn,
        paymentsPage__columns.__ModifiedOn,
        paymentsPage__columns.__Owner,
        paymentsPage__columns.__Status
      );

      definition.order.push([1, 'asc']);

      definition.searchCols[definition.columns.length - 1] = { search: 'Active' };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_PAYMENTS */',

    newButtonLabel: 'New Payment',
    newButtonFragment: `payments/${opt}/${opt2}/new`,

    stateSaveWebStorageKey: paymentsPage__stateSaveWebStorageKey,

    related
  });
}



