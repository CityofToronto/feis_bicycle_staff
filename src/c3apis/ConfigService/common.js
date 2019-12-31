////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FLAG
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SSJS_DISABLED = true;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// URLS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DA_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// const DA_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// const DA_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// const DA_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

const DA_APP_BASE_URL = DA_BASE_URL + '/bicycle_parking';

const DA_LOCATIONS_URL = DA_APP_BASE_URL + '/locations';
const DA_LOCATION_NOTES_URL = DA_APP_BASE_URL + '/location_notes';
const DA_LOCATION_INSPECTIONS_URL = DA_APP_BASE_URL + '/location_inspections';

const DA_LOCKERS_URL = DA_APP_BASE_URL + '/lockers';
const DA_LOCKER_NOTES_URL = DA_APP_BASE_URL + '/locker_notes';
const DA_LOCKER_INSPECTIONS_URL = DA_APP_BASE_URL + '/locker_inspections';

const DA_STATIONS_URL = DA_APP_BASE_URL + '/stations';
const DA_STATION_NOTES_URL = DA_APP_BASE_URL + '/station_notes';
const DA_STATION_INSPECTIONS_URL = DA_APP_BASE_URL + '/station_inspections';

const DA_KEYFOBS_URL = DA_APP_BASE_URL + '/keyfobs';
const DA_KEYFOB_NOTES_URL = DA_APP_BASE_URL + '/keyfob_notes';

const DA_CUSTOMERS_URL = DA_APP_BASE_URL + '/customers';
const DA_CUSTOMER_NOTES_URL = DA_APP_BASE_URL + '/customer_notes';
const DA_CUSTOMER_NOTIFICATION_URL = DA_APP_BASE_URL + '/customer_notification';

const DA_PAYMENTS_URL = DA_APP_BASE_URL + '/payments';
const DA_PAYMENT_NOTES_URL = DA_APP_BASE_URL + '/payment_notes';
const DA_PAYMENT_NOTIFICATION_URL = DA_APP_BASE_URL + '/payment_notification';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  SSJS_DISABLED,
  DA_BASE_URL, DA_APP_BASE_URL,
  DA_LOCATIONS_URL, DA_LOCATION_NOTES_URL, DA_LOCATION_INSPECTIONS_URL,
  DA_LOCKERS_URL, DA_LOCKER_NOTES_URL, DA_LOCKER_INSPECTIONS_URL,
  DA_KEYFOBS_URL, DA_KEYFOB_NOTES_URL,
  DA_STATIONS_URL, DA_STATION_NOTES_URL, DA_STATION_INSPECTIONS_URL,
  DA_CUSTOMERS_URL, DA_CUSTOMER_NOTES_URL, DA_CUSTOMER_NOTIFICATION_URL,
  DA_PAYMENTS_URL, DA_PAYMENT_NOTES_URL, DA_PAYMENT_NOTIFICATION_URL
};
