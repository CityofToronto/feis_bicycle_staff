// The main javascript file for feis_bicycle_staff.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone moment */
/* global cot_app */
/* global auth_checkLogin auth_init auth_logout query_objectToString query_stringToObject Router */
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
      app.setBreadcrumb([{ 'name': app.name, 'link': `#${DEFAULT_ROUTE_FRAGMENT}` }], true);
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

  function handleResetStateQuery(router, fragment, query, cbk = (() => { })) {
    const queryObject = query_stringToObject(query);
    if (queryObject.resetState) {
      cbk();

      delete queryObject.resetState;
      query = query_objectToString(queryObject);

      let queryString = query;
      if (queryString) {
        queryString = `?${queryString}`;
      }
      router.navigate(`${fragment}${queryString}`, { trigger: false, replace: true });
    }

    return query;
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

      'customers/:id(/)': 'routeCustomerDetails',
      'customers(/)': 'routeCustomers',

      // ---

      'locations/:id(/)': 'routeLocationDetails',
      'locations(/)': 'routeLocations',

      'lockers/:id(/)': 'routeLockerDetails',
      'lockers(/)': 'routeLockers',

      'stations/:id(/)': 'routeStationDetails',
      'stations(/)': 'routeStations',

      'keyfobs/:id(/)': 'routeKeyfobDetails',
      'keyfobs(/)': 'routeKeyfobs',

      // ---

      'home(/)': 'routeHome',

      'login(/)': 'routeLogin',
      'logout(/)': 'routeLogout',

      '*default': 'routeDefault'
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global renderHomePage */
    routeHome(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader();

        return renderHomePage($pageContainer, query, auth);
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

        return renderLoginPage($pageContainer, query, auth, () => {
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
    routeLogout(query) {
      auth_logout(auth);

      updatePageHeader('Bicycle Parking', [], { breadcrumbTitle: 'Logout', documentTitle: 'Logout' });

      return renderLogoutPage($pageContainer, query);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global renderRegistrationsPage clearRegistrationsState */
    routeRegistrations(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'registrations', query, () => {
          clearRegistrationsState();
        });

        updatePageHeader('Registrations');

        return renderRegistrationsPage($pageContainer, query, auth);
      });
    },

    /* global renderRegistrationDetailsPage */
    routeRegistrationDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `registrations/${id}`, query);

        const breadcrumb = [{ name: 'Registrations', link: '#locations' }];

        if (id === 'new') {
          updatePageHeader('New Registration', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderRegistrationDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            let finalQuery = '';
            if (query) {
              finalQuery = `?${query}`;
            }

            this.navigate(`registrations/${model.id}${finalQuery}`, { trigger: false, replace: true });

            const momentCreatedOn = moment(model.escape('__CreatedOn'));
            updatePageHeader(`${momentCreatedOn.format('MMMM Do YYYY, hh:mma')} Registration`, breadcrumb, {
              breadcrumbTitle: `${momentCreatedOn.format('YYYY/MM/DD hh:mmA')} Registration`,
              ignoreFocus: true
            });
          }
        });
      });
    },

    /* global renderCustomersPage clearCustomersState */
    routeCustomers(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'customers', query, () => {
          clearCustomersState();
        });

        updatePageHeader('Customers');

        return renderCustomersPage($pageContainer, query, auth);
      });
    },

    /* global renderCustomerDetailsPage */
    routeCustomerDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `customers/${id}`, query);

        const breadcrumb = [{ name: 'Customers', link: '#customers' }];

        if (id === 'new') {
          updatePageHeader('New Customer', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderCustomerDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            let finalQuery = '';
            if (query) {
              finalQuery = `?${query}`;
            }

            this.navigate(`customers/${model.id}${finalQuery}`, { trigger: false, replace: true });
            updatePageHeader([model.escape('first_name'), model.escape('last_name')].filter((val) => val).join(' '), breadcrumb, { ignoreFocus: true });
          }
        });
      });
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global renderLocationsPage clearLocationsState */
    routeLocations(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'locations', query, () => {
          clearLocationsState();
        });

        updatePageHeader('Locker Locations');

        return renderLocationsPage($pageContainer, query, auth);
      });
    },

    /* global renderLocationDetailsPage */
    routeLocationDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `locations/${id}`, query);

        let linkQuery = '';
        if (query) {
          linkQuery = `?${query}`;
        }
        const breadcrumb = [{ name: 'Locker Locations', link: `#locations${linkQuery}` }];

        if (id === 'new') {
          updatePageHeader('New Locker Location', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderLocationDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            this.navigate(`locations/${model.id}${linkQuery}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('site_name'), breadcrumb, { ignoreFocus: true });
          }
        });
      });
    },

    /* global renderLockersPage clearLockersState */
    routeLockers(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'lockers', query, () => { clearLockersState(); });

        updatePageHeader('Lockers');

        return renderLockersPage($pageContainer, query, auth);
      });
    },

    /* global renderLockerDetailsPage */
    routeLockerDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `lockers/${id}`, query);

        let linkQuery = '';
        if (query) {
          linkQuery = `?${query}`;
        }
        const breadcrumb = [{ name: 'Lockers', link: `#lockers${linkQuery}` }];

        if (id === 'new') {
          updatePageHeader('New Locker', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderLockerDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            this.navigate(`lockers/${model.id}${linkQuery}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('number'), breadcrumb, { ignoreFocus: true });
          }
        });
      });
    },

    /* global renderStationsPage clearStationsState */
    routeStations(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'stations', query, () => { clearStationsState(); });

        updatePageHeader('Stations');

        return renderStationsPage($pageContainer, query, auth);
      });
    },

    /* global renderStationDetailsPage */
    routeStationDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `stations/${id}`, query, () => { clearStationsState(); });

        const breadcrumb = [{ name: 'Stations', link: '#stations' }];

        if (id === 'new') {
          updatePageHeader('New Station', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderStationDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            let finalQuery = '';
            if (query) {
              finalQuery = `?${query}`;
            }

            this.navigate(`stations/${model.id}${finalQuery}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('name'), breadcrumb, { ignoreFocus: true });
          }
        });
      });
    },

    /* global renderKeyfobsPage clearKeyfobsState */
    routeKeyfobs(query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'keyfobs', query, () => { clearKeyfobsState(); });

        updatePageHeader('Station Key Fobs');

        return renderKeyfobsPage($pageContainer, query, auth);
      });
    },

    /* global renderKeyfobDetailsPage */
    routeKeyfobDetails(id, query) {
      return auth_checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query_objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `keyfobs/${id}`, query, () => { clearKeyfobsState(); });

        const breadcrumb = [{ name: 'Stations Key Fobs', link: '#keyfobs' }];

        if (id === 'new') {
          updatePageHeader('New Station Key Fobs', breadcrumb, { breadcrumbTitle: 'New' });
        } else {
          updatePageHeader('', breadcrumb);
        }

        return renderKeyfobDetailsPage($pageContainer, id, query, auth, (model) => {
          if (model.id) {
            let finalQuery = '';
            if (query) {
              finalQuery = `?${query}`;
            }

            this.navigate(`keyfobs/${model.id}${finalQuery}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('number'), breadcrumb, { ignoreFocus: true });
          }
        });
      });
    }
  });

  new AppRouter();

  Backbone.history.start();
});
