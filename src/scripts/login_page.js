/* global $ Backbone */
/* global auth__checkLogin auth__login query__stringToObject */
/* global renderAlert renderForm */

/* exported renderLoginPage */
function renderLoginPage(app, $container, router, auth, query) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (isLoggedIn) {
      const redirect = query__stringToObject(query).redirect || router.defaultFragment;
      router.navigate(redirect, { trigger: true });
      return;
    }

    $container.html('<h2>Login Required</h2>');

    const $row = $(`
        <div class="row">
          <div class="col-sm-8">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus. Proin id lacus non tortor posuere convallis et ut magna. Proin aliquet ultrices mauris. Nunc convallis fringilla nulla, sit amet viverra leo iaculis sed. Donec gravida est ut purus tempor, eget tincidunt mi cursus. Aliquam rutrum hendrerit pulvinar. Sed varius aliquet ante eget suscipit. Vestibulum euismod tortor nisl, eu hendrerit lectus blandit tempus. Aenean mattis elementum metus ut accumsan. Duis non dolor non dolor gravida aliquet. Curabitur tempor tincidunt consectetur. Nulla commodo urna vitae felis egestas feugiat. Mauris ultrices nisl porta, sodales sapien in, sagittis velit.</p>

            <p>Nunc sed facilisis tellus. Nam a mauris eget sapien malesuada feugiat sed ac erat. Sed a vulputate risus. Phasellus in erat a libero aliquet venenatis. Vivamus et nunc sit amet nulla finibus semper. Nulla ultrices est ut est vestibulum euismod. Duis lobortis venenatis efficitur. Quisque molestie sapien tellus, vitae malesuada enim placerat id. Aliquam feugiat nunc at blandit malesuada.</p>

            <p>Fusce vel venenatis augue, id congue felis. Pellentesque posuere iaculis purus, vel lacinia nunc finibus et. Quisque dignissim erat vitae velit convallis ultrices. Maecenas tempus, massa sit amet efficitur pellentesque, nibh tortor blandit tortor, sit amet viverra sem nisi sit amet velit. Morbi ornare augue id nisl ornare vehicula. Sed et ligula sed mauris ornare lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed commodo in ligula ut pellentesque. Donec aliquam cursus felis tempus euismod.</p>
          </div>
        </div>
      `);
    $row.appendTo($container);

    const $formCol = $('<div class="col-sm-4 form"></div>');
    $formCol.appendTo($row);

    const { userId } = auth;
    const model = new Backbone.Model({ user: userId });

    const definition = {
      successCore(data, options = {}) {
        const { $form, formValidator } = options;

        return auth__login(auth, data.user, data.pwd).then((data) => {
          Backbone.history.stop();
          Backbone.history.start();

          return data;
        }, () => {
          setTimeout(() => {
            formValidator.updateStatus('user', 'NOT_VALIDATED');
            formValidator.updateStatus('pwd', 'NOT_VALIDATED');
          }, 100);

          renderAlert(
            $form.find('.panel-body:first'),
            '<strong>Login failed.</strong> Please review your user name and password and try again.',
            { bootstrayType: 'danger' }
          );
        });
      },

      sections: [
        {
          title: 'Login',

          rows: [
            {
              fields: [
                {
                  type: 'html',
                  html: 'Login using your City of Toronto username and password.'
                }
              ]
            },
            {
              fields: [
                {
                  id: 'user',
                  title: 'User Name',
                  required: true,
                  bindTo: 'user'
                }
              ]
            },
            {
              fields: [
                {
                  id: 'pwd',
                  title: 'Password',
                  type: 'password',
                  required: true,
                  bindTo: 'pwd'
                }
              ]
            },
            {
              fields: [
                {
                  title: 'Login',
                  type: 'button',
                  btnClass: 'primary btn-login',

                  onclick: () => {
                    $container.find('.form form').submit();
                  }
                }
              ]
            },
            {
              fields: [
                {
                  type: 'html',
                  html:
                    'Need help logging in? Contact <a href="mailto:itservice@toronto.ca">IT Service Desk</a> or all 416-338-2255.'
                }
              ]
            }
          ]
        }
      ]
    };

    return Promise.resolve().then(() => {
      return renderForm($formCol, definition, model, { saveButtonLabel: null, saveMessage: null });
    }).then(() => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Login', link: '#login' }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle(app.name, { documentTitle: `Login - ${app.name}` });
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
