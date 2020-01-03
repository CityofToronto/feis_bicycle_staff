'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  cleanupLocker(content, request);

  setLockerName(content, request);

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
}

function afterUpdate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
}

function afterDelete(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setLockerName(content, request) {
  if (content.has('locker__name')) {
    content.remove('locker__name');
  }

  var _JSON$parse = JSON.parse(content.toString()),
      locker = _JSON$parse.locker;

  var select = encodeURIComponent('location__site_name,number');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCKERS_URL + '(\'' + locker + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    content.addProperty('locker__name', body.location__site_name + ' ' + body.number);

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
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

  var _JSON$parse2 = JSON.parse(content.toString()),
      id = _JSON$parse2.id;

  var returnValue = void 0;

  var select = 'locker';
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCKER_INSPECTIONS_URL + '(\'' + id + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    returnValue = {
      locker: body.locker
    };

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  return returnValue;
}

function cleanupLocker(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var _JSON$parse3 = JSON.parse(content.toString()),
      locker = _JSON$parse3.locker;

  var previousVersion = getPreviousVersion(content, request);
  if (previousVersion.locker !== locker) {
    updateLocker(content, request, { locker: previousVersion.locker, __Status: 'Inactive' });
  }
}

function updateLocker(content, request) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _JSON$parse4 = JSON.parse(content.toString()),
      contentLocker = _JSON$parse4.locker,
      contentStatus = _JSON$parse4.__Status,
      id = _JSON$parse4.id,
      date = _JSON$parse4.date,
      result = _JSON$parse4.result,
      note = _JSON$parse4.note;

  var _options$locker = options.locker,
      locker = _options$locker === undefined ? contentLocker : _options$locker,
      _options$__Status = options.__Status,
      __Status = _options$__Status === undefined ? contentStatus : _options$__Status;

  var method = request.getMethod();

  var select = encodeURIComponent('id,date,note');
  var filter = encodeURIComponent('locker eq \'' + locker + '\' and __Status eq \'Active\'');
  var orderby = encodeURIComponent('date desc');
  var top = method === 'POST' || method === 'PUT' && __Status === 'Active' ? 1 : 2;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCKER_INSPECTIONS_URL + '?$select=' + select + '&$filter=' + filter + '&$orderby=' + orderby + '&$top=' + top
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    if (method === 'DELETE') {
      if (body.value[1] && body.value[1].id === id) {
        body.value.splice(1, 1);
      } else if (body.value[0] && body.value[0].id === id) {
        body.value.splice(0, 1);
      }
    } else if (method === 'POST') {
      body.value.push({ id: id, date: date, result: result, note: note });
    } else if (method === 'PUT') {
      if (__Status === 'Active') {
        if (body.value[0] && body.value[0].id === id) {
          body.value[0].date = date;
          body.value[0].result = result;
          body.value[0].note = note;
        } else {
          body.value.push({ id: id, date: date, result: result, note: note });
        }
      } else {
        if (body.value[1] && body.value[1].id === id) {
          body.value.splice(1, 1);
        } else if (body.value[0] && body.value[0].id === id) {
          body.value.splice(0, 1);
        }
      }
    }

    body.value.sort(function (a, b) {
      var a_date = new Date(a.date).getTime();
      var b_date = new Date(b.date).getTime();
      if (a_date > b_date) {
        return -1;
      }
      if (a_date < b_date) {
        return 1;
      }
      return 0;
    });

    var data = {};
    if (body.value.length > 0) {
      data.latest_inspection = body.value[0].id;
      data.latest_inspection__date = body.value[0].date;
      data.latest_inspection__result = body.value[0].result;
      data.latest_inspection__note = body.value[0].note;
    } else {
      data.latest_inspection = null;
      data.latest_inspection__date = null;
      data.latest_inspection__result = null;
      data.latest_inspection__note = null;
    }
    ajax.request({
      data: JSON.stringify(data),
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

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}