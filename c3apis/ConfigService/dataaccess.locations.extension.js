var common = require('tw_backflowprevention/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

function beforeContentParse(content, request, uriInfo, response) {
  var body = [
    'BEFORE CONTENT PARSE<br><br>',
    'METHOD<br>', request.getMethod(),'<br><br>',
    'CONTENT<br>', content.toString()
  ].join('');

  mailClient.createMail()
  .setSubject('BEFORE CONTENT PARSE')
  .setBody(body)
  .setTo(['James.Ngo@toronto.ca'])
  .send();
}

// function afterCreate(content, request, uriInfo, response) { }

// function afterUpdate(content, request, uriInfo, response) { }

// function afterDelete(content, request, uriInfo, response) { }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLockersCount() {
  var lockersCount = 0;

  ajax.request({
    uri: encodeURI(errorLogUrl),
    method: 'POST',
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  }, function (ajaxSuccessResponse) {
  }, function (ajaxErrorResponse) {
  });

  return lockersCount;
}
