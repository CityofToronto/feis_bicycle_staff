////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  setStationsSiteName(content, request);
  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  assertKeyfobNotes(content, request);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setStationsSiteName(content, request) {
  if (content.has('stations__site_name')) {
    content.remove('stations__site_name');
  }

  const jsonArray = content.get('stations').getAsJsonArray();
  const jsonArraySize = jsonArray.size();

  let filters = [];
  for (let index = 0; index < jsonArraySize; index++) {
    filters.push(`id eq '${jsonArray.get(index).getAsString()}'`);
  }

  const filter = encodeURIComponent(filters.join(' or '));
  const select = encodeURIComponent('site_name');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_STATIONS_URL}?$select=${select}&$filter=${filter}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    const site_name = body.value.map(({ site_name }) => site_name).sort().join(', ');
    content.addProperty('stations__site_name', site_name);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

function setStatus(content, request) {
  if (request.getMethod() !== 'POST') {
    return;
  }

  if (content.has('__Status')) {
    content.remove('__Status');
  }

  content.addProperty('__Status', 'Active');
}

function assertKeyfobNotes(content, request) {
  const filter = encodeURIComponent(`keyfob eq '${content.get('id').getAsString()}'`);
  const select = encodeURIComponent('id');
  const top = encodeURIComponent('1');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_KEYFOB_NOTES_URL}?$filter=${filter}&$select=${select}&$top=${top}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    if (body.value && body.value.length > 0) {
      throw 'This entity cannot be deleted.';
    }

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
    }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}
