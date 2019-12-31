'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FLAG
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var SSJS_DISABLED = true;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// URLS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var DA_BASE_URL = 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc'; // MASERATI
// const DA_BASE_URL = 'https://was-inter-sit.toronto.ca/c3api_data/v2/DataAccess.svc'; // SIT
// const DA_BASE_URL = 'https://was-inter-qa.toronto.ca/c3api_data/v2/DataAccess.svc'; // QA
// const DA_BASE_URL = 'https://secure.toronto.ca/c3api_data/v2/DataAccess.svc'; // PROD

var DA_APP_BASE_URL = DA_BASE_URL + '/bicycle_parking';

var DA_LOCATIONS_URL = DA_APP_BASE_URL + '/locations';
var DA_LOCATION_NOTES_URL = DA_APP_BASE_URL + '/location_notes';
var DA_LOCATION_INSPECTIONS_URL = DA_APP_BASE_URL + '/location_inspections';

var DA_LOCKERS_URL = DA_APP_BASE_URL + '/lockers';
var DA_LOCKER_NOTES_URL = DA_APP_BASE_URL + '/locker_notes';
var DA_LOCKER_INSPECTIONS_URL = DA_APP_BASE_URL + '/locker_inspections';

var DA_STATIONS_URL = DA_APP_BASE_URL + '/stations';
var DA_STATION_NOTES_URL = DA_APP_BASE_URL + '/station_notes';
var DA_STATION_INSPECTIONS_URL = DA_APP_BASE_URL + '/station_inspections';

var DA_KEYFOBS_URL = DA_APP_BASE_URL + '/keyfobs';
var DA_KEYFOB_NOTES_URL = DA_APP_BASE_URL + '/keyfob_notes';

var DA_CUSTOMERS_URL = DA_APP_BASE_URL + '/customers';
var DA_CUSTOMER_NOTES_URL = DA_APP_BASE_URL + '/customer_notes';
var DA_CUSTOMER_NOTIFICATION_URL = DA_APP_BASE_URL + '/customer_notification';

var DA_PAYMENTS_URL = DA_APP_BASE_URL + '/payments';
var DA_PAYMENT_NOTES_URL = DA_APP_BASE_URL + '/payment_notes';
var DA_PAYMENT_NOTIFICATION_URL = DA_APP_BASE_URL + '/payment_notification';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  SSJS_DISABLED: SSJS_DISABLED,
  DA_BASE_URL: DA_BASE_URL, DA_APP_BASE_URL: DA_APP_BASE_URL,
  DA_LOCATIONS_URL: DA_LOCATIONS_URL, DA_LOCATION_NOTES_URL: DA_LOCATION_NOTES_URL, DA_LOCATION_INSPECTIONS_URL: DA_LOCATION_INSPECTIONS_URL,
  DA_LOCKERS_URL: DA_LOCKERS_URL, DA_LOCKER_NOTES_URL: DA_LOCKER_NOTES_URL, DA_LOCKER_INSPECTIONS_URL: DA_LOCKER_INSPECTIONS_URL,
  DA_KEYFOBS_URL: DA_KEYFOBS_URL, DA_KEYFOB_NOTES_URL: DA_KEYFOB_NOTES_URL,
  DA_STATIONS_URL: DA_STATIONS_URL, DA_STATION_NOTES_URL: DA_STATION_NOTES_URL, DA_STATION_INSPECTIONS_URL: DA_STATION_INSPECTIONS_URL,
  DA_CUSTOMERS_URL: DA_CUSTOMERS_URL, DA_CUSTOMER_NOTES_URL: DA_CUSTOMER_NOTES_URL, DA_CUSTOMER_NOTIFICATION_URL: DA_CUSTOMER_NOTIFICATION_URL,
  DA_PAYMENTS_URL: DA_PAYMENTS_URL, DA_PAYMENT_NOTES_URL: DA_PAYMENT_NOTES_URL, DA_PAYMENT_NOTIFICATION_URL: DA_PAYMENT_NOTIFICATION_URL
};