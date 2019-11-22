/* global $ moment */
/* global auth_checkLogin showLogin deepCloneObject fixButtonLinks oData_escapeValue oData_getErrorMessage query_objectToString stringToFunction */
/* global renderAlert */

/* exported renderDatatable */
function renderDatatable($container, definition, options = {}) {
  const {
    auth,
    url,

    newButtonLabel = 'New',
    newButtonFragment,

    stateSaveWebStorage = sessionStorage,
    stateSaveWebStorageKey,

    related
  } = options;

  $container.empty();
  const $innerContainer = $('<div class="datatableWidget"></div>');
  $container.append($innerContainer);

  definition = deepCloneObject(definition);

  definition.ajax = definition.ajax || function (data, callback, settings) {
    // const config = this.api().settings().init();
    function doAjax() {
      if (settings.oFeatures.bServerSide) {
        const queryObject = {};

        // $count
        queryObject['$count'] = true;

        // $select
        queryObject['$select'] = data.columns
          .filter((column) => typeof column.data === 'string')
          .map((column) => column.data)
          .filter((select, index, array) => array.indexOf(select) === index)
          .join(',');

        const dateFilter = (column, filterString) => {
          if (filterString.indexOf('to') !== -1) {
            const [startDate, endDate] = filterString.split('to');
            const momentStartDate = moment(startDate);
            const momentEndDate = moment(endDate);
            if (momentStartDate.isValid() || momentEndDate.isValid()) {
              let returnValues = [];
              if (momentStartDate.isValid()) {
                returnValues.push(`${column} ge ${oData_escapeValue(momentStartDate.startOf('day').format())}`);
              }
              if (momentEndDate.isValid()) {
                returnValues.push(`${column} le ${oData_escapeValue(momentEndDate.endOf('day').format())}`);
              }
              return `(${returnValues.join(' and ')})`;
            } else {
              return false;
            }
          } else {
            const momentDate = moment(filterString);
            if (momentDate.isValid()) {
              const returnValues = [
                `${column} ge ${oData_escapeValue(momentDate.startOf('day').format())}`,
                `${column} le ${oData_escapeValue(momentDate.endOf('day').format())}`
              ];
              return `(${returnValues.join(' and ')})`;
            } else {
              return false;
            }
          }
        };

        // $filter
        const filters = data.columns
          .map((column, index) => {
            if (column.searchable && column.search && column.search.value && column.search.value.trim()) {
              switch (definition.columns[index].type) {
                case 'boolean':
                case 'number':
                  return `(${column.data} eq ${oData_escapeValue(column.search.value)})`;

                case 'date':
                  return dateFilter(column.data, column.search.value);

                case 'function':
                  return `(${stringToFunction(definition.columns[index].filter)(column, definition.columns[index])})`;

                default:
                  if (definition.columns[index].searchType === 'equals') {
                    return `(tolower(${column.data}) eq '${oData_escapeValue(column.search.value.toLowerCase())}')`;
                  } else {
                    return `(${column.search.value
                      .split(' ')
                      .filter((value, index, array) => value && array.indexOf(value) === index)
                      .map((value) => `contains(tolower(${column.data}),'${oData_escapeValue(value.toLowerCase())}')`)
                      .join(' and ')})`;
                  }

              }
            } else {
              return false;
            }
          })
          .filter((value) => value);
        if (filters.length > 0) {
          queryObject['$filter'] = filters.join(' and ');// + 'and (' + $filter + ')';
        }

        // $orderby
        if (data.order.length > 0) {
          queryObject['$orderby'] = data.order
            .map((order) => {
              let orderBy = data.columns[order.column].data;
              switch (definition.columns[order.column].type) {
                case 'boolean':
                case 'number':
                case 'date':
                  return `${orderBy} ${order.dir}`;
                case 'function':
                  return stringToFunction(definition.columns[order.column].orderBy)(order, orderBy, definition.columns[order.column]);
                default:
                  return `tolower(${orderBy}) ${order.dir}`;
              }
            })
            .filter((value) => value)
            .join(',');
        }

        // $search
        if (data.search && data.search.value) {
          queryObject['$search'] = `"${data.search.value}"`;
        }

        // $skip
        queryObject['$skip'] = data.start;

        // $top
        queryObject['$top'] = data.length;

        $.ajax({
          url: `${url}?${query_objectToString(queryObject)}`,
          method: 'GET',
          contentType: 'application/json; charset=utf-8',
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          }
        }).then((response) => {
          callback({
            data: response.value,
            draw: data.draw,
            recordsTotal: response['@odata.count'],
            recordsFiltered: response['@odata.count']
          });
        }, (jqXHR, textStatus, errorThrown) => {
          renderAlert($innerContainer.find('.row-btn-top'), oData_getErrorMessage(jqXHR, errorThrown), {
            bootstrayType: 'danger',
            position: 'before'
          });

          callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });

          if (auth) {
            auth_checkLogin(auth, true).then((isLoggedIn) => {
              if (!isLoggedIn) {
                showLogin(auth).then((isLoggedIn) => {
                  if (isLoggedIn) {
                    doAjax();
                  }
                });
              }
            });
          }
        });

      } else {
        callback({ data: definition.data || [] });
      }
    }
    doAjax();
  };

  definition.buttons = definition.buttons || [
    {
      extend: 'copyHtml5',
      exportOptions: { columns: ':visible:not(.excludeFromButtons)' },
      title: document.title
    },
    {
      extend: 'csvHtml5',
      exportOptions: { columns: ':visible:not(.excludeFromButtons)' },
      title: document.title
    },
    {
      extend: 'excelHtml5',
      exportOptions: { columns: ':visible:not(.excludeFromButtons)' },
      title: document.title
    },
    {
      extend: 'pdfHtml5',
      exportOptions: { columns: ':visible:not(.excludeFromButtons)' },
      title: document.title
    },
    {
      extend: 'print',
      exportOptions: { columns: ':visible:not(.excludeFromButtons)' },
      title: document.title
    }
  ];

  definition.dom = definition.dom || `<'row'<'col-sm-8 col-md-9'f><'col-sm-4 col-md-3'l>><'row'<'col-sm-12'<'table-responsive'tr>>><'row'<'col-sm-5'i><'col-sm-7'p>><'hide'B>`;

  definition.language = definition.Language || {};
  definition.language.lengthMenu = definition.language.lengthMenu || 'Show _MENU_ Entries';

  definition.lengthMenu = definition.lengthMenu || [
    [10, 25, 50, 100, 250, 500, 1000, -1],
    [10, 25, 50, 100, 250, 500, 1000, 'All']
  ];

  definition.serverSide = definition.serverSide != null ? definition.serverSide : true;

  definition.stateSave = definition.stateSave != null ? definition.stateSave : stateSaveWebStorage && stateSaveWebStorageKey;

  definition.stateSaveCallback = definition.stateSaveCallback || ((settings, data) => {
    stateSaveWebStorage.setItem(stateSaveWebStorageKey, JSON.stringify(data));
  });

  definition.stateLoadCallback = definition.stateLoadCallback || (() => {
    try {
      return JSON.parse(stateSaveWebStorage.getItem(stateSaveWebStorageKey));
    } catch (error) {
      return;
    }
  });

  $innerContainer.empty();

  $innerContainer.append(`
    <div class="row row-btn-top">
      <div class="col-sm-6">
        ${newButtonLabel && newButtonFragment ? `<a class="btn btn-default" href="#${newButtonFragment}">${newButtonLabel}</a>` : ''}
      </div>
      <div class="col-sm-6 text-right">
        <button class="btn btn-default btn-reset">Reset Filters</button>
        <div class="dropdown btn-action">
          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Menu <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
            <li><a href="#" class="menu-reload">Reload</a></li>
            <li><a href="#" class="menu-copy">Copy</a></li>
            <li><a href="#" class="menu-print">Print</a></li>
            <li role="separator" class="divider"></li>
            <li class="dropdown-header">Download as</li>
            <li><a href="#" class="menu-csv">CSV</a></li>
            <li><a href="#" class="menu-excel">Excel</a></li>
            <li><a href="#" class="menu-pdf">PDF</a></li>
            ${related && related.length > 0 ? `
              <li role="separator" class="divider"></li>
              <li class="dropdown-header">Views</li>
              ${related.map(({ title, fragment, isCurrent }) => `
                <li>
                  <a ${fragment ? `href="#${fragment}"` : ''}>
                    ${title ? title : 'Untitled'}
                    ${isCurrent ? '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' : ''}
                  </a>
                </li>
              `)}
            ` : ''}
          </ul>
        </div>
      </div>
    </div>
  `);

  function buildFilter(column, index) {
    if (column.searchable !== false) {
      if (column.choices) {
        const $returnValue = $(`
          <th>
            <select class="form-control" aria-label="Filter by ${column.title || ''}" data-column-index="${index}">
            </select>
          </th>
        `);

        Promise.resolve().then(() => {
          if (!Array.isArray(column.choices)) {
            let choices = column.choices;
            if (typeof choices === 'string') {
              choices = {
                url: choices,
                method: 'GET'
              };
            }
            if (typeof choices === 'object' && choices !== null) {
              return new Promise((resolve, reject) => {
                $.ajax(choices).then((data) => {
                  column.choices = data;
                  resolve(data);
                }, () => {
                  reject();
                });
              });
            }
          }
        }).then(() => {
          if (column.choicesMap) {
            const choicesMap = stringToFunction(column.choicesMap);
            column.choices = choicesMap(column.choices);
          }

          if (column.choices.length === 0 || column.choices[0].value !== '') {
            column.choices.unshift({ text: '- Select -', value: '' });
          }

          $returnValue.find('select').append(column.choices.map((choice) => {
            return `<option value="${choice.value != null ? choice.value : choice.text}">${choice.text != null ? choice.text : choice.value}</option>`;
          }));
        });

        return $returnValue;
      } else {
        return `
          <th>
            <input type="text" class="form-control" aria-label="Filter by ${column.title || ''}" data-column-index="${index}">
          </th>
        `;
      }
    }

    return '<th></th>';
  }

  const $table = $(`
    <table class="table table-bordered table-striped" width="100%">
      <thead>
        <tr>
          ${definition.columns.map((column) => `<th>${column.orderable === false ? '<button style="display:none;"></button>' : ''}${column.title || ''}</th>`).join('')}
        </tr>
      </thead>
    </table>
  `);

  const $filterRow = $('<tr></tr>');
  definition.columns.forEach((column, index) => {
    $filterRow.append(buildFilter(column, index));
  });

  $table.find('thead').append($filterRow);

  $table.appendTo($innerContainer);

  definition.orderCellsTop = definition.orderCellsTop != null ? definition.orderCellsTop : true;

  const originalDrawCallback = definition.drawCallback;
  definition.drawCallback = function (...args) {
    const returnValue = originalDrawCallback ? originalDrawCallback.call(this, ...args) : null;

    fixButtonLinks($table);

    return returnValue;
  };

  const originalInitComplete = definition.initComplete;
  definition.initComplete = function (...args) {
    const returnValue = originalInitComplete ? originalInitComplete.call(this, ...args) : null;

    this.api().columns()[0].forEach((index) => {
      $table.find(`[data-column-index="${index}"]`)
        .val(this.api().column(index).search() || '');
    });

    return returnValue;
  };

  const datatable = window.datatable = $table.DataTable(definition);

  $innerContainer.on('keyup click', '.btn-reset', () => {
    datatable.search('');
    datatable.columns()[0].forEach((index) => {
      $table.find(`[data-column-index="${index}"]`).val('');
      datatable.column(index).search('');
    });
    datatable.draw();
  });

  $innerContainer.on('keyup click', '.menu-reload', () => {
    datatable.ajax.reload();
  });

  $innerContainer.on('keyup click', '.menu-copy', () => {
    $innerContainer.find('.dt-buttons .buttons-copy').click();
  });

  $innerContainer.on('keyup click', '.menu-print', () => {
    $innerContainer.find('.dt-buttons .buttons-print').click();
  });

  $innerContainer.on('keyup click', '.menu-csv', () => {
    $innerContainer.find('.dt-buttons .buttons-csv').click();
  });

  $innerContainer.on('keyup click', '.menu-excel', () => {
    $innerContainer.find('.dt-buttons .buttons-excel').click();
  });

  $innerContainer.on('keyup click', '.menu-pdf', () => {
    $innerContainer.find('.dt-buttons .buttons-pdf').click();
  });

  $table.on('keyup change', 'thead th input, thead th select', (event) => {
    const $target = $(event.target);
    datatable.column($target.attr('data-column-index')).search($target.val());
    datatable.draw();
  });

  if (newButtonLabel && newButtonFragment) {
    $innerContainer.append(`
      <div class="row">
        <div class="col-sm-12">
          <a class="btn btn-default" href="#${newButtonFragment}">${newButtonLabel}</a>
        </div>
      </div>
    `);
  }
}
