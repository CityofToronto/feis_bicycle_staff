/* global auth__checkLogin fixButtonLinks query__objectToString */

/* exported renderHomePage */
function renderHomePage(app, $container, router, auth) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    /* global renderLocationsPage__views */
    $container.html(`
      <h2>Lockers</h2>

      <div class="row">
        <div class="col-sm-4">
          <h3>Locker Location</h3>

          <div class="list-group">
            <a href="#${renderLocationsPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              All
            </a>
          </div>
        </div>
      </div>

      <h2>Others</h2>

      <div class="row">
        <div class="col-sm-4">
          <h3>Entities</h3>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

          <p><a href="#entities" class="btn btn-default">View Entities</a></p>
        </div>
      </div>
    `);

    fixButtonLinks($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' }
    ];
    app.setBreadcrumb(breadcrumbs, true);

    app.setTitle(app.name);
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
