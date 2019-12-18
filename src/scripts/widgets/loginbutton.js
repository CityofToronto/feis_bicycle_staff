/* global Backbone */
/* global fixButtonLinks query__objectToString */

/* exported renderLoginButton */
function renderLoginButton($container, auth) {
  const fragment = Backbone.history.getFragment();
  const [fragmentBase, query] = fragment.split('?');

  if (fragmentBase === 'login') {
    $container.empty();
  } else if (fragmentBase === 'logout') {
    $container.html(`<a class="btn btn-default" href="#login?${query || ''}">Login</a>`);
  } else {
    const query = query__objectToString({ redirect: fragment });
    if (auth.sId) {
      $container.html(`<a class="btn btn-default" href="#logout?${query || ''}">Logout: <strong>${auth.userId}</strong></a>`);
    } else {
      $container.html(`<a class="btn btn-default" href="#login?${query || ''}">Login</a>`);
    }
  }

  fixButtonLinks($container);
}
