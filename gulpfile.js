const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');

core.embeddedApp.createTasks(gulp, {
  pkg,
  embedArea: 'full',
  environmentOverride: null,
  deploymentPath: '',
  preprocessorContext: {
    local: {
      C3AUTH_URL: 'https://config.cc.toronto.ca:49090/c3api_auth/v2/AuthService.svc/AuthSet',

      C3CONFIG_ISAUTH_URL: 'https://config.cc.toronto.ca:49092/c3api_config/v2/ConfigService.svc/IsAuth',

      C3DATA_LOCATIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/locations',
      C3DATA_LOCATION_INSPECTIONS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/location_inspections',
      C3DATA_LOCKERS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/lockers',
      C3DATA_STATIONS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/stations',
      C3DATA_KEYFOBS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/keyfobs',
      C3DATA_CUSTOMERS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/customers',
      C3DATA_PAYMENTS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/payments',

      C3DATAMEDIA_INSPECTION_RESULT_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'inspection_result_choices.json\\\')/$value',
      C3DATAMEDIA_PROVINCE_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'province_choices.json\\\')/$value',





      C3CONFIG_ADMIN_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/admin',

      C3CONFIG_CUSTOMERS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/customers',
      C3CONFIG_SUBSCRIPTIONS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/subscriptions',
      C3CONFIG_PAYMENTS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/payments',

      C3CONFIG_LOCATIONS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/locations',
      C3CONFIG_LOCKERS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/lockers',
      C3CONFIG_STATIONS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/stations',
      C3CONFIG_KEYFOBS_RESOURCE: '/c3api_data/v2/DataAccess.svc/bicycle_parking/keyfobs',


      C3DATA_ADMIN: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/admin',

      C3DATA_REGISTRATIONS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/registrations',

      C3DATA_SUBSCRIPTIONS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/subscriptions',


      // C3DATA_LOCATIONS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/locations',

      // C3DATA_ACTIVITYLOGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/activitylogs',
      // C3DATA_EMAILLOGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/emaillogs',
      // C3DATA_SETTINGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media',

      // C3DATAMEDIA_LOCATIONS_STATUS_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'locations_status_choices.json\\\')/$value',
      // C3DATAMEDIA_LOCKERS_STATUS_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'lockers_status_choices.json\\\')/$value',
      // C3DATAMEDIA_STATIONS_STATUS_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'stations_status_choices.json\\\')/$value',
      // C3DATAMEDIA_KEYFOBS_STATUS_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'keyfobs_status_choices.json\\\')/$value',

      // C3DATA_ACTIVITYLOGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/activitylogs',
      // C3DATA_EMAILLOGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/emaillogs',
      // C3DATA_SETTINGS: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media',

      // C3DATAMEDIA_LOCKER_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'locker_choices.json\\\')/$value',

      // C3DATAMEDIA_REGISTRATION_STATUS_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'registration_status.json\\\')/$value',
      // C3DATAMEDIA_STATION_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'station_choices.json\\\')/$value'
    },
    dev: {},
    qa: {},
    prod: {}
  }
});

// gulp.task('_extras', () => {
//   let public = '/webapps/feis_bicycle_staff/webfonts/';
//   return gulp.src(['src/fontawesome/webfonts/*']).pipe(gulp.dest('dist' + public));
// });

////////////////////////////////////////////////////////////////////////////////

const c3api = require('./gulp_helper_c3api.js');

////////////////////////////////////////////////////////////////////////////////

const CONFIG_SERVICE_FOLDER = './c3apis/ConfigService';
const CONFIG_SERVICE_QUALIFIEDNAME_PREFIX = 'bicycle_parking';

gulp.task('c3api_config', () => {
  let requestOptions = c3api.helper.cmdArgs('--requestOptions');
  let localPath = c3api.helper.cmdArgs('--localPath');
  let qualifiedName = c3api.helper.cmdArgs('--qualifiedName');
  let suffix = c3api.helper.cmdArgs('--suffix');

  if (typeof suffix === 'string') {
    localPath = `${CONFIG_SERVICE_FOLDER}/${suffix}`;
    qualifiedName = `${CONFIG_SERVICE_QUALIFIEDNAME_PREFIX}/${suffix}`;
  }
  if (typeof localPath !== 'string') {
    localPath = CONFIG_SERVICE_FOLDER;
  }
  if (typeof qualifiedName !== 'string') {
    qualifiedName = CONFIG_SERVICE_QUALIFIEDNAME_PREFIX;
  }

  return c3api.config
    .localToRemote({ requestOptions, localPath, qualifiedName })
    .then(data => {
      if (c3api.helper.cmdArgs('--verbose')) {
        console.log(data);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

////////////////////////////////////////////////////////////////////////////////

const DATAACCESS_APP = 'bicycle_parking';
const DATAACCESS_FOLDER = './c3apis/DataAccess';

gulp.task('c3api_dataaccess', () => {
  let requestOptions = c3api.helper.cmdArgs('--requestOptions');
  let app = c3api.helper.cmdArgs('--app');
  let localPath = c3api.helper.cmdArgs('--localPath');
  let deleteEntity = c3api.helper.cmdArgs('--deleteEntity');
  let truncateEntity = c3api.helper.cmdArgs('--truncateEntity');
  let truncateEntityAfter = c3api.helper.cmdArgs('--truncateEntityAfter');

  if (typeof app !== 'string') {
    app = DATAACCESS_APP;
  }
  if (typeof localPath !== 'string') {
    localPath = DATAACCESS_FOLDER;
  }
  if (typeof deleteEntity !== 'boolean') {
    deleteEntity = false;
  }

  return c3api.da
    .localToRemote({ requestOptions, app, localPath, deleteEntity, truncateEntity, truncateEntityAfter })
    .then(data => {
      if (c3api.helper.cmdArgs('--verbose')) {
        console.log(data);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

////////////////////////////////////////////////////////////////////////////////

const DATAACCESS_MEDIA_APP = 'bicycle_parking';
const DATAACCESS_MEDIA_ENTITY = 'Media';
const DATAACCESS_MEDIA_FOLDER = './c3apis/DataAccess/Media';

gulp.task('c3api_dataaccess_media', () => {
  let requestOptions = c3api.helper.cmdArgs('--requestOptions');
  let app = c3api.helper.cmdArgs('--app');
  let entitySet = c3api.helper.cmdArgs('--entitySet');
  let localPath = c3api.helper.cmdArgs('--localPath');
  let deleteEntity = c3api.helper.cmdArgs('--deleteEntity');
  let truncateEntity = c3api.helper.cmdArgs('--truncateEntity');

  if (typeof app !== 'string') {
    app = DATAACCESS_MEDIA_APP;
  }
  if (typeof entitySet !== 'string') {
    entitySet = DATAACCESS_MEDIA_ENTITY;
  }
  if (typeof localPath !== 'string') {
    localPath = DATAACCESS_MEDIA_FOLDER;
  }

  return c3api.da
    .mediaLocalToRemote({ requestOptions, app, entitySet, localPath, deleteEntity, truncateEntity })
    .then(data => {
      if (c3api.helper.cmdArgs('--verbose')) {
        console.log(data);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

