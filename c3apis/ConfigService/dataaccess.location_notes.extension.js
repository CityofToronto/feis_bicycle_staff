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
  var json = JSON.parse(content.toString());
  var method = request.getMethod();

  if (method === 'PUT') {
    var _select = encodeURIComponent('id,location');
    var _filter = encodeURIComponent('id eq \'' + json.id + '\'');
    ajax.request({
      headers: { Authorization: request.getHeader('Authorization') },
      method: 'GET',
      uri: common.DA_LOCATION_NOTES_URL + '?$select=' + _select + '&$filter=' + _filter
    }, function okFunction(okResponse) {
      // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
      var body = JSON.parse(okResponse.body);
      if (body.value && body.value.length > 0 && body.value[0].location !== json.location) {
        throw 'The entities location attribute cannot be updated.';
      }
    }, function errorFunction(errorResponse) {
      // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
    });
  }

  if (content.has('location__site_name')) {
    content.remove('location__site_name');
  }
  var select = encodeURIComponent('id,site_name');
  var filter = encodeURIComponent('id eq \'' + json.location + '\'');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATIONS_URL + '?$select=' + select + '&$filter=' + filter
  }, function okFunction(okResponse) {
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
    var body = JSON.parse(okResponse.body);
    if (body.value && body.value.length > 0) {
      content.addProperty('location__site_name', body.value[0].site_name);
    }
  }, function errorFunction(errorResponse) {
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  if (method === 'POST') {
    if (content.has('__Status')) {
      content.remove('__Status');
    }

    content.addProperty('__Status', 'Active');
  }
}

function afterCreate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

function afterUpdate(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

function afterDelete(content, request, uriInfo, response) {
  // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLocation(content, request, uriInfo, response) {
  var json = JSON.parse(content.toString());
  var method = request.getMethod();

  var select = encodeURIComponent('id,date,note');
  var filter = encodeURIComponent('location eq \'' + json.location + '\' and __Status eq \'Active\'');
  var orderby = encodeURIComponent('date desc');
  var top = encodeURIComponent('2');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_LOCATION_NOTES_URL + '?$select=' + select + '&$filter=' + filter + '&$orderby=' + orderby + '&$top=' + top
  }, function okFunction(okResponse) {
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);

    var body = JSON.parse(okResponse.body);

    if (body.value && body.value.length > 0) {
      if (method === 'DELETE' || json['__Status'] !== 'Active') {
        if (body.value[1] && body.value[1].id === json.id) {
          body.value.splice(1, 1);
        } else if (body.value[0] && body.value[0].id === json.id) {
          body.value.splice(0, 1);
        }
      } else {
        if (body.value[0] && body.value[0].id === json.id) {
          body.value[0].date = json.date;
          body.value[0].note = json.note;
        } else if (body.value[1] && body.value[1].id === json.id) {
          body.value[1].date = json.date;
          body.value[1].note = json.note;
        } else {
          body.value.push({ id: json.id, date: json.data, note: json.note });
        }
      }

      body.value.sort(function (a, b) {
        var a_date = new Date(a.date).getDate();
        var b_date = new Date(b.date).getDate();
        if (a_date > b_date) {
          return -1;
        }
        if (a_date < b_date) {
          return 1;
        }
        return 0;
      });

      ajax.request({
        data: JSON.stringify({
          latest_note: body.value[0].id,
          latest_note__date: body.value[0].date,
          latest_note__note: body.value[0].note
        }),
        headers: {
          Authorization: request.getHeader('Authorization'),
          'Content-Type': 'application/json; charset=UTF-8',
          FromDataaccess: true,
          'X-HTTP-Method-Override': 'PATCH'
        },
        method: 'POST',
        uri: common.DA_LOCATIONS_URL + '(\'' + json.location + '\')'
      }, function okFunction(okResponse) {
        // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
      }, function errorFunction(errorResponse) {
        // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
      });
    }
  }, function errorFunction(errorResponse) {
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}