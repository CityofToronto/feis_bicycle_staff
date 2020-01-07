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

  setStationsSiteName(content, request);
  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function afterUpdate(content, request, uriInfo, response) {// eslint-disable-line no-unused-vars
}

function afterDelete(content, request, uriInfo, response) {} // eslint-disable-line no-unused-vars


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setStationsSiteName(content, request) {
  if (content.has('stations__site_name')) {
    content.remove('stations__site_name');
  }

  var jsonArray = content.get('stations').getAsJsonArray();
  var jsonArraySize = jsonArray.size();

  var filters = [];
  for (var index = 0; index < jsonArraySize; index++) {
    filters.push('id eq \'' + jsonArray.get(index).getAsString() + '\'');
  }

  var filter = encodeURIComponent(filters.join(' or '));
  var select = encodeURIComponent('site_name');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: common.DA_STATIONS_URL + '?$select=' + select + '&$filter=' + filter
  }, function okFunction(okResponse) {
    var body = JSON.parse(okResponse.body);
    var site_name = body.value.map(function (_ref) {
      var site_name = _ref.site_name;
      return site_name;
    }).sort().join(', ');
    content.addProperty('stations__site_name', site_name);

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