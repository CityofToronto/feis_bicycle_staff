// The main javascript file for feis_bicycle_staff.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone moment */
/* global cot_app */
/* global auth__checkLogin auth__init auth__logout functionToValue query__objectToString query__stringToObject
  modal__showConfirm Router */
/* global renderLoginButton */
/* global loadingPage__render */

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

  const auth = auth__init();

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
    const queryObject = query__stringToObject(query);
    if (queryObject.resetState) {
      cbk();

      delete queryObject.resetState;
      query = query__objectToString(queryObject);

      let queryString = query;
      if (queryString) {
        queryString = `?${queryString}`;
      }
      router.navigate(`${fragment}${queryString}`, { trigger: false, replace: true });
    }

    return query;
  }

  function cleanupFunction(model, options = {}) {
    return function () {
      const {
        dataSnapShot,

        unsaveMessage = 'There may be one or more unsaved data. Do you want to continue?',
        unsaveCancelButtonLabel = 'Cancel',
        unsaveConfirmButtonLabel = 'Continue'
      } = options;

      const finalUnsaveMessage = functionToValue(unsaveMessage, model);
      if (dataSnapShot !== JSON.stringify(model.toJSON()) && finalUnsaveMessage) {
        return modal__showConfirm(finalUnsaveMessage, {
          title: 'Confirm',
          cancelButtonLabel: functionToValue(unsaveCancelButtonLabel, model),
          confirmButtonLabel: functionToValue(unsaveConfirmButtonLabel, model)
        });
      }
    };
  }

  //////////////////////////////////////////////////
  // START
  //////////////////////////////////////////////////

  loadingPage__render($pageContainer);

  const AppRouter = Router.extend({
    defaultFragment: DEFAULT_ROUTE_FRAGMENT,

    routes: {
      'locations/:opt/:id(/)/inspections/:opt2/:id2(/)': 'routeLocationInspectionDetails',
      'locations/:opt/:id(/)/inspections(/:opt2)(/)': 'routeLocationInspections',
      'locations/:opt/:id(/)': 'routeLocationDetails',
      'locations(/:opt)(/)': 'routeLocations',

      'lockers/:id(/)': 'routeLockerDetails',
      'lockers(/)': 'routeLockers',

      'customers/:id(/)': 'routeCustomerDetails',
      'customers(/)': 'routeCustomers',

      // ---

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

    /* global homePage__render */
    routeHome(query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        updatePageHeader();

        homePage__render($pageContainer, query, auth);
      });
    },

    /* global loginPage__render */
    routeLogin(query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (isLoggedIn) {
          this.navigate(query__stringToObject(query).redirect || this.defaultFragment, { trigger: true });
          return;
        }

        updatePageHeader('Bicycle Parking', [], { breadcrumbTitle: 'Login', documentTitle: 'Login' });

        loginPage__render($pageContainer, query, auth, () => {
          auth__checkLogin(auth).then((isLoggedIn) => {
            if (isLoggedIn) {
              Backbone.history.stop();
              Backbone.history.start();
            }
          });
        });
      });
    },

    /* global logoutPage__render */
    routeLogout(query) {
      auth__logout(auth);

      updatePageHeader('Bicycle Parking', [], { breadcrumbTitle: 'Logout', documentTitle: 'Logout' });

      logoutPage__render($pageContainer, query);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global locationsPage__defaultOpt locationsPage__render */
    routeLocations(opt, query) {
      if (!opt) {
        this.navigate(`locations/${locationsPage__defaultOpt}`, { trigger: true, replace: true });
        return;
      }

      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        const breadcrumb = [{ name: 'Locker Locations', link: '#locations' }];
        let breadcrumbTitle, documentTitle;
        switch (opt) {
          default:
            breadcrumbTitle = 'All';
            documentTitle = 'All Locker Locations';
        }

        updatePageHeader('Locker Locations', breadcrumb, { breadcrumbTitle, documentTitle });

        locationsPage__render($pageContainer, opt, query, auth);
      });
    },

    /* global locationDetailsPage__fetch locationDetailsPage__render */
    routeLocationDetails(opt, id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        return locationDetailsPage__fetch(id, auth).then((model) => {
          const breadcrumb = [{ name: 'Locker Locations', link: `#locations/${locationInspectionsPage__defaultOpt2}` }];
          switch (opt) {
            default:
              breadcrumb.push({ name: 'All', link: `#locations/${opt}` });
          }

          const cleanupOptions = { dataSnapShot: JSON.stringify(model.toJSON()) };

          if (model.isNew()) {
            updatePageHeader('New Location', breadcrumb);
          } else {
            updatePageHeader(model.escape('site_name'), breadcrumb);
          }

          locationDetailsPage__render($pageContainer, opt, id, query, model, auth, () => {
            cleanupOptions.dataSnapShot = JSON.stringify(model.toJSON());
            this.navigate(`locations/${opt}/${model.id}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('site_name'), breadcrumb);
          });

          return cleanupFunction(model, cleanupOptions);
        });
      });
    },

    /* global locationInspectionsPage__defaultOpt2 locationInspectionsPage__render */
    routeLocationInspections(opt, id, opt2, query) {
      if (!opt2) {
        this.navigate(`locations/${opt}/${id}/inspections/${locationInspectionsPage__defaultOpt2}`, { trigger: true, replace: true });
        return;
      }

      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        locationDetailsPage__fetch(id, auth).then((model) => {
          const breadcrumb = [{ name: 'Locker Locations', link: `#locations/${locationInspectionsPage__defaultOpt2}` }];
          switch (opt) {
            default:
              breadcrumb.push({ name: 'All', link: `#locations/${opt}` });
          }
          breadcrumb.push({ name: model.escape('site_name'), link: `#locations/${opt}/${model.id}` },
            { name: 'Inspections', link: `#locations/${opt}/${model.id}/inspections` });
          let breadcrumbTitle, documentTitle;
          switch (opt2) {
            default:
              breadcrumbTitle = 'All';
              documentTitle = `All Inspections - ${model.escape('site_name')}`;
          }

          updatePageHeader(model.escape('site_name'), breadcrumb, { breadcrumbTitle, documentTitle });

          locationInspectionsPage__render($pageContainer, opt, id, opt2, query, auth);
        });
      });
    },

    /* global locationInspectionDetailsPage__fetch locationInspectionDetailsPage__render */
    routeLocationInspectionDetails(opt, id, opt2, id2, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        return locationDetailsPage__fetch(id, auth).then((model) => {
          return locationInspectionDetailsPage__fetch(id, id2, auth).then((model2) => {
            const breadcrumb = [{ name: 'Locker Locations', link: `#locations/${locationInspectionsPage__defaultOpt2}` }];
            switch (opt) {
              default:
                breadcrumb.push({ name: 'All', link: `#locations/${opt}` });
            }
            breadcrumb.push({ name: model.escape('site_name'), link: `#locations/${opt}/${model.id}` },
              { name: 'Inspections', link: `#locations/${opt}/${model.id}/inspections` });
            switch (opt2) {
              default:
                breadcrumb.push({ name: 'All', link: `#locations/${opt}/${model.id}/${opt2}` });
            }

            const cleanupOptions = { dataSnapShot: JSON.stringify(model2.toJSON()) };

            let breadcrumbTitle, documentTitle;
            if (model.isNew()) {
              breadcrumbTitle = 'New';
              documentTitle = 'New Inspection';
            } else {
              breadcrumbTitle = moment(model2.escape('date')).format('YYYY/MM/DD');
              documentTitle = moment(model2.escape('date')).format('YYYY/MM/DD');
            }

            updatePageHeader(model.escape('site_name'), breadcrumb, { breadcrumbTitle, documentTitle});

            locationInspectionDetailsPage__render($pageContainer, opt, id, opt2, id2, query, model2, auth, () => {
              cleanupOptions.dataSnapShot = JSON.stringify(model2.toJSON());
              this.navigate(`locations/${opt}/${id}/inspections/${model2.id}`, { trigger: false, replace: true });
              updatePageHeader(model.escape('site_name'), breadcrumb);
            });

            return cleanupFunction(model2, cleanupOptions);
          });
        });
      });
    },

    /* global renderLockersPage clearLockersState */
    routeLockers(query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'lockers', query, () => { clearLockersState(); });

        updatePageHeader('Lockers');

        return renderLockersPage($pageContainer, query, auth);
      });
    },

    /* global renderLockerDetailsPage */
    routeLockerDetails(id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
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

    /* global renderCustomersPage clearCustomersState */
    routeCustomers(query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
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
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
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

    /* global renderStationsPage clearStationsState */
    routeStations(query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'stations', query, () => { clearStationsState(); });

        updatePageHeader('Stations');

        return renderStationsPage($pageContainer, query, auth);
      });
    },

    /* global renderStationDetailsPage */
    routeStationDetails(id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
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
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, 'keyfobs', query, () => { clearKeyfobsState(); });

        updatePageHeader('Station Key Fobs');

        return renderKeyfobsPage($pageContainer, query, auth);
      });
    },

    /* global renderKeyfobDetailsPage */
    routeKeyfobDetails(id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
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
