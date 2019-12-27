// The main javascript file for bicycle_staff_2.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth__init Router */
/* global renderLoginButton */

$(function () {

  // Using CoT App to finalize the c-frame
  const app = new cot_app('Bicycle Parking', {
    hasContentTop: false,
    hasContentBottom: false,
    hasContentRight: false,
    hasContentLeft: false,
    searchcontext: 'INTRA'
  });
  app.setBreadcrumb([]).render();

  // Enhance setTitle method to include document title and focus
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

  // Add login related reference for login button and authentications
  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const auth = auth__init({
    app: 'bicycle_parking',
    checkAccessUrl: '/* @echo C3CONFIG_ISAUTH_URL */',
    url: '/* @echo C3AUTH_URL */',
    webStorageKey: 'bicycle_parking_auth'
  });

  // Add routing for page rendering based on url hash values
  const $container = $('#feis_bicycle_staff_container');
  const AppRouter = Router.extend({
    defaultFragment: 'home',

    routes: {
      /* global renderLocationInspectionDetailsPage */
      ['location_inspections/:opt/:id(/)'](opt, id, query) {
        return renderLocationInspectionDetailsPage(app, $container, router, auth, opt, id, query);
      },

      /* global renderLocationInspectionsPage */
      ['location_inspections(/:opt)(/)'](opt, query) {
        return renderLocationInspectionsPage(app, $container, router, auth, opt, query);
      },

      // ---

      /* global renderLocationNoteDetailsPage */
      ['location_notes/:opt/:id(/)'](opt, id, query) {
        return renderLocationNoteDetailsPage(app, $container, router, auth, opt, id, query);
      },

      /* global renderLocationNotesPage */
      ['location_notes(/:opt)(/)'](opt, query) {
        return renderLocationNotesPage(app, $container, router, auth, opt, query);
      },

      // ---

      /* global renderLocationDetailsPage */
      ['locations/:opt/:id(/)'](opt, id, query) {
        return renderLocationDetailsPage(app, $container, router, auth, opt, id, query);
      },

      /* global renderLocationsPage */
      ['locations(/:opt)(/)'](opt, query) {
        return renderLocationsPage(app, $container, router, auth, opt, query);
      },

      // ---

      /* global renderLoginPage */
      ['login(/)'](query) {
        return renderLoginPage(app, $container, router, auth, query);
      },

      /* global renderLogoutPage */
      ['logout(/)'](query) {
        return renderLogoutPage(app, $container, router, auth, query);
      },

      /* global renderHomePage */
      ['home(/)'](query) {
        return renderHomePage(app, $container, router, auth, query);
      },

      '*default': 'routeDefault'
    }
  });

  const router = new AppRouter();
  router.on('route', () => {
    renderLoginButton($loginButtonContainer, auth);
  });

  // Load initial "loading" page then start routing
  Promise.resolve()
    .then(() => {
      /* global renderLoadingPage */
      return renderLoadingPage(app, $container, router, auth);
    })
    .then(() => {
      Backbone.history.start();
    });
});
