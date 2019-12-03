module.exports.DA_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// module.exports.DA_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// module.exports.DA_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// module.exports.DA_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

module.exports.DA_APP_BASE_URL = module.exports.DA_BASE_URL + '/bicycle_parking';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.locations_getLockersTotals = function(locationId, options) {
  options = options || {};
  var Authorization = options.Authorization;

  var returnValue = {};

  var headers = {
    'Content-Type': 'application/json'
  };
  if (Authorization) {
    headers.Authorization = Authorization;
  }

  var uri = [module.exports.DA_APP_BASE_URL, '/lockers?$select=id,customer&$filter=location eq \'', locationId, '\'&$skip=0&$top=1000'].join('');
  ajax.request({
    uri: encodeURI(uri),
    method: 'GET',
    headers: headers
  }, function (ajaxSuccessResponse) {
    var body = JSON.parse(ajaxSuccessResponse.body);

    returnValue.lockersTotal = body.value.length;

    returnValue.lockersAssigned = returnValue.lockersTotal === 1000 ? null
      : body.value.filter(function (value) { return value.customer != null; }).length;

    returnValue.lockersUnassigned = returnValue.lockersTotal === 1000 ? null
      : returnValue.lockersTotal - returnValue.lockersAssigned;
  }, function (ajaxErrorResponse) {
    throw 'An Error Occured.';
  });

  return returnValue;
}

// var body = [
//   'BEFORE CONTENT PARSE<br><br>',
//   'METHOD<br>', request.getMethod(), '<br><br>',
//   'CONTENT<br>', content.toString(), '<br><br>',
//   'LOCKERS TOTALS<br>', JSON.stringify(lockersTotals), '<br><br>',
// ].join('');
// mailClient.createMail()
//   .setSubject('BEFORE CONTENT PARSE')
//   .setBody(body)
//   .setTo(['James.Ngo@toronto.ca'])
//   .send();
