module.exports.DA_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// module.exports.DA_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// module.exports.DA_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// module.exports.DA_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

module.exports.DA_APP_BASE_URL = module.exports.DA_BASE_URL + '/bicycle_parking';

module.exports.DA_LOCATIONS_URL = module.exports.DA_APP_BASE_URL + '/locations';
module.exports.DA_LOCATION_NOTES_URL = module.exports.DA_APP_BASE_URL + '/location_notes';
module.exports.DA_LOCATION_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/location_inspections';

module.exports.DA_LOCKERS_URL = module.exports.DA_APP_BASE_URL + '/lockers';
module.exports.DA_LOCKER_NOTES_URL = module.exports.DA_APP_BASE_URL + '/locker_notes';
module.exports.DA_LOCKER_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/locker_inspections';

module.exports.DA_STATIONS_URL = module.exports.DA_APP_BASE_URL + '/stations';
module.exports.DA_STATION_NOTES_URL = module.exports.DA_APP_BASE_URL + '/station_notes';
module.exports.DA_STATION_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/station_inspections';

module.exports.DA_KEYFOBS_URL = module.exports.DA_APP_BASE_URL + '/keyfobs';
module.exports.DA_KEYFOB_NOTES_URL = module.exports.DA_APP_BASE_URL + '/keyfob_notes';
module.exports.DA_KEYFOB_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/keyfob_inspections';

module.exports.DA_CUSTOMERS_URL = module.exports.DA_APP_BASE_URL + '/customers';
module.exports.DA_CUSTOMER_NOTES_URL = module.exports.DA_APP_BASE_URL + '/customer_notes';
module.exports.DA_CUSTOMER_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/customer_inspections';

module.exports.DA_PAYMENTS_URL = module.exports.DA_APP_BASE_URL + '/payments';
module.exports.DA_PAYMENT_NOTES_URL = module.exports.DA_APP_BASE_URL + '/payment_notes';
module.exports.DA_PAYMENT_INSPECTIONS_URL = module.exports.DA_APP_BASE_URL + '/payment_inspections';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.locations_getLockersTotals = function(request, locationId) {
  var returnValue = {};

  var uri = [module.exports.DA_APP_BASE_URL, '/lockers?$select=id,customer&$filter=location eq \'', locationId, '\'&$skip=0&$top=1000'].join('');

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
