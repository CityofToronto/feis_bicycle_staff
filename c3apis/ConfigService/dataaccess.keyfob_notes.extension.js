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
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  cleanupKeyfobs(content, request);

  setKeyfobsNumber(content, request);
  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateKeyfob(content, request);
}

function afterUpdate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateKeyfob(content, request);
}

function afterDelete(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateKeyfob(content, request);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setKeyfobsNumber(content, request) {
  if (content.has('keyfob__number')) {
    content.remove('keyfob__number');
  }

  var select = encodeURIComponent('number');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATIONS_URL + '(\'' + content.get('keyfob').getAsString() + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    content.addProperty('keyfob__number', body.site_name);

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

  var returnValue = void 0;

  var select = 'keyfob';
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_KEYFOB_NOTES_URL + '(\'' + content.get('id').getAsString() + '\')?$select=' + select
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    returnValue = {
      keyfob: body.keyfob
    };

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) {// eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  return returnValue;
}

function cleanupKeyfobs(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  var previousVersion = getPreviousVersion(content, request);
  if (previousVersion.keyfob !== content.get('keyfob').getAsString()) {
    updateKeyfob(content, request, { location: previousVersion.location, __Status: 'Inactive' });
  }
}

function updateKeyfob(content, request) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$keyfob = _ref.keyfob,
      keyfob = _ref$keyfob === undefined ? content.get('keyfob').getAsString() : _ref$keyfob,
      _ref$__Status = _ref.__Status,
      __Status = _ref$__Status === undefined ? content.get('__Status').getAsString() : _ref$__Status;

  var method = request.getMethod();

  var select = encodeURIComponent('id,date,note');
  var filter = encodeURIComponent('keyfob eq \'' + keyfob + '\' and __Status eq \'Active\'');
  var orderby = encodeURIComponent('date desc');
  var top = method === 'POST' || method === 'PUT' && __Status === 'Active' ? 1 : 2;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_KEYFOB_NOTES_URL + '?$select=' + select + '&$filter=' + filter + '&$orderby=' + orderby + '&$top=' + top
  }, function okFunction(okResponse) {
    var id = content.get('id').getAsString();
    var date = content.get('date').getAsString();
    var note = function () {
      if (content.has('note')) {
        var temp = content.get('note');
        if (temp != null && !temp.isJsonNull()) {
          return temp.getAsString();
        }
      }
      return null;
    }();

    var body = JSON.parse(okResponse.body);
    if (method === 'DELETE') {
      if (body.value[1] && body.value[1].id === id) {
        body.value.splice(1, 1);
      } else if (body.value[0] && body.value[0].id === id) {
        body.value.splice(0, 1);
      }
    } else if (method === 'POST') {
      body.value.push({ id: id, date: date, note: note });
    } else if (method === 'PUT') {
      if (__Status === 'Active') {
        if (body.value[0] && body.value[0].id === id) {
          body.value[0].date = date;
          body.value[0].note = note;
        } else {
          body.value.push({ id: id, date: date, note: note });
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
      uri: common.DA_KEYFOBS_URL + '(\'' + keyfob + '\')'

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