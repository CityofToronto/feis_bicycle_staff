'use strict';

var common = require('bicycle_parking/common.js');

var previousVersion = void 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIFE CYCLE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
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

function afterCreate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
  updateLocation(content, request);
  updateKeyfob(content, request);
  updateStation(content, request);
}

function afterUpdate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
  updateLocation(content, request);
  updateKeyfob(content, request);
  updateStation(content, request);
}

function afterDelete(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
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

  var returnValue = void 0;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_CUSTOMERS_URL + '(\'' + content.get('id').getAsString() + '\')'
  }, function okFunction(okResponse) {
    returnValue = JSON.parse(okResponse.body);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
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

  var locker = content.has('locker') && content.get('locker') != null && !content.get('locker').isJsonNull() ? content.get('locker').getAsString() : null;

  if (previousVersion.locker !== locker) {
    updateLocker(content, request, { locker: previousVersion.locker, __Status: 'Inactive' });
  }
}

function updateLocker(content, request) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$locker = _ref.locker,
      locker = _ref$locker === undefined ? content.has('locker') && content.get('locker') != null && !content.get('locker').isJsonNull() ? content.get('locker').getAsString() : null : _ref$locker,
      _ref$__Status = _ref.__Status,
      __Status = _ref$__Status === undefined ? content.get('__Status').getAsString() : _ref$__Status;

  if (!locker) {
    return;
  }

  var subscriptionEnded = content.has('subscription_end_date') && content.get('subscription_end_date') != null && !content.get('subscription_end_date').isJsonNull();

  var customer = request.getMethod() !== 'DELETE' && __Status !== 'Inactive' && !subscriptionEnded ? content.get('id').getAsString() : null;

  ajax.request({
    data: JSON.stringify({ customer: customer }),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HTTP-Method-Override': 'PATCH'
    },
    method: 'POST',
    uri: common.DA_LOCKERS_URL + '(\'' + locker + '\')'

  }, function okFunction(okResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupLocation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var location = content.has('location') && content.get('location') != null && !content.get('location').isJsonNull() ? content.get('location').getAsString() : null;

  if (previousVersion.location !== location) {
    updateLocation(content, request, { location: previousVersion.location, __Status: 'Inactive' });
  }
}

function updateLocation(content, request) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$location = _ref2.location,
      location = _ref2$location === undefined ? content.has('location') && content.get('location') != null && !content.get('location').isJsonNull() ? content.get('location').getAsString() : null : _ref2$location,
      _ref2$__Status = _ref2.__Status,
      __Status = _ref2$__Status === undefined ? content.get('__Status').getAsString() : _ref2$__Status;

  if (!location) {
    return;
  }

  // Get Occupied
  var occupied = 0;
  var select = encodeURIComponent('id');
  var filter = encodeURIComponent('location eq \'' + location + '\' and __Status eq \'Active\' and subscription_end_date eq null');
  var top = encodeURIComponent('999');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_CUSTOMERS_URL + '?$select=' + select + '&$filter=' + filter + '&$top=' + top
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    occupied = body.value.length;

    var method = request.getMethod();
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

    mailClient.send(common.DA_CUSTOMERS_URL + '?$select=' + select + '&$filter=' + filter + '&$top=' + top, occupied, ['jngo2@toronto.ca']);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Get Total
  var lockers_total = 0;
  var select2 = encodeURIComponent('lockers_total');
  ajax.request({
    data: JSON.stringify(data),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'GET',
    uri: common.DA_LOCATIONS_URL + '(\'' + location + '\')?$select=' + select2

  }, function okFunction(okResponse) {
    // eslint-disable-line no-unused-vars
    var body = JSON.parse(okResponse.body);
    lockers_total = +body.lockers_total;

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Save Occupied and Available
  var data = {
    occupied: occupied,
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
    uri: common.DA_LOCATIONS_URL + '(\'' + location + '\')'

  }, function okFunction(okResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupKeyfob(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var keyfob = content.has('keyfob') && content.get('keyfob') != null && !content.get('keyfob').isJsonNull() ? content.get('keyfob').getAsString() : null;

  if (previousVersion.keyfob !== keyfob) {
    updateKeyfob(content, request, { keyfob: previousVersion.keyfob, __Status: 'Inactive' });
  }
}

function updateKeyfob(content, request) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref3$keyfob = _ref3.keyfob,
      keyfob = _ref3$keyfob === undefined ? content.has('keyfob') && content.get('keyfob') != null && !content.get('keyfob').isJsonNull() ? content.get('keyfob').getAsString() : null : _ref3$keyfob,
      _ref3$__Status = _ref3.__Status,
      __Status = _ref3$__Status === undefined ? content.get('__Status').getAsString() : _ref3$__Status;

  if (!keyfob) {
    return;
  }

  var subscriptionEnded = content.has('subscription_end_date') && content.get('subscription_end_date') != null && !content.get('subscription_end_date').isJsonNull();

  var customer = request.getMethod() !== 'DELETE' && __Status !== 'Inactive' && !subscriptionEnded ? content.get('id').getAsString() : null;

  ajax.request({
    data: JSON.stringify({ customer: customer }),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HTTP-Method-Override': 'PATCH'
    },
    method: 'POST',
    uri: common.DA_KEYFOBS_URL + '(\'' + keyfob + '\')'

  }, function okFunction(okResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanupStation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var station = content.has('station') && content.get('station') != null && !content.get('station').isJsonNull() ? content.get('station').getAsString() : null;

  if (previousVersion.station !== station) {
    updateStation(content, request, { station: previousVersion.station, __Status: 'Inactive' });
  }
}

function updateStation(content, request) {
  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref4$station = _ref4.station,
      station = _ref4$station === undefined ? content.has('station') && content.get('station') != null && !content.get('station').isJsonNull() ? content.get('station').getAsString() : null : _ref4$station,
      _ref4$__Status = _ref4.__Status,
      __Status = _ref4$__Status === undefined ? content.get('__Status').getAsString() : _ref4$__Status;

  if (!station) {
    return;
  }

  // Get Occupied
  var occupied = 0;
  var select = encodeURIComponent('id');
  var filter = encodeURIComponent('station eq \'' + station + '\' and __Status eq \'Active\' and subscription_end_date eq null');
  var top = encodeURIComponent('999');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_CUSTOMERS_URL + '?$select=' + select + '&$filter=' + filter + '&$top=' + top
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    occupied = body.value.length;

    var method = request.getMethod();
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
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Get Total
  var capacity = 0;
  var select2 = encodeURIComponent('capacity');
  ajax.request({
    data: JSON.stringify(data),
    headers: {
      Authorization: request.getHeader('Authorization'),
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'GET',
    uri: common.DA_STATIONS_URL + '(\'' + station + '\')?$select=' + select2

  }, function okFunction(okResponse) {
    // eslint-disable-line no-unused-vars
    var body = JSON.parse(okResponse.body);
    capacity = +body.capacity;

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  // Save Occupied and Available
  var data = {
    occupied: occupied,
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
    uri: common.DA_STATIONS_URL + '(\'' + station + '\')'

  }, function okFunction(okResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}