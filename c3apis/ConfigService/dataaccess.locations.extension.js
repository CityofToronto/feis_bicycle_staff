var common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

// function beforeContentParse(content, request, uriInfo, response) { }

// function afterCreate(content, request, uriInfo, response) { }

function afterUpdate(content, request, uriInfo, response) {
  response.setStatusCode(500);
  response.setContent('UPDATE REJECTED');
}

function afterDelete(content, request, uriInfo, response) {
  response.setStatusCode(500);
  response.setContent('DELETE REJECTED');
}
