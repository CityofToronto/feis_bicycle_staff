// The main javascript file for feis_bicycle_staff.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth_init auth_checkLogin auth_logout query_objectToString query_stringToObject Router */
/* global renderLoginButton */
/* global renderLoadingPage */

$(function () {
  const app = new cot_app('Bicycle Parking', {
    hasContentTop: false,
    hasContentBottom: false,
    hasContentRight: false,
    hasContentLeft: false,
    searchcontext: 'INTRA'
  });
  app.setBreadcrumb([], true).render();

  //////////////////////////////////////////////////
  // CONSTANTS, VARIABLES AND FUNCTIONS
  //////////////////////////////////////////////////

  const DEFAULT_ROUTE_FRAGMENT = 'home';

  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const $pageTitleContainer = $('#app-header').find('h1').attr('tabindex', '-1');
  const $pageContainer = $('#feis_bicycle_staff_container');

  const auth = auth_init();

  let setPageHeaderFocus = false;
  function updatePageHeader(title, breadcrumb = [], options = {}) {
    const {
      breadcrumbTitle = title,
      documentTitle = title,
      ignoreFocus = false
    } = options;

    renderLoginButton($loginButtonContainer, auth);

    if (!title) {
      document.title = app.name;

      app.setTitle(app.name);
      app.setBreadcrumb([
        { 'name': app.name, 'link': `#${DEFAULT_ROUTE_FRAGMENT}` }
      ], true);
    } else {
      document.title = `${documentTitle} - ${app.name}`;

      app.setTitle(title);
      app.setBreadcrumb([
        { 'name': 'Bicycle Parking', 'link': `#${DEFAULT_ROUTE_FRAGMENT}` },
        ...breadcrumb,
        { 'name': breadcrumbTitle }
      ], true);
    }

    if (!ignoreFocus && setPageHeaderFocus) {
      $pageTitleContainer.focus();
    } else {
      setPageHeaderFocus = true;
    }
  }

  //////////////////////////////////////////////////
  // START
  //////////////////////////////////////////////////

  renderLoadingPage($pageContainer);

  const AppRouter = Router.extend({
    defaultFragment: DEFAULT_ROUTE_FRAGMENT,

    routes: {
      'registrations/:id(/)': 'routeRegistrationDetails',
      'registrations(/)': 'routeRegistrations',

      'customers/:id(/)': 'routeRegistrationDetails',
      'customers(/)': 'routeRegistrations',

      'subscriptions/:id(/)': 'routeRegistrationDetails',
      'subscriptions(/)': 'routeRegistrations',

      'payments/:id(/)': 'routeRegistrationDetails',
      'payments(/)': 'routeRegistrations',

      // ---

      'locations/:id(/)': 'routeLocationDetails',
      'locations(/)': 'routeLocations',

      'lockers/:id(/)': 'routeLockerDetails',
      'lockers(/)': 'routeLockers',

      'stations/:id(/)': 'routeRegistrationDetails',
      'stations(/)': 'routeRegistrations',

      'keyfobs/:id(/)': 'routeRegistrationDetails',
      'keyfobs(/)': 'routeRegistrations',

      // ---

      'activitylogs/:id(/)': 'routeRegistrationDetails',
      'activitylogs(/)': 'routeRegistrations',

      'emaillogs/:id(/)': 'routeRegistrationDetails',
      'emaillogs(/)': 'routeRegistrations',

      'settings/:id(/)': 'routeRegistrationDetails',
      'settings(/)': 'routeRegistrations',

      // ---

      'home(/)': 'routeHome',

      'login(/)': 'routeLogin',
      'logout(/)': 'routeLogout',

      '*default': 'routeDefault'
    },

    //////////////////////////////////////////////////
    // ROUTE HOME PAGE + LOGIN PAGE + LOGOUT PAGE
    //////////////////////////////////////////////////

    /* global renderHomePage */
    routeHome() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader();

        return renderHomePage($pageContainer);
      });
    },

    /* global renderLoginPage */
    routeLogin(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (isLoggedIn) {
          this.navigate(query_stringToObject(query).redirect || this.defaultFragment, { trigger: true });
          return;
        }

        updatePageHeader('Bicycle Parking', [], { breadcrumbTitle: 'Login', documentTitle: 'Login' });

        return renderLoginPage($pageContainer, auth, () => {
          auth_checkLogin(auth).then((isLoggedIn) => {
            if (isLoggedIn) {
              Backbone.history.stop();
              Backbone.history.start();
            }
          });
        });
      });
    },

    /* global renderLogoutPage */
    routeLogout() {
      auth_logout(auth);

      updatePageHeader('Bicycle Parking', [], { breadcrumbTitle: 'Logout', documentTitle: 'Logout' });

      return renderLogoutPage($pageContainer);
    },

    //////////////////////////////////////////////////
    // ROUTE REGISTRATIONS PAGE
    //////////////////////////////////////////////////

    /* global renderRegistrationsPage */
    routeRegistrations() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Registrations');

        return renderRegistrationsPage($pageContainer, auth);
      });
    },

    /* global renderRegistrationDetailsPage */
    routeRegistrationDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        if (id === 'new') {
          id = null;
          updatePageHeader('New Registration', [{ name: 'Registrations', link: '#registrations' }], { breadcrumbTitle: 'New', documentTitle: 'New' });
        } else {
          updatePageHeader(id, [{ name: 'Registrations', link: '#registrations' }]);
        }

        return renderRegistrationDetailsPage($pageContainer, auth, id, (data) => {
          if (data.id) {
            this.navigate(`registrations/${data.id}`, { trigger: false, replace: true });
            updatePageHeader(data.id, [{ name: 'Registrations', link: '#registrations' }]);
          }
        });
      });
    },

    //////////////////////////////////////////////////
    // ROUTE LOCATIONS PAGE
    //////////////////////////////////////////////////

    /* global renderLocationsPage */
    routeLocations() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Locker Locations');

        return renderLocationsPage($pageContainer, auth);
      });
    },

    /* global renderLocationDetailsPage */
    routeLocationDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        const breadcrumb = [{ name: 'Locker Locations', link: '#locations' }];

        if (id === 'new') {
          id = null;
          updatePageHeader('New Locker Location', breadcrumb,  { breadcrumbTitle: 'New' });
        }

        return renderLocationDetailsPage($pageContainer, auth, id, (data) => {
          if (data.id) {
            this.navigate(`locations/${data.id}`, { trigger: false, replace: true });
            updatePageHeader(data.name, breadcrumb);
          }
        });
      });
    },

    /* global renderLockersPage */
    routeLockers() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Lockers');

        return renderLockersPage($pageContainer, auth);
      });
    },

    /* global renderLockerDetailsPage */
    routeLockerDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        const breadcrumb = [{ name: 'Locker', link: '#lockers' }];

        if (id === 'new') {
          id = null;
          updatePageHeader('New Locker', breadcrumb,  { breadcrumbTitle: 'New' });
        }

        return renderLockerDetailsPage($pageContainer, auth, id, (data) => {
          this.navigate(`lockers/${data.id}`, { trigger: false, replace: true });
          updatePageHeader(data.id, breadcrumb);
        });
      });
    },

    /* global renderStationsPage */
    routeStations() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Stations');

        return renderStationsPage($pageContainer, auth);
      });
    },

    /* global renderStationDetailsPage */
    routeStationDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        if (id === 'new') {
          id = null;
        }

        if (id) {
          updatePageHeader(id, [{ name: 'Stations', link: '#stations' }]);
        } else {
          updatePageHeader('New Station', [{ name: 'Stations', link: '#stations' }]);
        }

        return renderStationDetailsPage($pageContainer, auth, id, (data) => {
          this.navigate(`stations/${data.id}`, { trigger: false, replace: true });
          updatePageHeader(data.id, [{ name: 'Stations', link: '#stations' }]);
        });
      });
    },

    /* global renderKeyfobsPage */
    routeKeyfobs() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Key Fobs');

        return renderKeyfobsPage($pageContainer, auth);
      });
    },

    /* global renderKeyfobDetailsPage */
    routeKeyfobDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        if (id === 'new') {
          id = null;
        }

        if (id) {
          updatePageHeader(id, [{ name: 'Key Fobs', link: '#keyfobs' }]);
        } else {
          updatePageHeader('New Key Fob', [{ name: 'Key Fobs', link: '#keyfobs' }]);
        }

        return renderKeyfobDetailsPage($pageContainer, auth, id, (data) => {
          this.navigate(`keyfobs/${data.id}`, { trigger: false, replace: true });
          updatePageHeader(data.id, [{ name: 'Key Fobs', link: '#keyfobs' }]);
        });
      });
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global renderSettingsPage */
    routeSettings() {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader('Settings');

        return renderSettingsPage($pageContainer, auth);
      });
    },

    /* global renderSettingDetailsPage */
    routeSettingDetails(id) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        if (id === 'new') {
          id = null;
        }

        if (id) {
          updatePageHeader(id, [{ name: 'Settings', link: '#settings' }]);
        } else {
          updatePageHeader('New Setting', [{ name: 'Settings', link: '#settings' }]);
        }

        return renderSettingDetailsPage($pageContainer, auth, id, (data) => {
          this.navigate(`settings/${data.id}`, { trigger: false, replace: true });
          updatePageHeader(data.id, [{ name: 'Settings', link: '#settings' }]);
        });
      });
    }
  });

  new AppRouter();

  Backbone.history.start();
});
