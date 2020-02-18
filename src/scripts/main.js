// The main javascript file for bicycle_staff_2.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth__init query__objectToString Router */
/* global renderLoginButton */

$(function () {

  // Configure App
  const app = new cot_app('Secure Bike Parking', {
    hasContentTop: false,
    hasContentBottom: false,
    hasContentRight: false,
    hasContentLeft: false,
    searchcontext: 'INTRA'
  });
  app.setBreadcrumb([]).render();

  // Configure Set Title
  const $titleContainer = $('#app-header').find('h1').attr('tabindex', '-1');
  let setTitleFocus = false;
  app.setTitle = ((originalSetTitle) => function (title = app.name, options = {}) {
    const {
      documentTitle = title,
      ignoreFocus = false
    } = options;

    originalSetTitle.call(this, title);

    if (documentTitle !== this.name) {
      document.title = `${documentTitle} - ${this.name}`;
    } else {
      document.title = `${this.name}`;
    }

    if (!ignoreFocus && setTitleFocus) {
      $titleContainer.focus();
    } else {
      setTitleFocus = true;
    }
  })(app.setTitle);

  // Configure Auth
  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const auth = auth__init({
    app: 'bicycle_parking',
    checkAccessUrl: '/* @echo C3CONFIG_ISAUTH_URL */',
    url: '/* @echo C3AUTH_URL */',
    webStorageKey: 'bicycle_parking_auth'
  });

  // Configure Router
  const $container = $('#feis_bicycle_staff_container');

  const AppRouter = Router.extend({
    defaultFragment: 'home',

    navigateToLoginPage() {
      const fragment = 'login';
      const query = query__objectToString({
        redirect: Backbone.history.getFragment()
      });
      router.navigate(`${fragment}?${query}`, { trigger: true });
    },

    routes: {
      ['entities/payments/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityPaymentDetailsPage */
        return renderEntityPaymentDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/payments(/:opt)(/)'](opt, query) {
        /* global renderEntityPaymentsPage */
        return renderEntityPaymentsPage(app, $container, router, auth, opt, query);
      },

      // ---
      ['entities/customers/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityCustomerDetailsPage */
        return renderEntityCustomerDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/customers(/:opt)(/)'](opt, query) {
        /* global renderEntityCustomersPage */
        return renderEntityCustomersPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/keyfob_notes/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityKeyfobNoteDetailsPage */
        return renderEntityKeyfobNoteDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/keyfob_notes(/:opt)(/)'](opt, query) {
        /* global renderEntityKeyfobNotesPage */
        return renderEntityKeyfobNotesPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/keyfobs/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityKeyfobDetailsPage */
        return renderEntityKeyfobDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/keyfobs(/:opt)(/)'](opt, query) {
        /* global renderEntityKeyfobsPage */
        return renderEntityKeyfobsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/station_inspections/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityStationInspectionDetailsPage */
        return renderEntityStationInspectionDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/station_inspections(/:opt)(/)'](opt, query) {
        /* global renderEntityStationInspectionsPage */
        return renderEntityStationInspectionsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/station_notes/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityStationNoteDetailsPage */
        return renderEntityStationNoteDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/station_notes(/:opt)(/)'](opt, query) {
        /* global renderEntityStationNotesPage */
        return renderEntityStationNotesPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/stations/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityStationDetailsPage */
        return renderEntityStationDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/stations(/:opt)(/)'](opt, query) {
        /* global renderEntityStationsPage */
        return renderEntityStationsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/locker_inspections/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityLockerInspectionDetailsPage */
        return renderEntityLockerInspectionDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/locker_inspections(/:opt)(/)'](opt, query) {
        /* global renderEntityLockerInspectionsPage */
        return renderEntityLockerInspectionsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/locker_notes/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityLockerNoteDetailsPage */
        return renderEntityLockerNoteDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/locker_notes(/:opt)(/)'](opt, query) {
        /* global renderEntityLockerNotesPage */
        return renderEntityLockerNotesPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/lockers/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityLockerDetailsPage */
        return renderEntityLockerDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/lockers(/:opt)(/)'](opt, query) {
        /* global renderEntityLockersPage */
        return renderEntityLockersPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/location_inspections/:opt/:id(/)'](opt, id, query) {
        /* global renderEntityLocationInspectionDetailsPage */
        return renderEntityLocationInspectionDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/location_inspections(/:opt)(/)'](opt, query) {
        /* global renderEntityLocationInspectionsPage */
        return renderEntityLocationInspectionsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/location_notes/:opt/:id(/)'](opt, id, query) {
        /* global locationNotesEntityDetailsPage */
        return locationNotesEntityDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/location_notes(/:opt)(/)'](opt, query) {
        /* global locationNotesEntityPage */
        return locationNotesEntityPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities/locations/:opt/:id(/)'](opt, id, query) {
        /* global locationsEntityDetailsPage */
        return locationsEntityDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['entities/locations(/:opt)(/)'](opt, query) {
        /* global locationsEntityPage */
        return locationsEntityPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['entities(/)'](query) {
        /* global renderEntitiesPage */
        return renderEntitiesPage(app, $container, router, auth, query);
      },

      // ---

      ['lockers/:opt1/:id1/inspections(/:opt2)(/)'](opt1, id1, opt2, query) {
        /* global renderLockerDetailsInspectionsPage */
        return renderLockerDetailsInspectionsPage(app, $container, router, auth, opt1, id1, opt2, query);
      },
      ['lockers/:opt1/:id1/notes/:opt2/:id2(/)'](opt1, id1, opt2, id2, query) {
        /* global renderLockerDetailsNoteDetailsPage */
        return renderLockerDetailsNoteDetailsPage(app, $container, router, auth, opt1, id1, opt2, id2, query);
      },
      ['lockers/:opt1/:id1/notes(/:opt2)(/)'](opt1, id1, opt2, query) {
        /* global renderLockerDetailsNotesPage */
        return renderLockerDetailsNotesPage(app, $container, router, auth, opt1, id1, opt2, query);
      },
      ['lockers/:opt/:id(/)'](opt, id, query) {
        /* global renderLockerDetailsPage */
        return renderLockerDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['lockers(/:opt)(/)'](opt, query) {
        /* global renderLockersPage */
        return renderLockersPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['locations/:opt1/:id1/inspections(/:opt2)(/)'](opt1, id1, opt2, query) {
        /* global renderLocationDetailsInspectionsPage */
        return renderLocationDetailsInspectionsPage(app, $container, router, auth, opt1, id1, opt2, query);
      },
      ['locations/:opt1/:id1/notes/:opt2/:id2(/)'](opt1, id1, opt2, id2, query) {
        /* global renderLocationDetailsNoteDetailsPage */
        return renderLocationDetailsNoteDetailsPage(app, $container, router, auth, opt1, id1, opt2, id2, query);
      },
      ['locations/:opt1/:id1/notes(/:opt2)(/)'](opt1, id1, opt2, query) {
        /* global renderLocationDetailsNotesPage */
        return renderLocationDetailsNotesPage(app, $container, router, auth, opt1, id1, opt2, query);
      },
      ['locations/:opt/:id(/)'](opt, id, query) {
        /* global locationsDetailsPage */
        return locationsDetailsPage(app, $container, router, auth, opt, id, query);
      },
      ['locations(/:opt)(/)'](opt, query) {
        /* global locationsPage */
        return locationsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['login(/)'](query) {
        /* global renderLoginPage */
        return renderLoginPage(app, $container, router, auth, query);
      },
      ['logout(/)'](query) {
        /* global renderLogoutPage */
        return renderLogoutPage(app, $container, router, auth, query);
      },
      ['home(/)'](query) {
        /* global renderHomePage */
        return renderHomePage(app, $container, router, auth, query);
      },
      '*default': 'routeDefault'
    }
  });

  const router = new AppRouter();
  router.on('route', () => {
    renderLoginButton($loginButtonContainer, auth);
  });

  Promise.resolve().then(() => {
    /* global renderLoadingPage */
    return renderLoadingPage(app, $container, router, auth);
  }).then(() => {
    Backbone.history.start();
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
});
