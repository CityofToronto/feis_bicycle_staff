// The main javascript file for feis_bicycle_staff.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global
  $ Backbone moment
  cot_app
  ajaxes auth__checkLogin auth__init auth__logout query__objectToString query__stringToObject modal__showLogin Router
  renderLoginButton
  loadingPage__render
 */

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

  //////////////////////////////////////////////////
  // START
  //////////////////////////////////////////////////

  loadingPage__render($pageContainer);

  const AppRouter = Router.extend({
    defaultFragment: DEFAULT_ROUTE_FRAGMENT,

    routes: {
      // 'locations/:location/inspections/:id(/)': 'routeLocationInspectionDetails',
      // 'locations/:location/inspections(/)': 'routeLocationInspections',
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

        return homePage__render($pageContainer, query, auth);
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

        return loginPage__render($pageContainer, query, auth, () => {
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

      return logoutPage__render($pageContainer, query);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* global locationsPage__render */
    routeLocations(opt, query) {
      if (!opt) {
        this.navigate('locations/all', { trigger: true, replace: true });
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

        return locationsPage__render($pageContainer, opt, query, auth);
      });
    },

    /* global locationDetailsPage_render */
    routeLocationDetails(opt, id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        const breadcrumb = [{ name: 'Locker Locations', link: '#locations' }];
        switch (opt) {
          default:
            breadcrumb.push({ name: 'All', link: `#locations/all` });
        }

        return locationDetailsPage_render($pageContainer, opt, id, query, auth, (dataSnapShot, model) => {
          if (model.id) {
            this.navigate(`locations/${opt}/${model.id}`, { trigger: false, replace: true });
            updatePageHeader(model.escape('site_name'), breadcrumb);
          } else {
            updatePageHeader('New Locker Location', breadcrumb, { breadcrumbTitle: 'New' });
          }
        });
      });
    },

    /* global renderLocationInspectionsPage clearLocationInspectionsState */
    routeLocationInspections(location, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `locations/${location}/inspections`, query, () => {
          clearLocationInspectionsState();
        });

        const doDownload = () => {
          // $.ajax(`/* @echo C3DATA_LOCATIONS */('${location}')?$select=site_name`, {
          ajaxes(`/* @echo C3DATA_LOCATIONS */('${location}')?$select=site_name`, {
            dataType: 'json',
            methd: 'GET',
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            }
          }).then(({data}) => {
            const { locations, inspections, lockers } = query__stringToObject(query);
            updatePageHeader(data.site_name, [
              { name: 'Locker Locations', link: `#locations?${query__objectToString({ locations })}` },
              { name: data.site_name, link: `#locations/${location}?${query__objectToString({ locations, inspections, lockers })}` }
            ], {
              breadcrumbTitle: 'Inspections',
              documentTitle: `Inspections - ${data.site_name}`
            });
          }, () => {
            if (auth) {
              auth__checkLogin(auth, true).then((isLoggedIn) => {
                if (!isLoggedIn) {
                  modal__showLogin(auth).then((isLoggedIn) => {
                    if (isLoggedIn) {
                      doDownload();
                    }
                  });
                }
              });
            }
          });
        };
        doDownload();

        return renderLocationInspectionsPage($pageContainer, location, query, auth);
      });
    },

    /* global renderLocationInspectionDetailsPage */
    routeLocationInspectionDetails(location, id, query) {
      return auth__checkLogin(auth).then((isLoggedIn) => {
        if (!isLoggedIn) {
          this.navigate(`login?${query__objectToString({ redirect: Backbone.history.getFragment() })}`, { trigger: true });
          return;
        }

        query = handleResetStateQuery(this, `locations/${location}/inspections/${id}`, query);

        const { locations, inspections, lockers } = query__stringToObject(query);

        const doDownload = ({ breadcrumbTitle, documentTitle } = {}) => {
          // $.ajax(`/* @echo C3DATA_LOCATIONS */('${location}')?$select=site_name`, {
          ajaxes(`/* @echo C3DATA_LOCATIONS */('${location}')?$select=site_name`, {
            dataType: 'json',
            methd: 'GET',
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            }
          }).then((data) => {
            updatePageHeader(data.site_name, [
              { name: 'Locker Locations', link: `#locations?${query__objectToString({ locations })}` },
              { name: data.site_name, link: `#locations/${location}?${query__objectToString({ locations, inspections, lockers })}` },
              { name: 'Inspections', link: `#locations/${location}/inspections?${query__objectToString({ locations, inspections, lockers })}` }
            ], {
              breadcrumbTitle: breadcrumbTitle || 'New',
              documentTitle: `${documentTitle || 'New Inspections'} - ${data.site_name}`
            });
          }, () => {
            if (auth) {
              auth__checkLogin(auth, true).then((isLoggedIn) => {
                if (!isLoggedIn) {
                  modal__showLogin(auth).then((isLoggedIn) => {
                    if (isLoggedIn) {
                      doDownload();
                    }
                  });
                }
              });
            }
          });
        };

        if (id === 'new') {
          doDownload();
        }

        return renderLocationInspectionDetailsPage($pageContainer, location, id, query, auth, (model) => {
          if (model.id) {
            this.navigate(`locations/${location}/inspections/${model.id}?${query__objectToString({ locations, inspections, lockers })}`, { trigger: false, replace: true });
            const inspectionDate = moment(model.get('date')).format('YY/MM/DD');
            doDownload({ breadcrumbTitle: inspectionDate, documentTitle: `${inspectionDate} Inspection` });
          }
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
