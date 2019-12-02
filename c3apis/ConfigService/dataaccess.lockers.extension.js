var common = require('tw_backflowprevention/common.js');

var location;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

function beforeContentParse(content, request, uriInfo, response) {
  var contentJson = JSON.parse(content.toString());
  location = contentJson['location'];
}

function afterCreate(content, request, uriInfo, response) {
  updateLockerCount();
}

function afterUpdate(content, request, uriInfo, response) {
  updateLockerCount();
}

function afterDelete(content, request, uriInfo, response) {
  updateLockerCount();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLockerCount() {
  // ajax.request({
  //   uri: encodeURI(common.DATAACCESS_APP_BASE_URL + '/lockers?$select=id&$top=1000&$filter=location eq \'' + location + '\''),
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }, function (ajaxSuccessResponse) {

  // }, function (ajaxErrorResponse) {
  // });
}

function getLockerCount() {
  // ajax.request({
  //   uri: encodeURI(common.DATAACCESS_APP_BASE_URL + '/lockers?$select=id&$top=1000&$filter=location eq \'' + location + '\''),
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }, function (ajaxSuccessResponse) {
  //   return
  // }, function (ajaxErrorResponse) {
  // });
}
