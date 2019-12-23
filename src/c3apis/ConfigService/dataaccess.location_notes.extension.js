////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* exported afterQuery, beforeContentParse, afterCreate, afterUpdate, afterDelete */

function afterQuery(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
}

function beforeContentParse(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  if (!request.getHeader('FromDataaccess')) {
    if (content.has('location__site_name')) {
      content.remove('location__site_name');
    }
    const select = encodeURIComponent('id,site_name');
    const filter = encodeURIComponent(`id eq '${content.get('location').getAsString()}'`);
    ajax.request({
      headers: { Authorization: request.getHeader('Authorization') },
      method: 'GET',
      uri: `${common.DA_LOCATIONS_URL}?$select=${select}&$filter=${filter}`
    }, function okFunction(okResponse) {
      // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);
      const json = JSON.parse(okResponse.body);
      if (json.value && json.value.length > 0) {
        content.addProperty('location__site_name', json.value[0].site_name);
      }
    }, function errorFunction(errorResponse) {
      // mailClient.send('ERROR RESPONSE', JSON.stringify(errorResponse), ['jngo2@toronto.ca']);
    });
  }

  if (request.getMethod() === 'POST') {
    if (content.has('__Status')) {
      content.remove('__Status');
    }

    content.addProperty('__Status', 'Active');
  }
}

function afterCreate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

function afterUpdate(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

function afterDelete(content, request, uriInfo, response) { // eslint-disable-line no-unused-vars
  updateLocation(content, request, uriInfo, response);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLocation(content, request, uriInfo, response) {
  const id = content.get('id').getAsString();
  const location = content.get('location').getAsString();
  const date = content.get('date').getAsString();
  const note = content.get('note').getAsString();
  const status = content.get('__Status').getAsString();

  const select = encodeURIComponent('id,date,note');
  const filter = encodeURIComponent(`location eq '${location}' and __Status eq 'Active'`);
  const orderby = encodeURIComponent('date desc');
  const top = encodeURIComponent('2');
  ajax.request({
    headers: { Authorization: request.getHeader('Authorization') },
    method: 'GET',
    uri: `${common.DA_LOCATION_NOTES_URL}?$select=${select}&$filter=${filter}&$orderby=${orderby}&$top=${top}`
  }, function okFunction(okResponse) {
    // mailClient.send('OKAY RESPONSE', JSON.stringify(okResponse), ['jngo2@toronto.ca']);

    const json = JSON.parse(okResponse.body);
    const value = json.value;

    if (value && value.length > 0) {
      if (request.getMethod() === 'DELETE' || status !== 'Active') {
        if (value[1] && value[1].id === id) {
          value.splice(1, 1);
        } else if (value[0] && value[0].id === id) {
          value.splice(0, 1);
        }
      } else {
        if (value[0] && value[0].id === id) {
          value[0].date = date;
          value[0].note = note;
        } else if (value[1] && value[1].id === id) {
          value[1].date = date;
          value[1].note = note;
        } else {
          value.push({ id, date, note });
        }
      }

      value.sort((a, b) => {
        const a_date = new Date(a.date).getDate();
        const b_date = new Date(b.date).getDate();
        if (a_date > b_date) {
          return -1;
        }
        if (a_date < b_date) {
          return 1;
        }
        return 0;
      });

      // mailClient.send('VALUE', JSON.stringify(value), ['jngo2@toronto.ca']);

      ajax.request({
        data: JSON.stringify({
          latest_note: id,
          latest_note__date: value[0].date,
          latest_note__note: value[0].note
        }),
        headers: {
          Authorization: request.getHeader('Authorization'),
          FromDataaccess: true,
          'Content-Type': 'application/json; charset=UTF-8',
          // 'X-HTTP-Method-Override': 'PATCH'
        },
        method: 'PATCH',
        uri: `${common.DA_LOCATIONS_URL}('${location}')`
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
