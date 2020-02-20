const common = require('bicycle_parking/common.js');

let previousVersion;

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

  previousVersion = getPreviousVersion(content, request);

  cleanupLocker(content, request);
  cleanupLocation(content, request);
  cleanupKeyfob(content, request);
  cleanupStation(content, request);

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
  updateLocation(content, request);
  updateKeyfob(content, request);
  updateStation(content, request);
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
  updateLocation(content, request);
  updateKeyfob(content, request);
  updateStation(content, request);
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  // Assert payment

  updateLocker(content, request);
  updateLocation(content, request);
  updateKeyfob(content, request);
  updateStation(content, request);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPreviousVersion(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  let returnValue;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_CUSTOMERS_URL}('${content.get('id').getAsString()}')`
  }, function okFunction(okResponse) {
    returnValue = JSON.parse(okResponse.body);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  return returnValue;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SET PROPERTY
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
// UPDATE ENTITIES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupLocker(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const locker = content.has('locker') && content.get('locker') != null && !content.get('locker').isJsonNull()
    ? content.get('locker').getAsString() : null;

  if (previousVersion.locker !== locker) {
    updateLocker(content, request, { locker: previousVersion.locker, __Status: 'Inactive' });
  }
}

function updateLocker(content, request, {
  locker = content.has('locker') && content.get('locker') != null && !content.get('locker').isJsonNull() ?
    content.get('locker').getAsString() : null,
  __Status = content.get('__Status').getAsString()
} = {}) {
  if (!locker) {
    return;
  }

  const subscriptionEnded = content.has('subscription_end_date') && content.get('subscription_end_date') != null
    && !content.get('subscription_end_date').isJsonNull();

  const customer = request.getMethod() !== 'DELETE' && __Status !== 'Inactive' && !subscriptionEnded
    ? content.get('id').getAsString()
    : null;

  ajax.request({
    data: JSON.stringify({ customer }),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HTTP-Method-Override': 'PATCH'
    },
    method: 'POST',
    uri: `${common.DA_LOCKERS_URL}('${locker}')`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupLocation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const location = content.has('location') && content.get('location') != null && !content.get('location').isJsonNull()
    ? content.get('location').getAsString() : null;

  if (previousVersion.location !== location) {
    updateLocation(content, request, { location: previousVersion.location, __Status: 'Inactive' });
  }
}

function updateLocation(content, request, {
  location = content.has('location') && content.get('location') != null && !content.get('location').isJsonNull() ?
    content.get('location').getAsString() : null,
  __Status = content.get('__Status').getAsString()
} = {}) {
  if (!location) {
    return;
  }

  // Get Occupied
  let occupied = 0;
  const select = encodeURIComponent('id');
  const filter = encodeURIComponent(`location eq '${location}' and __Status eq 'Active' and subscription_end_date eq null`);
  const top = encodeURIComponent('999');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_CUSTOMERS_URL}?$select=${select}&$filter=${filter}&$top=${top}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    occupied = body.value.length;

    const method = request.getMethod();
    if (method === 'DELETE') {
      occupied--;
    } else if (method === 'POST') {
      occupied++;
    } else if (method === 'PUT') {
      if (previousVersion.__Status !== __Status) {
        if (__Status === 'Active') {
          occupied++;
        } else {
          occupied--;
        }
      } else if (previousVersion.location !== location) {
        occupied++;
      }
    }

    mailClient.send(`${common.DA_CUSTOMERS_URL}?$select=${select}&$filter=${filter}&$top=${top}`, occupied, ['jngo2@toronto.ca']);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Get Total
  let lockers_total = 0;
  const select2 = encodeURIComponent('lockers_total');
  ajax.request({
    data: JSON.stringify(data),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'GET',
    uri: `${common.DA_LOCATIONS_URL}('${location}')?$select=${select2}`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    const body = JSON.parse(okResponse.body);
    lockers_total = +body.lockers_total;

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Save Occupied and Available
  const data = {
    occupied,
    available: lockers_total > occupied ? lockers_total - occupied : 0
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
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupKeyfob(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const keyfob = content.has('keyfob') && content.get('keyfob') != null && !content.get('keyfob').isJsonNull()
    ? content.get('keyfob').getAsString() : null;

  if (previousVersion.keyfob !== keyfob) {
    updateKeyfob(content, request, { keyfob: previousVersion.keyfob, __Status: 'Inactive' });
  }
}

function updateKeyfob(content, request, {
  keyfob = content.has('keyfob') && content.get('keyfob') != null && !content.get('keyfob').isJsonNull() ?
    content.get('keyfob').getAsString() : null,
  __Status = content.get('__Status').getAsString()
} = {}) {
  if (!keyfob) {
    return;
  }

  const subscriptionEnded = content.has('subscription_end_date') && content.get('subscription_end_date') != null
    && !content.get('subscription_end_date').isJsonNull();

  const customer = request.getMethod() !== 'DELETE' && __Status !== 'Inactive'
    && !subscriptionEnded ? content.get('id').getAsString() : null;

  ajax.request({
    data: JSON.stringify({ customer }),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HTTP-Method-Override': 'PATCH'
    },
    method: 'POST',
    uri: `${common.DA_KEYFOBS_URL}('${keyfob}')`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupStation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const station = content.has('station') && content.get('station') != null && !content.get('station').isJsonNull()
    ? content.get('station').getAsString() : null;

  if (previousVersion.station !== station) {
    updateStation(content, request, { station: previousVersion.station, __Status: 'Inactive' });
  }
}

function updateStation(content, request, {
  station = content.has('station') && content.get('station') != null && !content.get('station').isJsonNull() ?
    content.get('station').getAsString() : null,
  __Status = content.get('__Status').getAsString()
} = {}) {
  if (!station) {
    return;
  }

  // Get Occupied
  let occupied = 0;
  const select = encodeURIComponent('id');
  const filter = encodeURIComponent(`station eq '${station}' and __Status eq 'Active' and subscription_end_date eq null`);
  const top = encodeURIComponent('999');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_CUSTOMERS_URL}?$select=${select}&$filter=${filter}&$top=${top}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    occupied = body.value.length;

    const method = request.getMethod();
    if (method === 'DELETE') {
      occupied--;
    } else if (method === 'POST') {
      occupied++;
    } else if (method === 'PUT') {
      if (previousVersion.__Status !== __Status) {
        if (__Status === 'Active') {
          occupied++;
        } else {
          occupied--;
        }
      } else if (previousVersion.station !== station) {
        occupied++;
      }
    }

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Get Total
  let capacity = 0;
  const select2 = encodeURIComponent('capacity');
  ajax.request({
    data: JSON.stringify(data),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'GET',
    uri: `${common.DA_STATIONS_URL}('${station}')?$select=${select2}`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    const body = JSON.parse(okResponse.body);
    capacity = +body.capacity;

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Save Occupied and Available
  const data = {
    occupied,
    available: capacity > occupied ? capacity - occupied : 0
  };
  ajax.request({
    data: JSON.stringify(data),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HTTP-Method-Override': 'PATCH'
    },
    method: 'POST',
    uri: `${common.DA_STATIONS_URL}('${station}')`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}
