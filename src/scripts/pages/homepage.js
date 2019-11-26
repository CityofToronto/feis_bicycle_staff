/* global $ */
/* global moment */
/* global fixButtonLinks query_objectToString ajaxes oData_escapeValue */

/* exported renderHomePage */
function renderHomePage($container, query, auth) {
  $container.empty();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 1
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const $row1 = $('<div class="row"></div>');
  $container.append($row1);

  const $registrationsColumn = $(`
    <div class="col-sm-3">
      <h2>Registrations</h2>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ option: 'new', resetState: 'yes' })}" class="list-group-item">
          <span class="badge">?</span>
          New Entries
        </a>
        <a href="#registrations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
          <span class="badge">?</span>
          Today's Entries
        </a>
        <a href="#registrations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
          <span class="badge">?</span>
          This Year's Entries
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row1.append($registrationsColumn);

  const $customersColumn = $(`
    <div class="col-sm-3">
      <h2>Customers</h2>

      <div class="list-group">
        <a href="#customers?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
        <a href="#customers?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
        <a href="#customers" class="list-group-item"><span class="badge">?</span> All</a>
      </div>
    </div>
  `);
  $row1.append($customersColumn);

  const $subscriptionsColumn = $(`
    <div class="col-sm-3">
        <h2>Subscriptions</h2>

      <div class="list-group">
        <a href="#subscriptions" class="list-group-item"><span class="badge">?</span> About to Expire</a>
        <a href="#subscriptions?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> Today</a>
        <a href="#subscriptions?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
        <a href="#subscriptions?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> All</a>
      </div>
    </div>
  `);
  $row1.append($subscriptionsColumn);

  const $paymentsColumn = $(`
    <div class="col-sm-3">
      <h2>Payments</h2>

      <div class="list-group">
        <a href="#payments?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
        <a href="#payments?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
        <a href="#payments" class="list-group-item"><span class="badge">?</span> All</a>
      </div>
    </div>
  `);
  $row1.append($paymentsColumn);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 2
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const $row2 = $('<div class="row"></div>');
  $container.append($row2);

  const $locationsColumn = $(`
    <div class="col-sm-3">
      <h2>Locker Locations</h2>

      <div class="list-group">
        <a href="#locations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-locations-today">?</span>
          Today's Entries
        </a>
        <a href="#locations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-locations-thisyear">?</span>
          This Year's Entries
        </a>
        <a href="#locations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-locations">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row2.append($locationsColumn);

  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: '/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  const $lockersColumn = $(`
    <div class="col-sm-3">
      <h2>Lockers</h2>

      <div class="list-group">
        <a href="#lockers?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-lockers-today">?</span>
          Today's Entries
        </a>
        <a href="#lockers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-lockers-thisyear">?</span>
          This Year's Entries
        </a>
        <a href="#lockers?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-lockers">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row2.append($lockersColumn);

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: '/* @echo C3DATA_LOCKERS */?$select=id&$top=1000',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  const $stationsColumn = $(`
    <div class="col-sm-3">
      <h2>Stations</h2>

      <div class="list-group">
        <a href="#stations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-stations-today">?</span>
          Today Entries
        </a>
        <a href="#stations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-stations-thisyear">?</span>
          This Year's Entries
        </a>
        <a href="#stations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-stations">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row2.append($stationsColumn);

  ajaxes({
    url: `/* @echo C3DATA_STATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_STATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: '/* @echo C3DATA_STATIONS */?$select=id&$top=1000',
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  const $keyfobsColumn = $(`
    <div class="col-sm-3">
      <h2>Station Key Fobs</h2>

      <div class="list-group">
        <a href="#keyfobs?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-keyfobs-today">?</span>
          Today's Entries
        </a>
        <a href="#keyfobs?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-keyfobs-thisyear">?</span>
          This Year's Entries
        </a>
        <a href="#keyfobs?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-keyfobs">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row2.append($keyfobsColumn);

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: '/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000',
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 3
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const $row3 = $('<div class="row"></div>');
  $container.append($row3);

  const $activityLogsColumn = $(`
    <div class="col-sm-3">
      <h2>Activity Logs</h2>

      <div class="list-group">
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          Today's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          This Year's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row3.append($activityLogsColumn);

  const $emailLogsColumn = $(`
    <div class="col-sm-3">
      <h2>Email Logs</h2>

      <div class="list-group">
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          Today's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          This Year's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row3.append($emailLogsColumn);

  const $errorLogsColumn = $(`
    <div class="col-sm-3">
      <h2>Error Logs</h2>

      <div class="list-group">
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          Today's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          This Year's Entries
        </a>
        <a href="#" class="list-group-item">
          <span class="badge">?</span>
          All Entries
        </a>
      </div>
    </div>
  `);
  $row3.append($errorLogsColumn);

  fixButtonLinks($container);
}
