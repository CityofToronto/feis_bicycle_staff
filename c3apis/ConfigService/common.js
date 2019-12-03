module.exports.DATAACCESS_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// module.exports.DATAACCESS_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// module.exports.DATAACCESS_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// module.exports.DATAACCESS_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

module.exports.DATAACCESS_APP_BASE_URL = module.exports.DATAACCESS_BASE_URL + '/bicycle_parking';
