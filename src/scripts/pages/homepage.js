/* global fixButtonLinks query_objectToString */

/* exported renderHomePage */
function renderHomePage($container) {
  $container.html(`
    <div class="row">
      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Registrations</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#registrations?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#registrations?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#registrations?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#registrations" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Customers</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#customers?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#customers?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#customers?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#customers" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Subscriptions</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#subscriptions?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#subscriptions?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#subscriptions?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#subscriptions" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Payments</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#payments?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#payments?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#payments?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#payments" class="list-group-item">All</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Locker Locations</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#locations?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#locations?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#locations?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#locations" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Lockers</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#lockers?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#lockers?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#lockers?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#lockers" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Stations</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#stations?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#stations?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#stations?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#stations" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Station Key Fobs</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#keyfobs?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#keyfobs?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#keyfobs?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#keyfobs" class="list-group-item">All</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Activity Logs</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
          <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
          <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
          <a href="#?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
          <a href="#" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Email Logs</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
            <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
            <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
            <a href="#?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
            <a href="#" class="list-group-item">All</a>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="panel panel-default">
          <div class="panel-heading">Error Logs</div>
          <div class="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque.</p>
          </div>
          <div class="list-group">
          <a href="#?${query_objectToString({ option: 'today' })}" class="list-group-item">Today</a>
          <a href="#?${query_objectToString({ option: 'thisyear' })}" class="list-group-item">This Year</a>
          <a href="#?${query_objectToString({ option: 'lastyear' })}" class="list-group-item">Last Year</a>
          <a href="#" class="list-group-item">All</a>
          </div>
        </div>
      </div>
    </div>
  `);

  fixButtonLinks($container);
}
