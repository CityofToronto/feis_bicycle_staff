/* global $ */
/* global auth__checkLogin fixButtonLinks query__objectToString */

/* exported renderEntitiesPage */
function renderEntitiesPage(app, $container, router, auth) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    $container.html('<p><a href="#home">Back to Home</a></p>');

    /* global renderEntityLocationsPage__views renderEntityLocationNotesPage__views renderEntityLocationInspectionsPage__views */
    $(`
      <h2>Location Enitities</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Locations</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Location Notes</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationNotesPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Location Inspections</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationInspectionsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>
    `).appendTo($container);

    /* global renderEntityLockersPage__views renderEntityLockerNotesPage__views renderEntityLockerInspectionsPage__views */
    $(`
      <h2>Locker Enitities</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Lockers</h3>

          <div class="list-group">
            <a href="#${renderEntityLockersPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Locker Notes</h3>

          <div class="list-group">
            <a href="#${renderEntityLockerNotesPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Locker Inspections</h3>

          <div class="list-group">
            <a href="#${renderEntityLockerInspectionsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>
    `).appendTo($container);

    $(`
      <h2>Station Enitities</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Stations</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Station Notes</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Station Inspections</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>
    `).appendTo($container);

    $(`
      <h2>Key Fob Enitities</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Key Fobs</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Key Fob Notes</h3>

          <div class="list-group">
            <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>
    `).appendTo($container);

    $(`
    <h2>Customer Enitities</h2>

    <div class="row">
      <div class="col-sm-3">
        <h3>Customers</h3>

        <div class="list-group">
          <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
            <span class="badge badge-locations-all"></span>
            All
          </a>
        </div>
      </div>

      <div class="col-sm-3">
        <h3>Customer Notes</h3>

        <div class="list-group">
          <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
            <span class="badge badge-locations-all"></span>
            All
          </a>
        </div>
      </div>
    </div>
  `).appendTo($container);

  $(`
    <h2>Payment Enitities</h2>

    <div class="row">
      <div class="col-sm-3">
        <h3>Payments</h3>

        <div class="list-group">
          <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
            <span class="badge badge-locations-all"></span>
            All
          </a>
        </div>
      </div>

      <div class="col-sm-3">
        <h3>Payment Notes</h3>

        <div class="list-group">
          <a href="#${renderEntityLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
            <span class="badge badge-locations-all"></span>
            All
          </a>
        </div>
      </div>
    </div>
  `).appendTo($container);



    const $container2 = $('<div></div>');
    $container2.html(`
      <h2>Locations</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Locations Entity</h3>

          <div class="list-group">
            <a href="#entities/locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Location Notes</h3>

          <div class="list-group">
            <a href="#location_notes/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Location Inspections</h3>

          <div class="list-group">
            <a href="#location_inspections/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <h2>Lockers</h2>

      <div class="row">
        <div class="col-sm-3">
          <h3>Lockers</h3>

          <div class="list-group">
            <a href="#lockers/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Locker Notes</h3>

          <div class="list-group">
            <a href="#locker_notes/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Locker Inspections</h3>

          <div class="list-group">
            <a href="#locker_inspections/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <h3>Stations</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Station Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Station Inspections</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <h3>Key Fobs</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Key Fob Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Key Fob Inspections</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <h3>Customers</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Customer Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Customer Notifications</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <h3>Payments</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Payment Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-3">
          <h3>Payment Notifications</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>
    `);
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
