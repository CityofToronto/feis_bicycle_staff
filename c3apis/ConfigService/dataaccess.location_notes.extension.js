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

  cleanupLocation(content, request);

  setLocationSiteName(content, request);

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocation(content, request);
}

function afterUpdate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocation(content, request);
}

function afterDelete(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
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

  var select = encodeURIComponent('site_name');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATIONS_URL + '(\'' + content.get('location').getAsString() + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    content.addProperty('location__site_name', body.site_name);

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

function cleanupLocation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var select = encodeURIComponent('location');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATION_NOTES_URL + '(\'' + content.get('id').getAsString() + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    if (body.location !== content.get('location').getAsString()) {
      updateLocation(content, request, { 'location': body.location, '__Status': 'Inactive' });
    }

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

function updateLocation(content, request) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$id = _ref.id,
      id = _ref$id === undefined ? content.get('id').getAsString() : _ref$id,
      _ref$location = _ref.location,
      location = _ref$location === undefined ? content.get('location').getAsString() : _ref$location,
      _ref$date = _ref.date,
      date = _ref$date === undefined ? content.get('date').getAsString() : _ref$date,
      _ref$note = _ref.note,
      note = _ref$note === undefined ? content.get('note').getAsString() : _ref$note,
      _ref$__Status = _ref.__Status,
      status = _ref$__Status === undefined ? content.get('__Status').getAsString() : _ref$__Status;

  var select = encodeURIComponent('id,date,note');
  var filter = encodeURIComponent('location eq \'' + location + '\' and __Status eq \'Active\'');
  var orderby = encodeURIComponent('date desc');
  var top = encodeURIComponent('2');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATION_NOTES_URL + '?$select=' + select + '&$filter=' + filter + '&$orderby=' + orderby + '&$top=' + top
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    if (request.getMethod() === 'DELETE' || status !== 'Active') {
      if (body.value[1] && body.value[1].id === id) {
        body.value.splice(1, 1);
      } else if (body.value[0] && body.value[0].id === id) {
        body.value.splice(0, 1);
      }
    } else {
      if (body.value[1] && body.value[1].id === id) {
        body.value[1].date = date;
        body.value[1].note = note;
      } else if (body.value[1] && body.value[0].id === id) {
        body.value[0].date = date;
        body.value[0].note = note;
      } else {
        body.value.push({ id: id, date: date, note: note });
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
      data.latest_note = body.value[0].id;
      data.latest_note__date = body.value[0].date;
      data.latest_note__note = body.value[0].note;
    } else {
      data.latest_note = null;
      data.latest_note__date = null;
      data.latest_note__note = null;
    }
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

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}