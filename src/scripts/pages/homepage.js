/* global fixButtonLinks */

/* exported renderHomePage */
function renderHomePage($container) {
  $container.html(`
    <div class="row">
      <div class="col-sm-3">
        <h2>Registrations</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#registrations" class="btn btn-default">Open Registrations</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Customers</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#customers" class="btn btn-default">Open Customers</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Subscriptions</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#subscriptions" class="btn btn-default">Open Subscriptions</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Payments</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#payments" class="btn btn-default">Open Payments</a></p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-3">
        <h2>Locker Locations</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#locations" class="btn btn-default">Open Locker Locations</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Lockers</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#lockers" class="btn btn-default">Open Lockers</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Stations</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#stations" class="btn btn-default">Open Stations</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Station Key Fobs</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#keyfobs" class="btn btn-default">Open Station Key Fob</a></p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-3">
        <h2>Activity Logs</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#activitylogs" class="btn btn-default">Open Activity Logs</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Email Logs</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#emaillogs" class="btn btn-default">Open Email Logs</a></p>
      </div>

      <div class="col-sm-3">
        <h2>Settings</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus.</p>
        <p><a href="#settings" class="btn btn-default">Open Settings</a></p>
      </div>
    </div>
  `);

  fixButtonLinks($container);
}
