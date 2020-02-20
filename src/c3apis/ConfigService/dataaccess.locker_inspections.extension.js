const common = require('bicycle_parking/common.js');


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

  cleanupLocker(content, request);

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
// SET PROPERTIES
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
// UPDATE LOCKER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPreviousVersion(content, request) {
  if (request.getMethod() !== 'PUT') {
    return null;
  }

  let returnValue;

  const select = 'locker';
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKER_INSPECTIONS_URL}('${content.get('id').getAsString()}')?$select=${select}`
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
  let body;

  const method = request.getMethod();

  const select = encodeURIComponent('id,date,note');
  const filter = encodeURIComponent(`locker eq '${locker}' and __Status eq 'Active'`);
  const orderby = encodeURIComponent('date desc');
  const top = method === 'POST' || (method === 'PUT' && __Status === 'Active') ? 1 : 2;

  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCKER_INSPECTIONS_URL}?$select=${select}&$filter=${filter}&$orderby=${orderby}&$top=${top}`
  }, function okFunction(okResponse) {
    const id = content.get('id').getAsString();
    const date = content.get('date').getAsString();
    const result = content.get('result').getAsString();
    const note = (() => {
      if (content.has('note')) {
        let temp = content.get('note');
        if (temp != null && !temp.isJsonNull()) {
          return temp.getAsString();
        }
      }
      return null;
    })();

    body = JSON.parse(okResponse.body);
    if (method === 'DELETE') {
      if (body.value[1] && body.value[1].id === id) {
        body.value.splice(1, 1);
      } else if (body.value[0] && body.value[0].id === id) {
        body.value.splice(0, 1);
      }
    } else if (method === 'POST') {
      body.value.push({ id, date, result, note });
    } else if (method === 'PUT') {
      if (__Status === 'Active') {
        if (body.value[0] && body.value[0].id === id) {
          body.value[0].date = date;
          body.value[0].result = result;
          body.value[0].note = note;
        } else {
          body.value.push({ id, date, result, note });
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

    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });

  const data = {};
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
    uri: `${common.DA_LOCKERS_URL}('${locker}')`

  }, function okFunction(okResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
  }, function errorFunction(errorResponse) { // eslint-disable-line no-unused-vars
    // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
  });
}
