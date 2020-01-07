////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  setStatus(content, request);
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setStatus(content, request) {
  if (request.getMethod() !== 'POST') {
    return;
  }

  if (content.has('__Status')) {
    content.remove('__Status');
  }

  content.addProperty('__Status', 'Active');
}
