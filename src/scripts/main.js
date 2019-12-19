// The main javascript file for bicycle_staff_2.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth__init Router */
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

  // Enhance setTitle method
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

  // Add login and login related stuff
  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const auth = auth__init({
    app: 'bicycle_parking',
    checkAccessUrl: '/* @echo C3CONFIG_ISAUTH_URL */',
    url: '/* @echo C3AUTH_URL */',
    webStorageKey: 'bicycle_parking_auth'
  });

  // App routing
  const $container = $('#feis_bicycle_staff_container');
  const AppRouter = Router.extend({
    defaultFragment: 'home',

    routes: {

      /* global renderLoginPage */
      ['login(/)'](query) {
        console.log(query);
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


  Promise.resolve()
    /* global renderLoadingPage */
    .then(() => {
      return renderLoadingPage(app, $container, router, auth);
    })
    .then(() => {
      Backbone.history.start();
    });
});
