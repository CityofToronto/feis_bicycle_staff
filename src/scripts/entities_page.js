/* global $ */
/* global auth__checkLogin fixButtonLinks query__objectToString */

/* exported renderEntitiesPage */
function renderEntitiesPage(app, $container, router, auth) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    function listGroupItem(views) {
      return Object.keys(views).map((key) => {
        return `
          <a href="#${views[key].fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
            ${views[key].title}
          </a>
        `;
      }).join('');
    }

    $container.html('<p><a href="#home">Back to Home</a></p>');

    /* global entity__locations__views renderEntityLocationNotesPage__views renderEntityLocationInspectionsPage__views */
    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Locations</h3>

          <div class="list-group">
            ${listGroupItem(entity__locations__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Location Notes</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityLocationNotesPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Location Inspections</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityLocationInspectionsPage__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    /* global renderEntityLockersPage__views renderEntityLockerNotesPage__views renderEntityLockerInspectionsPage__views */
    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Lockers</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityLockersPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Locker Notes</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityLockerNotesPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Locker Inspections</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityLockerInspectionsPage__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    /* global renderEntityStationsPage__views renderEntityStationNotesPage__views renderEntityStationInspectionsPage__views */
    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Stations</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityStationsPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Station Notes</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityStationNotesPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Station Inspections</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityStationInspectionsPage__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    /* global renderEntityKeyfobsPage__views renderEntityKeyfobNotesPage__views */
    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Key Fobs</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityKeyfobsPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Key Fob Notes</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityKeyfobNotesPage__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    /* global renderEntityCustomersPage__views renderEntityPaymentsPage__views */
    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Customers</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityCustomersPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Customer Notes</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityCustomersPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Customer Notifications</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityCustomersPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Customer Emails</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityCustomersPage__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    $(`
      <div class="row">
        <div class="col-md-3">
          <h3>Payments</h3>

          <div class="list-group">
            ${listGroupItem(renderEntityPaymentsPage__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Payment Notes</h3>

          <div class="list-group">
            ${listGroupItem(entity__locations__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Payment Notification</h3>

          <div class="list-group">
            ${listGroupItem(entity__locations__views)}
          </div>
        </div>
      </div>
    `).appendTo($container);

    fixButtonLinks($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' }
    ];
    app.setBreadcrumb(breadcrumbs, true);

    app.setTitle('Entities');
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
