var common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function locations_total_all(request, response, requestBody) {
  var uri = common.DA_LOCATIONS_URL + '?$select=id&$top=1000&$filter= __Status eq \'Active\'';

  var headers = {
    'Content-Type': 'application/json'
  };

  var authorization = request.getHeader('Authorization');
  if (authorization) {
    headers.Authorization = authorization;
  }

  ajax.request({
    uri: encodeURI(uri),
    headers: headers,
    method: 'GET'
  }, function (ajaxSuccessResponse) {
    response.setStatusCode(200);
    response.setContent(JSON.stringify({ total: JSON.parse(ajaxSuccessResponse.body).value.length }));
  }, function (ajaxErrorResponse) {
    response.setStatusCode(500);
    response.setContent(ajaxErrorResponse.body);
  });
}

function notification(request, response, requestBody) {
  print("req: " + request.getHeader("host"));
  print("requestBody: " + requestBody);
  response.setStatusCode(501);
  response.setContent('{"messsage": "not implemented function"}');
}
