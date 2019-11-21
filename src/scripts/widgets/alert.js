/* global $ */
/* global fixButtonLinks */

/* exported renderAlert */
function renderAlert($container, message, {
  bootstrayType = 'success',
  position = 'top'
} = {}) {
  const $alert = $(`
    <div class="alert alert-${bootstrayType} alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      ${message}
    </div>
  `);

  switch (position) {
    case 'top':
      $container.prepend($alert);
      break;

    case 'bottom':
      $container.append($alert);
      break;

    case 'before':
      $container.before($alert);
      break;

    case 'after':
      $container.after($alert);
      break;
  }

  fixButtonLinks($container);
}
