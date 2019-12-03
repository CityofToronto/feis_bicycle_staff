module.exports.DA_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// module.exports.DA_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// module.exports.DA_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// module.exports.DA_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

module.exports.DA_APP_BASE_URL = module.exports.DA_BASE_URL + '/bicycle_parking';

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
