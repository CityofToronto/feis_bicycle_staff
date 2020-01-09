const common = require('bicycle_parking/common.js');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIFE CYCLE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function afterUpdate(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function afterDelete(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  assertStationNotes(content, request);
  assertStationInspections(content, request);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SET PROPERTIES
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ASSERTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function assertStationNotes(content, request) {
  const filter = encodeURIComponent(`station eq '${content.get('id').getAsString()}'`);
  const select = encodeURIComponent('id');
  const top = encodeURIComponent('1');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_STATION_NOTES_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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

function assertStationInspections(content, request) {
  const filter = encodeURIComponent(`station eq '${content.get('id').getAsString()}'`);
  const select = encodeURIComponent('id');
  const top = encodeURIComponent('1');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_STATION_INSPECTIONS_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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
