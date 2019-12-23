/* global Backbone */
/* global auth__checkLogin fixButtonLinks query__objectToString */

/* exported renderHomePage */
function renderHomePage(app, $container, router, auth) {

  // Login is required
  return auth__checkLogin(auth).then((isLoggedIn) => {

    // Redirect to the login page
    if (!isLoggedIn) {
      const query = query__objectToString({ redirect: Backbone.history.getFragment() });
      router.navigate(`login?${query}`, { trigger: true });
      return;
    }

    // Render content
    $container.html(`
      <h2>Entities</h2>

      <div class="row">
        <div class="col-sm-4">
          <h3>Locations</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Location Notes</h3>

          <div class="list-group">
            <a href="#location_notes/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Location Inspections</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-4">
          <h3>Lockers</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Locker Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Locker Inspections</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-4">
          <h3>Stations</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Station Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
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
        <div class="col-sm-4">
          <h3>Key Fobs</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Key Fob Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
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
        <div class="col-sm-4">
          <h3>Customers</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Customer Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
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
        <div class="col-sm-4">
          <h3>Payments</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
          <h3>Payment Notes</h3>

          <div class="list-group">
            <a href="#locations/all?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>

        <div class="col-sm-4">
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

    fixButtonLinks($container)

    // Set title and breadcrumb
    app.setBreadcrumb([{ name: app.name }], true);
    app.setTitle(app.name);
  });
}
