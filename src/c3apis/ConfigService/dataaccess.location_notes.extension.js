////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (content.has('location__site_name')) {
    content.remove('location__site_name');
  }
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATIONS_URL}?$select=id,site_name&$filter=${encodeURIComponent(`id eq '${content.get('location').getAsString()}'`)}`
  }, function okFunction(okResponse) {
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
    const json = JSON.parse(okResponse.body);
    if (json.value && json.value.length > 0) {
      content.addProperty('location__site_name', json.value[0].site_name);
    }
  }, function errorFunction(errorResponse) {
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });


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
}
