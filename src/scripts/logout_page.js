/* global auth__logout */

/* exported renderLogoutPage */
function renderLogoutPage(app, $container, router, auth) {
  return auth__logout(auth).then(() => {
    $container.html(`
      <h2>You Have Successfully Logged Out</h2>

      <div class="row">
        <div class="col-md-10">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet efficitur neque. Sed finibus placerat metus, a sagittis lectus. Proin id lacus non tortor posuere convallis et ut magna. Proin aliquet ultrices mauris. Nunc convallis fringilla nulla, sit amet viverra leo iaculis sed. Donec gravida est ut purus tempor, eget tincidunt mi cursus. Aliquam rutrum hendrerit pulvinar. Sed varius aliquet ante eget suscipit. Vestibulum euismod tortor nisl, eu hendrerit lectus blandit tempus. Aenean mattis elementum metus ut accumsan. Duis non dolor non dolor gravida aliquet. Curabitur tempor tincidunt consectetur. Nulla commodo urna vitae felis egestas feugiat. Mauris ultrices nisl porta, sodales sapien in, sagittis velit.</p>

          <p>Nunc sed facilisis tellus. Nam a mauris eget sapien malesuada feugiat sed ac erat. Sed a vulputate risus. Phasellus in erat a libero aliquet venenatis. Vivamus et nunc sit amet nulla finibus semper. Nulla ultrices est ut est vestibulum euismod. Duis lobortis venenatis efficitur. Quisque molestie sapien tellus, vitae malesuada enim placerat id. Aliquam feugiat nunc at blandit malesuada.</p>

          <p>Fusce vel venenatis augue, id congue felis. Pellentesque posuere iaculis purus, vel lacinia nunc finibus et. Quisque dignissim erat vitae velit convallis ultrices. Maecenas tempus, massa sit amet efficitur pellentesque, nibh tortor blandit tortor, sit amet viverra sem nisi sit amet velit. Morbi ornare augue id nisl ornare vehicula. Sed et ligula sed mauris ornare lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed commodo in ligula ut pellentesque. Donec aliquam cursus felis tempus euismod.</p>
        </div>
      </div>
    `);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Logout', link: '#logout' }
    ];
    app.setBreadcrumb(breadcrumbs, true);

    app.setTitle(app.name, { documentTitle: `Logout - ${app.name}` });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
