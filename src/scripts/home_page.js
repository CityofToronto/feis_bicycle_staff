/* global auth__checkLogin fixButtonLinks query__objectToString */

/* exported renderHomePage */
function renderHomePage(app, $container, router, auth) {
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

    /* global locations__views renderLockersPage__views */
    $container.html(`
      <h2>Bicycle Lockers</h2>

      <div class="row">
        <div class="col-md-3">
          <h3>Locations</h3>

          <div class="list-group">
            ${listGroupItem(locations__views)}
          </div>
        </div>

        <div class="col-md-3">
          <h3>Lockers</h3>

          <div class="list-group">
            <a href="#${renderLockersPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${renderLockersPage__views.all.title}
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <h3>Customers</h3>

          <div class="list-group">
            <a href="#${renderLockersPage__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <h3>Payments</h3>

          <div class="list-group">
            <a href="#${locations__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>
      </div>

      <h2>Bicycle Stations</h2>

      <div class="row">
        <div class="col-md-3">
          <h3>Stations</h3>

          <div class="list-group">
            <a href="#${locations__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <h3>Key Fobs</h3>

          <div class="list-group">
            <a href="#${locations__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <h3>Customers</h3>

          <div class="list-group">
            <a href="#${locations__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <h3>Payments</h3>

          <div class="list-group">
            <a href="#${locations__views.all.fragment}?${query__objectToString({ resetState: 'yes' })}" class="list-group-item">
              <span class="badge badge-locations-all"></span>
              ${locations__views.all.title}
            </a>
          </div>
        </div>
      </div>

      <h2>Others</h2>

      <div class="row">
        <div class="col-md-3">
          <h3>Entities</h3>

          <div class="list-group">
            <a href="#entities" class="list-group-item">
              All Entities
            </a>
          </div>
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
