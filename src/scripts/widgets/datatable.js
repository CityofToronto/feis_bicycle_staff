/* global $ moment */
/* global ajaxes auth__checkLogin deepCloneObject fixButtonLinks modal__showLogin oData__escapeValue
   oData__getErrorMessage query__objectToString stringToFunction */
/* global renderAlert */

function renderDatatable__dateFilter(column, filterString) {
  filterString = filterString.trim().toLowerCase();
  if (filterString.indexOf('to') !== -1) {
    let [startDate, endDate] = filterString.split('to');
    startDate = startDate.trim();
    endDate = endDate.trim();
    const momentStartDate = moment(startDate, 'YYYY/MM/DD');
    const momentEndDate = moment(endDate, 'YYYY/MM/DD');
    if (momentStartDate.isValid() || momentEndDate.isValid()) {
      let returnValues = [];
      if (momentStartDate.isValid()) {
        if (/^[^/]+$/.test(startDate)) {
          returnValues.push(`${column} ge ${oData__escapeValue(momentStartDate.startOf('year').format())}`);
        } else if (/^[^/]+\/[^/]+$/.test(startDate)) {
          returnValues.push(`${column} ge ${oData__escapeValue(momentStartDate.startOf('month').format())}`);
        } else {
          returnValues.push(`${column} ge ${oData__escapeValue(momentStartDate.startOf('day').format())}`);
        }
      }
      if (momentEndDate.isValid()) {
        if (/^[^/]+$/.test(endDate)) {
          returnValues.push(`${column} le ${oData__escapeValue(momentEndDate.startOf('year').format())}`);
        } else if (/^[^/]+\/[^/]+$/.test(endDate)) {
          returnValues.push(`${column} le ${oData__escapeValue(momentEndDate.startOf('month').format())}`);
        } else {
          returnValues.push(`${column} le ${oData__escapeValue(momentEndDate.startOf('day').format())}`);
        }
      }
      return `(${returnValues.join(' and ')})`;
    } else {
      return false;
    }
  } else {
    const momentDate = moment(filterString, 'YYYY/MM/DD');
    if (momentDate.isValid()) {
      let returnValues = false;
      if (/^[^/]+$/.test(filterString)) {
        returnValues = `(${[
          `${column} ge ${oData__escapeValue(momentDate.startOf('year').format())}`,
          `${column} le ${oData__escapeValue(momentDate.endOf('year').format())}`
        ].join(' and ')})`;
      } else if (/^[^/]+\/[^/]+$/.test(filterString)) {
        returnValues = `(${[
          `${column} ge ${oData__escapeValue(momentDate.startOf('month').format())}`,
          `${column} le ${oData__escapeValue(momentDate.endOf('month').format())}`
        ].join(' and ')})`;
      } else {
        returnValues = `(${[
          `${column} ge ${oData__escapeValue(momentDate.startOf('day').format())}`,
          `${column} le ${oData__escapeValue(momentDate.endOf('day').format())}`
        ].join(' and ')})`;
      }

      return returnValues;
    } else {
      return false;
    }
  }
}

function renderDatatable__buildFilter(column, index) {
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
              ajaxes(choices).then(({ data }) => {
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

/* exported renderDatatable */
function renderDatatable($container, definition, options = {}) {
  const {
    auth,
    url,

    newButtonLabel = 'New',
    newButtonFragment,

    stateSaveWebStorage = sessionStorage,
    stateSaveWebStorageKey,

    views
  } = options;

  const $innerContainer = $('<div class="datatableWidget"></div>'); // Needed for styling.
  $container.append($innerContainer);


  definition = deepCloneObject(definition);

  definition.ajaxCore = definition.ajaxCore || function (data, callback, settings, queryObject, url, options = {}) {
    const { auth } = options;

    return ajaxes({
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: `${url}?${query__objectToString(queryObject)}`
    }).then(({ data: response }) => {
      callback({
        data: response.value,
        draw: data.draw,
        recordsTotal: response['@odata.count'],
        recordsFiltered: response['@odata.count']
      });
    }, (error) => {
      callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });
      throw error;
    });
  };

  definition.ajax = definition.ajax || function (data, callback, settings) {
    if (settings.oFeatures.bServerSide) {
      const doAjax = () => {
        const queryObject = {};

        // $count
        queryObject['$count'] = true;

        // $select
        queryObject['$select'] = data.columns
          .filter((column) => typeof column.data === 'string')
          .map((column) => column.data)
          .concat(definition.columns.map((column) => column.select))
          .reduce((acc, cur) => {
            if (typeof cur === 'string') {
              acc.push(cur);
            } else if (Array.isArray(cur)) {
              acc.push(...cur);
            }
            return acc;
          }, [])
          .filter((select, index, array) => array.indexOf(select) === index)
          .join(',');

        // $filter
        const filters = data.columns
          .map((column, index) => {
            if (column.searchable && column.search && column.search.value && column.search.value.trim()) {
              switch (definition.columns[index].type) {
                case 'boolean':
                case 'number':
                  return `(${column.data} eq ${oData__escapeValue(column.search.value)})`;

                case 'date':
                  return renderDatatable__dateFilter(column.data, column.search.value);

                case 'function':
                  var returnValue = stringToFunction(definition.columns[index].filter)(column, definition.columns[index]);
                  if (returnValue) {
                    return `(${returnValue})`;
                  } else {
                    return false;
                  }

                default:
                  if (definition.columns[index].searchType === 'equals') {
                    return `(tolower(${column.data}) eq '${oData__escapeValue(column.search.value.toLowerCase())}')`;
                  } else {
                    return `(${column.search.value
                      .split(' ')
                      .filter((value, index, array) => value && array.indexOf(value) === index)
                      .map((value) => `contains(tolower(${column.data}),'${oData__escapeValue(value.toLowerCase())}')`)
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

        definition.ajaxCore(data, callback, settings, queryObject, url, { auth }).catch(({ jqXHR, errorThrown }) => {
          renderAlert($innerContainer.find('.row-btn-top'), oData__getErrorMessage(jqXHR, errorThrown), {
            bootstrayType: 'danger',
            position: 'before'
          });

          if (auth) {
            auth__checkLogin(auth, true).then((isLoggedIn) => {
              if (!isLoggedIn) {
                modal__showLogin(auth).then((isLoggedIn) => {
                  if (isLoggedIn) {
                    doAjax();
                  }
                });
              }
            });
          }
        });
      };
      doAjax();
    } else {
      callback({ data: definition.data || [] });
    }
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

  definition.stateSave = definition.stateSave != null ? definition.stateSave : stateSaveWebStorageKey != null;
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

  definition.orderCellsTop = definition.orderCellsTop != null ? definition.orderCellsTop : true;

  $innerContainer.append(`
    <div class="row row-btn-top">
      <div class="col-sm-6">
        ${newButtonFragment != null ? `<a class="btn btn-default btn-new" href="#${newButtonFragment}">${newButtonLabel}</a>` : ''}
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
            ${views != null && views.length > 0 ? `
              <li role="separator" class="divider"></li>
              <li class="dropdown-header">Views</li>
              ${views.map(({ title, fragment, isCurrent }) => `
                <li>
                  <a ${fragment ? `href="#${fragment}"` : ''}>
                    ${title ? title : 'Untitled'}
                    ${isCurrent ? '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' : ''}
                  </a>
                </li>
              `).join('')}
            ` : ''}
          </ul>
        </div>
      </div>
    </div>
  `);

  const $table = $(`
    <table class="table table-bordered table-striped" width="100%">
      <thead>
        <tr>
          ${definition.columns.map((column) => {
            return `<th>${column.orderable === false ? '<button style="display:none;"></button>' : ''}${column.title || ''}</th>`;
          }).join('')}
        </tr>
      </thead>
    </table>
  `);
  const $filterRow = $('<tr></tr>').appendTo($table.find('thead'));
  definition.columns.forEach((column, index) => {
    $filterRow.append(renderDatatable__buildFilter(column, index));
  });
  $innerContainer.append($table);

  if (newButtonFragment != null) {
    $innerContainer.append(`
      <div class="row">
        <div class="col-sm-12">
          <p><a class="btn btn-default btn-new" href="#${newButtonFragment}">${newButtonLabel}</a></p>
        </div>
      </div>
    `);
  }

  fixButtonLinks($container);

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

  const datatable = $table.DataTable(definition);

  $innerContainer.find('.btn-reset').on('keyup click', () => {
    datatable.search(definition.search && definition.search.search ? definition.search.search : '');

    datatable.columns()[0].forEach((index) => {
      const $input = $table.find(`[data-column-index="${index}"]`);
      if ($input.is(':visible')) {
        const value = definition.searchCols && definition.searchCols[index] && definition.searchCols[index].search
          ? definition.searchCols[index].search
          : '';
        $input.val(value);
        datatable.column(index).search(value);
      }
    });
    datatable.draw();
  });

  $innerContainer.find('.menu-reload').on('keyup click', () => {
    datatable.ajax.reload();
  });

  $innerContainer.find('.menu-copy').on('keyup click', () => {
    $innerContainer.find('.dt-buttons .buttons-copy').click();
  });

  $innerContainer.find('.menu-print').on('keyup click', () => {
    $innerContainer.find('.dt-buttons .buttons-print').click();
  });

  $innerContainer.find('.menu-csv').on('keyup click', () => {
    $innerContainer.find('.dt-buttons .buttons-csv').click();
  });

  $innerContainer.find('.menu-excel').on('keyup click', () => {
    $innerContainer.find('.dt-buttons .buttons-excel').click();
  });

  $innerContainer.find('.menu-pdf').on('keyup click', () => {
    $innerContainer.find('.dt-buttons .buttons-pdf').click();
  });

  $table.find('thead th input, thead th select').on('keyup change', (event) => {
    const $target = $(event.currentTarget);
    datatable.column($target.attr('data-column-index')).search($target.val());
    datatable.draw();
  });

  $table.find('tbody').on('dblclick', (event) => {
    const $link = $(event.target).closest('tr').find('.dblclick-target');
    window.location.href = $link.attr('href');
  });
}
