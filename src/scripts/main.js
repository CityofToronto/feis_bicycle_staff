// The main javascript file for bicycle_staff_2.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth__init query__objectToString Router */
/* global renderLoginButton */

$(function () {
  const app = new cot_app('Bicycle Parking', {
    hasContentTop: false,
    hasContentBottom: false,
    hasContentRight: false,
    hasContentLeft: false,
    searchcontext: 'INTRA'
  });
  app.setBreadcrumb([]).render();

  // ---

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

  // ---

  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const auth = auth__init({
    app: 'bicycle_parking',
    checkAccessUrl: '/* @echo C3CONFIG_ISAUTH_URL */',
    url: '/* @echo C3AUTH_URL */',
    webStorageKey: 'bicycle_parking_auth'
  });

  // ---

  const $container = $('#feis_bicycle_staff_container');
  const AppRouter = Router.extend({
    defaultFragment: 'home',

    navigateToLoginPage() {
      const query = query__objectToString({
        redirect: Backbone.history.getFragment()
      });
      router.navigate(`login?${query}`, { trigger: true });
    },

    routes: {
      ['location_inspections/:opt/:id(/)'](opt, id, query) {
        /* global renderLocationInspectionDetailsPage */
        return renderLocationInspectionDetailsPage(app, $container, router, auth, opt, id, query);
      },

      ['location_inspections(/:opt)(/)'](opt, query) {
        /* global renderLocationInspectionsPage */
        return renderLocationInspectionsPage(app, $container, router, auth, opt, query);
      },

      // ---

      ['location_notes/:opt/:id(/)'](opt, id, query) {
        /* global renderLocationNoteDetailsPage */
        return renderLocationNoteDetailsPage(app, $container, router, auth, opt, id, query);
      },

      ['location_notes(/:opt)(/)'](opt, query) {
        /* global renderLocationNotesPage */
        return renderLocationNotesPage(app, $container, router, auth, opt, query);
      },

      // ---

      // ['locations/:opt/:id/inspections/:opt2/:id2(/)'](opt, id, opt2, id2, query) { // eslint-disable-line no-unused-vars
      // return renderLocationDetailsNotesPage(app, $container, router, auth, opt, id, opt2, query);
      // },

      // ['locations/:opt/:id/inspections(/:opt2)(/)'](opt, id, opt2, query) { // eslint-disable-line no-unused-vars
      // return renderLocationDetailsNotesPage(app, $container, router, auth, opt, id, opt2, query);
      // },

      ['locations/:opt/:id/notes/:opt2/:id2(/)'](opt, id, opt2, id2, query) { // eslint-disable-line no-unused-vars
        /* global renderLocationDetailsNoteDetailsPage */
        return renderLocationDetailsNoteDetailsPage(app, $container, router, auth, opt, id, opt2, id2, query);
      },

      ['locations/:opt/:id/notes(/:opt2)(/)'](opt, id, opt2, query) {
        /* global renderLocationDetailsNotesPage */
        return renderLocationDetailsNotesPage(app, $container, router, auth, opt, id, opt2, query);
      },

      ['locations/:opt/:id(/)'](opt, id, query) {
        /* global renderLocationDetailsPage */
        return renderLocationDetailsPage(app, $container, router, auth, opt, id, query);
      },

      ['locations(/:opt)(/)'](opt, query) {
        /* global renderLocationsPage */
        return renderLocationsPage(app, $container, router, auth, opt, query);
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

  // ---

  Promise.resolve().then(() => {
    /* global renderLoadingPage */
    return renderLoadingPage(app, $container, router, auth);
  }).then(() => {
    Backbone.history.start();
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
});
