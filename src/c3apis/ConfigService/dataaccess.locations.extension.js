////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (request.getMethod() === 'POST') {
    if (content.has('__Status')) {
      content.remove('__Status');
    }

    content.addProperty('__Status', 'Active');
  }
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  const select = encodeURIComponent('id');
  const filter = encodeURIComponent(`location eq '${content.get('id').getAsString()}'`);
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_NOTES_URL}?$select=${select}&$filter=${filter}&$top=1`
  }, function okFunction(okResponse) {
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
    const json = JSON.parse(okResponse.body);
    if (json.value && json.value.length > 0) {
      throw 'This entity cannot be deleted.';
    }
  }, function errorFunction(errorResponse) {
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}
