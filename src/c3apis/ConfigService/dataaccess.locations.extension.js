const common = require('bicycle_parking/common.js');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIFE CYCLE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  setLockersTotal(content, request);
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

  assertLocationNotes(content, request);
  assertLocationInspections(content, request);
  assertLockers(content, request);
  assertCustomers(content, request);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SET PROPERTIES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setLockersTotal(content, request) {
  if (request.getMethod() !== 'POST') {
    return;
  }

  if (content.has('lockers_total')) {
    content.remove('lockers_total');
  }
  content.addProperty('lockers_total', 0);

  if (content.has('occupied')) {
    content.remove('occupied');
  }
  content.addProperty('occupied', 0);

  if (content.has('available')) {
    content.remove('available');
  }
  content.addProperty('available', 0);
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ASSERTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function assertLocationNotes(content, request) {
  const filter = encodeURIComponent(`location eq '${content.get('id').getAsString()}'`);
  const select = 'id';
  const top = '1';

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_NOTES_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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

function assertLocationInspections(content, request) {
  const filter = encodeURIComponent(`location eq '${content.get('id').getAsString()}'`);
  const select = 'id';
  const top = '1';

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_INSPECTIONS_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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

function assertLockers(content, request) {
  const filter = encodeURIComponent(`location eq '${content.get('id').getAsString()}'`);
  const select = 'id';
  const top = '1';

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKERS_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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

function assertCustomers(content, request) {
  const filter = encodeURIComponent(`location eq '${content.get('id').getAsString()}'`);
  const select = 'id';
  const top = '1';

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_CUSTOMERS_URL}?$filter=${filter}&$select=${select}&$top=${top}`
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
