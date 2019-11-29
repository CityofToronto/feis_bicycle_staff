/* global $ */
/* global deepCloneObject */

/* exported renderForm */
function renderForm($anchor, definition = {}, {
  attachmentPosition = 'bottom'
} = {}) {

  // APPEND $TARGET TO $ANCHOR

  $anchor = $($anchor);

  const $target = $('<div></div>');
  switch (attachmentPosition) {
    case 'before':
      $anchor.before($target);
      break;

    case 'next':
      $anchor.before($target);
      break;

    case 'top':
      $anchor.prepend($target);
      break;

    default:
      $anchor.append($target);
  }

  // TODO: FINALIZE DEFINITION

  definition = deepCloneObject(definition);

  definition.rootPath = definition.rootPath || '/* @echo SRC_PATH *//';
  definition.useBinding = definition.useBinding != null ? definition.useBinding : true;

  // TODO: ADD META SECTION TO DEFINITION

  //////////////////////////////////////////////////////////////////////////////
  // TODO: ADD META SECTION TO DEFINITION

  //////////////////////////////////////////////////////////////////////////////
  // TODO: RENDER COT FORM TO $TARGET

  Promise.resolve()
    .then();

  //////////////////////////////////////////////////////////////////////////////
  // TODO: RETURN CLEANUP FUNCTION
}
