var common = require('bicycle_parking/common.js');

function getLocationSiteName(request, location) {
  var returnValue = null;

  var uri = common.DA_APP_BASE_URL + '/locations(\'' + location + '\')?$select=site_name';

  var headers = {
    'Content-Type': 'application/json'
  };

  var Authorization = request.getHeader('Authorization');
  if (Authorization) {
    headers.Authorization = Authorization;
  }

  ajax.request({
    uri: encodeURI(uri),
    headers: headers,
    method: 'GET'
  }, function (ajaxSuccessResponse) {
    var body = JSON.parse(ajaxSuccessResponse.body);
    returnValue = body.site_name;
  }, function (ajaxErrorResponse) {
  });

  return returnValue;
}

function updateLocationLatesInspection(request, location) {
  var uri = common.DA_APP_BASE_URL + '/location_inspections?$select=date,result,notes&$filter=location eq \'' +
    location + '\'&$top=1&$orderby=date desc';

  var headers = {
    'Content-Type': 'application/json'
  };

  var Authorization = request.getHeader('Authorization');
  if (Authorization) {
    headers.Authorization = Authorization;
  }

  ajax.request({
    uri: encodeURI(uri),
    headers: headers,
    method: 'GET'
  }, function (ajaxSuccessResponse) {
    var body = JSON.parse(ajaxSuccessResponse.body);
    if (body.value.length > 0) {
      var data = {
        latest_inspection: body.value[0].id,
        latest_inspection_date: body.value[0].date,
        latest_inspection_result: body.value[0].result,
        latest_inspection_notes: body.value[0].notes
      };

      mailClient.createMail()
        .setSubject('GET LATEST')
        .setBody(JSON.stringify(body))
        .setTo(['James.Ngo@toronto.ca'])
        .send();

      var uri2 = common.DA_APP_BASE_URL + '/locations(\'' + location + '\')';

      headers['X-HTTP-Method-Override'] = 'PATCH';

      ajax.request({
        uri: encodeURI(uri2),
        headers: headers,
        method: 'POST',
        data: JSON.stringify(data)
      }, function (ajaxSuccessResponse) {
        var body = JSON.parse(ajaxSuccessResponse.body);
        mailClient.createMail()
          .setSubject('PATCH')
          .setBody(JSON.stringify(body))
          .setTo(['James.Ngo@toronto.ca'])
          .send();
      }, function (ajaxErrorResponse) {
        throw ajaxErrorResponse;
      });
    }
  }, function (ajaxErrorResponse) {
    throw ajaxErrorResponse;
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

function beforeContentParse(content, request, uriInfo, response) {
  // if (content.has('location')) {
  //   if (content.has('location_site_name')) {
  //     content.remove('location_site_name');
  //   }

  //   var locationSiteName = getLocationSiteName(request, content.get('location').getAsString());
  //   if (locationSiteName) {
  //     content.addProperty('location_site_name', locationSiteName);
  //   }
  // }
}

function afterCreate(content, request, uriInfo, response) {
  // mailClient.createMail()
  //   .setSubject('AFTER CREATE')
  //   .setBody(content.toString())
  //   .setTo(['James.Ngo@toronto.ca'])
  //   .send();

  // if (content.has('location')) {
  //   updateLocationLatesInspection(request, content.get('location').getAsString());
  // }
}

function afterUpdate(content, request, uriInfo, response) {
  // mailClient.createMail()
  //   .setSubject('AFTER UPDATE')
  //   .setBody(content.toString())
  //   .setTo(['James.Ngo@toronto.ca'])
  //   .send();

  // if (content.has('location')) {
  //   updateLocationLatesInspection(request, content.get('location').getAsString());
  // }
}

function afterDelete(content, request, uriInfo, response) {
  // if (content.has('location')) {
  //   updateLocationLatesInspection(request, content.get('location').getAsString());
  // }
}
