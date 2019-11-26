/* global $ */
/* global moment */
/* global fixButtonLinks query_objectToString ajaxes oData_escapeValue */

/* exported renderHomePage */
function renderHomePage($container, query, auth) {
  $container.empty();

  $container.append('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in nulla et ante ullamcorper elementum suscipit vel nibh. Duis accumsan nibh nec consequat vestibulum.</p>');

  const $row1 = $('<div class="row"></div>');
  $container.append($row1);

  const $registrationsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Registrations</div>
        <div class="list-group">
          <a href="#registrations" class="list-group-item"><span class="badge">?</span> New</a>
          <a href="#registrations?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
          <a href="#registrations?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
          <a href="#registrations" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row1.append($registrationsColumn);

  const $customersColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Customers</div>
        <div class="list-group">
          <a href="#customers?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
          <a href="#customers?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
          <a href="#customers" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row1.append($customersColumn);

  const $subscriptionsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Subscriptions</div>
        <div class="list-group">
          <a href="#subscriptions" class="list-group-item"><span class="badge">?</span> About to Expire</a>
          <a href="#subscriptions?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> Today</a>
          <a href="#subscriptions?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
          <a href="#subscriptions?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row1.append($subscriptionsColumn);

  const $paymentsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Payments</div>
        <div class="list-group">
          <a href="#payments?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
          <a href="#payments?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
          <a href="#payments" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row1.append($paymentsColumn);

  const $row2 = $('<div class="row"></div>');
  $container.append($row2);

  const $locationsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Locker Locations</div>
        <div class="list-group">
          <a href="#locations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-locations-today">?</span> Today</a>
          <a href="#locations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-locations-thisyear">?</span> This Year</a>
          <a href="#locations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge badge-locations">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row2.append($locationsColumn);


  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations-today').html(data['@odata.count']);
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations-thisyear').html(data['@odata.count']);
  });

  ajaxes({
    url: '/* @echo C3DATA_LOCATIONS */?$count=true&$select=id&$top=1',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $locationsColumn.find('.badge-locations').html(data['@odata.count']);
  });

  const $lockersColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Lockers</div>
        <div class="list-group">
          <a href="#lockers?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-lockers-today">?</span> Today</a>
          <a href="#lockers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-lockers-thisyear">?</span> This Year</a>
          <a href="#lockers?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge badge-lockers">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row2.append($lockersColumn);

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers-today').html(data['@odata.count']);
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers-thisyear').html(data['@odata.count']);
  });

  ajaxes({
    url: '/* @echo C3DATA_LOCKERS */?$count=true&$select=id&$top=1',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $lockersColumn.find('.badge-lockers').html(data['@odata.count']);
  });

  const $stationsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Stations</div>
        <div class="list-group">
          <a href="#stations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-stations-today">?</span> Today</a>
          <a href="#stations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge badge-stations-thisyear">?</span> This Year</a>
          <a href="#stations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge badge-stations">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row2.append($stationsColumn);

  ajaxes({
    url: `/* @echo C3DATA_STATIONS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations-today').html(data['@odata.count']);
  });

  ajaxes({
    url: `/* @echo C3DATA_STATIONS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations-thisyear').html(data['@odata.count']);
  });

  ajaxes({
    url: '/* @echo C3DATA_STATIONS */?$count=true&$select=id&$top=1',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $stationsColumn.find('.badge-stations').html(data['@odata.count']);
  });

  const $keyfobsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Station Key Fobs</div>
        <div class="list-group">
          <a href="#keyfobs?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge badge-keyfobs-today">?</span> Today</a>
          <a href="#keyfobs?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge badge-keyfobs-thisyear">?</span> This Year</a>
          <a href="#keyfobs" class="list-group-item"><span class="badge badge-keyfobs">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row2.append($keyfobsColumn);

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs-today').html(data['@odata.count']);
  });

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$count=true&$select=id&$top=1&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs-thisyear').html(data['@odata.count']);
  });

  ajaxes({
    url: '/* @echo C3DATA_KEYFOBS */?$count=true&$select=id&$top=1',
    method: 'GET',
    beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  }).then(({ data }) => {
    $keyfobsColumn.find('.badge-keyfobs').html(data['@odata.count']);
  });

  const $row3 = $('<div class="row"></div>');
  $container.append($row3);

  const $activityLogsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Activity Logs</div>
        <div class="list-group">
        <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
        <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
        <a href="#" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row3.append($activityLogsColumn);

  const $emailLogsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Email Logs</div>
        <div class="list-group">
          <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
          <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
          <a href="#" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row3.append($emailLogsColumn);

  const $errorLogsColumn = $(`
    <div class="col-sm-3">
      <div class="panel panel-default">
        <div class="panel-heading">Error Logs</div>
        <div class="list-group">
        <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">?</span> Today</a>
        <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">?</span> This Year</a>
        <a href="#" class="list-group-item"><span class="badge">?</span> All</a>
        </div>
      </div>
    </div>
  `);
  $row3.append($errorLogsColumn);

  fixButtonLinks($container);
}
