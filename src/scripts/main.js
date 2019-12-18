// The main javascript file for bicycle_staff_2.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

/* global $ Backbone */
/* global cot_app */
/* global auth__init */
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

  // Add login and login button
  const $loginButtonContainer = $('<div class="loginButtonContainer">').appendTo('.securesite');
  const auth = auth__init({
    app: 'bicycle_parking',
    checkAccessUrl: '/* @echo C3CONFIG_ISAUTH_URL */',
    url: '/* @echo C3AUTH_URL */',
    webStorageKey: 'bicycle_parking_auth'
  });
  Backbone.history.start();
  renderLoginButton($loginButtonContainer, auth);
});
