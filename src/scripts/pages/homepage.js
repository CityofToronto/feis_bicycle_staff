/* global $ */
/* global ajaxes fixButtonLinks query_objectToString */

/* exported renderHomePage */
function renderHomePage($container, query, auth) {
  $container.empty();

  const $wrapper = $('<div class="homePage"></div>');
  $container.append($wrapper);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // BICYCLE LOCKERS ROW
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $wrapper.append('<h2 id="lockersHeader">Bicycle Lockers</h2>');

  const $lockers = $('<div class="row"></div>');
  $wrapper.append($lockers);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $lockers.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="lockersHeader">Locations</h3>

      <div class="list-group">
        <a href="#locations?${query_objectToString({ option: 'active', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-locations-active">~</span>
          All Active
        </a>

        <a href="#locations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-locations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active'`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $lockers.find('.badge-locations-active').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $lockers.find('.badge-locations').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $lockers.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="lockersHeader">Lockers</h3>

      <div class="list-group">
        <a href="#lockers?${query_objectToString({ option: 'active', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-lockers-active">~</span>
          All Active
        </a>

        <a href="#lockers?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-lockers">~</span>
          All
        </a>
      </div>
    </div>
  `);

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000&$filter=__Status eq 'Active'`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $lockers.find('.badge-lockers-active').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $lockers.find('.badge-lockers').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $lockers.append('<div class="clearfix visible-sm-block"></div>');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $lockers.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="lockersHeader">Customers</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All Active
        </a>
        <!--
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          New
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Waiting
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Assigned
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Expired
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Email Addresses
        </a>
        -->
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $lockers.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="lockersHeader">Payments</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All Active
        </a>
        <!--
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          By Year
        </a>
        -->
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // BICYCLE STATIONS ROW
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $wrapper.append(`<h2 id="stationsHeader">Bicycle Stations</h2>`);

  const $stations = $('<div class="row"></div>');
  $wrapper.append($stations);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $stations.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="stationsHeader">Stations</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All Active
        </a>
        <!--
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Waiting List
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Up for Inspection
        </a>
        -->
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $stations.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="stationsHeader">Key Fobs</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ option: 'active', resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-keyfobs-active">~</span>
          All Active
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-keyfobs">~</span>
          All
        </a>
      </div>
    </div>
  `);

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000&$filter=__Status eq 'Active'`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $stations.find('.badge-keyfobs-active').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  ajaxes({
    url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000`,
    method: 'GET',
    beforeSend(jqXHR) {
      if (auth && auth.sId) {
        jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
      }
    }
  }).then(({ data }) => {
    $stations.find('.badge-keyfobs').html(data.value.length !== 1000 ? data.value.length : '999+');
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $stations.append('<div class="clearfix visible-sm-block"></div>');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $stations.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="stationsHeader">Customers</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All Active
        </a>
        <!--
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          New
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Waiting
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Assigned
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Expired
        </a>
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          Email Addresses
        </a>
        -->
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $stations.append(`
    <div class="col-sm-6 col-md-3">
      <h3 aria-labelledby="stationsHeader">Payments</h3>

      <div class="list-group">
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All Active
        </a>
        <!--
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          By Year
        </a>
        -->
        <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
          <span class="badge badge-registrations">~</span>
          All
        </a>
      </div>
    </div>
  `);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  fixButtonLinks($container);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 1
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const $row1 = $('<div class="row"></div>');
  // $container.append($row1);

  // const $registrationsColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Registrations</h2>

  //     <div class="list-group">
  //       <a href="#registrations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-registrations-today">~</span>
  //         Today's Entries
  //       </a>
  //       <a href="#registrations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-registrations-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#registrations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-registrations">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row1.append($registrationsColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_REGISTRATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $registrationsColumn.find('.badge-registrations-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_REGISTRATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $registrationsColumn.find('.badge-registrations-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_REGISTRATIONS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $registrationsColumn.find('.badge-registrations').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // const $customersColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Customers</h2>

  //     <div class="list-group">
  //       <a href="#customers?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-customers-today">~</span>
  //         Today's Entries
  //       </a>
  //       <a href="#customers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-customers-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#customers?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-customers">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row1.append($customersColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_CUSTOMERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $customersColumn.find('.badge-customers-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_CUSTOMERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $customersColumn.find('.badge-customers-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_CUSTOMERS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $customersColumn.find('.badge-customers').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // const $subscriptionsColumn = $(`
  //   <div class="col-sm-3">
  //       <h2>Subscriptions</h2>

  //     <div class="list-group">
  //       <a href="#subscriptions" class="list-group-item"><span class="badge">~</span> About to Expire</a>
  //       <a href="#subscriptions?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item"><span class="badge">~</span> Today</a>
  //       <a href="#subscriptions?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item"><span class="badge">~</span> This Year</a>
  //       <a href="#subscriptions?${query_objectToString({ resetState: 'yes' })}" class="list-group-item"><span class="badge">~</span> All</a>
  //     </div>
  //   </div>
  // `);
  // $row1.append($subscriptionsColumn);

  // const $paymentsColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Payments</h2>

  //     <div class="list-group">
  //       <a href="#payments?${query_objectToString({ option: 'today' })}" class="list-group-item"><span class="badge">~</span> Today</a>
  //       <a href="#payments?${query_objectToString({ option: 'thisyear' })}" class="list-group-item"><span class="badge">~</span> This Year</a>
  //       <a href="#payments" class="list-group-item"><span class="badge">~</span> All</a>
  //     </div>
  //   </div>
  // `);
  // $row1.append($paymentsColumn);

  // fixButtonLinks($row1);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 2
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const $row2 = $('<div class="row"></div>');
  // $container.append($row2);

  // const $locationsColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Locker Locations</h2>

  //     <div class="list-group">
  //       <a href="#locations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-locations-today">~</span>
  //         Today's Entries
  //       </a>
  //       <a href="#locations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-locations-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#locations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-locations">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row2.append($locationsColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $locationsColumn.find('.badge-locations-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $locationsColumn.find('.badge-locations-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_LOCATIONS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $locationsColumn.find('.badge-locations').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // const $lockersColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Lockers</h2>

  //     <div class="list-group">
  //       <a href="#lockers?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-lockers-today">~</span>
  //         Today's Entries
  //       </a>
  //       <a href="#lockers?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-lockers-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#lockers?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-lockers">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row2.append($lockersColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $lockersColumn.find('.badge-lockers-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_LOCKERS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $lockersColumn.find('.badge-lockers-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_LOCKERS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) { if (auth && auth.sId) { jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`); } }
  // }).then(({ data }) => {
  //   $lockersColumn.find('.badge-lockers').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // const $stationsColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Stations</h2>

  //     <div class="list-group">
  //       <a href="#stations?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-stations-today">~</span>
  //         Today Entries
  //       </a>
  //       <a href="#stations?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-stations-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#stations?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-stations">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row2.append($stationsColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_STATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $stationsColumn.find('.badge-stations-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_STATIONS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $stationsColumn.find('.badge-stations-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_STATIONS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $stationsColumn.find('.badge-stations').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // const $keyfobsColumn = $(`
  //   <div class="col-sm-3">
  //     <h2>Station Key Fobs</h2>

  //     <div class="list-group">
  //       <a href="#keyfobs?${query_objectToString({ option: 'today', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-keyfobs-today">~</span>
  //         Today's Entries
  //       </a>
  //       <a href="#keyfobs?${query_objectToString({ option: 'thisyear', resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-keyfobs-thisyear">~</span>
  //         This Year's Entries
  //       </a>
  //       <a href="#keyfobs?${query_objectToString({ resetState: 'yes' })}" class="list-group-item">
  //         <span class="badge badge-keyfobs">~</span>
  //         All Entries
  //       </a>
  //     </div>
  //   </div>
  // `);
  // $row2.append($keyfobsColumn);

  // ajaxes({
  //   url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('day').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('day').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $keyfobsColumn.find('.badge-keyfobs-today').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: `/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000&$filter=__Status eq 'Active' and __ModifiedOn ge ${oData_escapeValue(moment().startOf('year').format())} and __ModifiedOn le ${oData_escapeValue(moment().endOf('year').format())}`,
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $keyfobsColumn.find('.badge-keyfobs-thisyear').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // ajaxes({
  //   url: '/* @echo C3DATA_KEYFOBS */?$select=id&$top=1000',
  //   method: 'GET',
  //   beforeSend(jqXHR) {
  //     if (auth && auth.sId) {
  //       jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //     }
  //   }
  // }).then(({ data }) => {
  //   $keyfobsColumn.find('.badge-keyfobs').html(data.value.length !== 1000 ? data.value.length : '999+');
  // });

  // fixButtonLinks($container);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ROW 3
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // auth_checkAccess(auth, '/* @echo C3CONFIG_ADMIN_RESOURCE */', 'GET').then((hasAccess) => {
  //   if (hasAccess) {
  //     const $row3 = $('<div class="row"></div>');
  //     $container.append($row3);

  //     const $activityLogsColumn = $(`
  //       <div class="col-sm-3">
  //         <h2>Activity Logs</h2>

  //         <div class="list-group">
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             Today's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             This Year's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             All Entries
  //           </a>
  //         </div>
  //       </div>
  //     `);
  //     $row3.append($activityLogsColumn);

  //     const $emailLogsColumn = $(`
  //       <div class="col-sm-3">
  //         <h2>Email Logs</h2>

  //         <div class="list-group">
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             Today's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             This Year's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             All Entries
  //           </a>
  //         </div>
  //       </div>
  //     `);
  //     $row3.append($emailLogsColumn);

  //     const $errorLogsColumn = $(`
  //       <div class="col-sm-3">
  //         <h2>Error Logs</h2>

  //         <div class="list-group">
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             Today's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             This Year's Entries
  //           </a>
  //           <a href="#" class="list-group-item">
  //             <span class="badge">~</span>
  //             All Entries
  //           </a>
  //         </div>
  //       </div>
  //     `);
  //     $row3.append($errorLogsColumn);

  //     fixButtonLinks($row3);
  //   }
  // });
}
