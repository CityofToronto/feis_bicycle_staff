/* global $ */
/* global deepCloneObject fixButtonLinks oData_escapeValue oData_getErrorMessage query_objectToString stringToFunction */
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

  } = options;

  definition = deepCloneObject(definition);

  definition.ajax = definition.ajax || function (data, callback, settings) {
    // const config = this.api().settings().init();
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

      // $filter
      const filters = data.columns
        .map((column, index) => {
          if (column.searchable && column.search && column.search.value && column.search.value.trim()) {
            switch (definition.columns[index].type) {
              case 'boolean':
              case 'number':
                return `${column.data} eq ${oData_escapeValue(column.search.value)}`;

              case 'date':
                return `${column.data} eq ${oData_escapeValue(column.search.value)}`;

              case 'function':
                return `(${stringToFunction(definition.columns[index].filter)(column, definition.columns[index])})`;

              default:
                return `(${column.search.value
                  .split(' ')
                  .filter((value, index, array) => value && array.indexOf(value) === index)
                  .map((value) => `contains(tolower(${column.data}),'${oData_escapeValue(value.toLowerCase())}')`)
                  .join(' and ')})`;
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
        renderAlert(this.closest('.table-responsive'), oData_getErrorMessage(jqXHR, errorThrown), {
          bootstrayType: 'danger',
          position: 'before'
        });

        callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });

        // TODO: ACCESS CHECK FOR RELOAD
      });

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

  // TODO: Topper
  $container.empty();

  $container.append(`
    <div class="row row-btn">
      <div class="col-sm-6">
        ${newButtonLabel && newButtonFragment ? `<a class="btn btn-default" href="#${newButtonFragment}">${newButtonLabel}</a>` : ''}
      </div>
      <div class="col-sm-6 text-right">
        <button class="btn btn-default btn-reset">Reset Filters</button>
        <div class="dropdown btn-action">
          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Action <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
            <li><a href="#">Reload</a></li>
            <li><a href="#">Copy</a></li>
            <li><a href="#">Print</a></li>
            <li role="separator" class="divider"></li>
            <li class="dropdown-header">Download as</li>
            <li><a href="#">CSV</a></li>
            <li><a href="#">Excel</a></li>
            <li><a href="#">PDF</a></li>
            <li role="separator" class="divider"></li>
            <!--
            <li class="dropdown-header">Views</li>
            <li><a href="#">Default <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a></li>
            <li><a href="#">Active Locations</a></li>
            <li><a href="#">Inactive Locations</a></li>
            -->
          </ul>
        </div>
      </div>
    </div>
  `);

  function buildFilter(column, index) {
    if (column.searchable !== false) {
      if (column.choices) {
        return `
          <th>
            <select class="form-control" aria-label="Filter by ${column.title || ''}" data-column-index="${index}">
              ${column.choices.map((choice) => `<option value="${choice.value != null ? choice.value : choice.text}">${choice.text != null ? choice.text : choice.value}</option>`)}
            </select>
          </th>
        `;
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
          ${definition.columns.map((column) => `<th>${column.title || ''}</th>`).join('')}
        </tr>
        <tr>
          ${definition.columns.map(buildFilter).join('')}
        </tr>
      </thead>
    </table>
  `);

  $table.appendTo($container);

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

  $table.DataTable(definition);

  // TODO: Footer

  if (newButtonLabel && newButtonFragment) {
    $container.append(`
      <div class="row">
        <div class="col-sm-12">
          <a class="btn btn-default" href="#${newButtonFragment}">${newButtonLabel}</a>
        </div>
      </div>
    `);
  }
}
