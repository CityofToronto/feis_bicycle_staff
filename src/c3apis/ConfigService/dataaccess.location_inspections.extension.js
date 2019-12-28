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

function cleanupLocation(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const select = encodeURIComponent('location');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_INSPECTIONS_URL}('${content.get('id').getAsString()}')?$select=${select}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    if (body.location !== content.get('location').getAsString()) {
      updateLocation(content, request, { 'location': body.location, '__Status': 'Inactive' });
    }

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}

function updateLocation(content, request, {
  id = content.get('id').getAsString(),
  location = content.get('location').getAsString(),
  date = content.get('date').getAsString(),
  note = content.get('note').getAsString(),
  result = content.get('result').getAsString(),
  __Status: status = content.get('__Status').getAsString()
} = {}) {
  const select = encodeURIComponent('id,date,note,result');
  const filter = encodeURIComponent(`location eq '${location}' and __Status eq 'Active'`);
  const orderby = encodeURIComponent('date desc');
  const top = encodeURIComponent('2');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_INSPECTIONS_URL}?$select=${select}&$filter=${filter}&$orderby=${orderby}&$top=${top}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
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
        body.value[1].result = result;
      } else if (body.value[1] && body.value[0].id === id) {
        body.value[0].date = date;
        body.value[0].note = note;
        body.value[0].result = result;
      } else {
        body.value.push({ id, date, note, result });
      }
    }

    body.value.sort((a, b) => {
      const a_date = new Date(a.date).getTime();
      const b_date = new Date(b.date).getTime();
      if (a_date > b_date) {
        return -1;
      }
      if (a_date < b_date) {
        return 1;
      }
      return 0;
    });

    const data = {};
    if (body.value.length > 0) {
      data.latest_inspection = body.value[0].id;
      data.latest_inspection__date = body.value[0].date;
      data.latest_inspection__note = body.value[0].note;
      data.latest_inspection__result = body.value[0].result;
    } else {
      data.latest_inspection = null;
      data.latest_inspection__date = null;
      data.latest_inspection__note = null;
      data.latest_inspection__result = null;
    }
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
