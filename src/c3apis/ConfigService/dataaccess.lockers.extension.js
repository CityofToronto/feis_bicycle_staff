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

  cleanupLocation(content, request);

  setLocationSiteName(content, request);

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocation(content, request);
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocation(content, request);
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocation(content, request);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setLocationSiteName(content, request) {
  if (content.has('location__site_name')) {
    content.remove('location__site_name');
  }

  const select = encodeURIComponent('site_name');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATIONS_URL}('${content.get('location').getAsString()}')?$select=${select}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    content.addProperty('location__site_name', body.site_name);

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

function getPreviousVersion(content, request) {
  if (request.getMethod() !== 'PUT') {
    return null;
  }

  let returnValue;

  const select = encodeURIComponent('location,__Status');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKERS_URL}('${content.get('id').getAsString()}')?$select=${select}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    returnValue = {
      location: body.location,
      __Status: body.__Status
    };

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  return returnValue;
}

function cleanupLocation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const previousVersion = getPreviousVersion(content, request);

  if (previousVersion.location !== content.get('location').getAsString()) {
    updateLocation(content, request, { location: previousVersion.location, __Status: 'Inactive' });
  }
}

function updateLocation(content, request, {
  location = content.get('location').getAsString(),
  __Status: status = content.get('__Status').getAsString()
} = {}) {
  const select = encodeURIComponent('id');
  const filter = encodeURIComponent(`location eq '${location}' and __Status eq 'Active'`);
  const top = encodeURIComponent('999');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKERS_URL}?$select=${select}&$filter=${filter}&$top=${top}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    let lockers_total = body.value.length;

    const method = request.getMethod();
    if (method === 'DELETE') {
      lockers_total--;
    } else if (method === 'POST') {
      lockers_total++;
    } else if (method === 'PUT') {
      const previousVersion = getPreviousVersion(content, request);
      if (previousVersion.location !== location ) {
        lockers_total++;
      }
      if (previousVersion.__Status !== status ) {
        if (status === 'Active') {
          lockers_total++;
        } else {
          lockers_total--;
        }
      }
    }

    const data = {
      lockers_total
    };

    ajax.request({
      data: JSON.stringify(data),
      headers: {
        Authorization: request.getHeader('Authorization'),
        'Content-Type': 'application/json; charset=UTF-8',
        'X-HTTP-Method-Override': 'PATCH'
      },
      method: 'POST',
      uri: `${common.DA_LOCATIONS_URL}('${location}')`

    }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
      // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
    }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
      // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
    });

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}
