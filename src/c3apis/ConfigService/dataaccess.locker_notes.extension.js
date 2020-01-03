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

  cleanupLocker(content, request);

  setLockerName(content, request);

  setStatus(content, request);
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (common.SSJS_DISABLED) {
    return;
  }

  updateLocker(content, request);
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
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

  const select = encodeURIComponent('location__site_name,number');

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKERS_URL}('${content.get('locker').getAsString()}')?$select=${select}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    content.addProperty('locker__name', `${body.location__site_name} - ${body.number}`);

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

  const select = 'locker';
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKER_NOTES_URL}('${content.get('id').getAsString()}')?$select=${select}`
  }, function okFunction(okResponse) {
    const body = JSON.parse(okResponse.body);
    returnValue = {
      locker: body.locker
    };

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  return returnValue;
}

function cleanupLocker(content, request) {
  if (request.getMethod() !== 'PUT') {
    return;
  }

  const previousVersion = getPreviousVersion(content, request);
  if (previousVersion.locker !== content.get('locker').getAsString()) {
    updateLocker(content, request, { locker: previousVersion.locker, __Status: 'Inactive' });
  }
}

function updateLocker(content, request, {
  locker = content.get('locker').getAsString(),
  __Status = content.get('__Status').getAsString()
} = {}) {
  const method = request.getMethod();

  const select = encodeURIComponent('id,date,note');
  const filter = encodeURIComponent(`locker eq '${locker}' and __Status eq 'Active'`);
  const orderby = encodeURIComponent('date desc');
  const top = method === 'POST' || (method === 'PUT' && __Status === 'Active') ? 1 : 2;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKER_NOTES_URL}?$select=${select}&$filter=${filter}&$orderby=${orderby}&$top=${top}`
  }, function okFunction(okResponse) {
    const id = content.get('id').getAsString();
    const date = content.get('date').getAsString();
    const note = content.get('note').getAsString();

    const body = JSON.parse(okResponse.body);
    if (method === 'DELETE') {
      if (body.value[1] && body.value[1].id === id) {
        body.value.splice(1, 1);
      } else if (body.value[0] && body.value[0].id === id) {
        body.value.splice(0, 1);
      }
    } else if (method === 'POST') {
      body.value.push({ id, date, note });
    } else if (method === 'PUT') {
      if (__Status === 'Active') {
        if (body.value[0] && body.value[0].id === id) {
          body.value[0].date = date;
          body.value[0].note = note;
        } else {
          body.value.push({ id, date, note });
        }
      } else {
        if (body.value[1] && body.value[1].id === id) {
          body.value.splice(1, 1);
        } else if (body.value[0] && body.value[0].id === id) {
          body.value.splice(0, 1);
        }
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
      uri: `${common.DA_LOCKERS_URL}('${locker}')`

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
