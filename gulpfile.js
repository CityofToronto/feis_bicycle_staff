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
      C3DATA_LOCATION_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/location_notes',
      C3DATA_LOCATION_INSPECTIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/location_inspections',

      C3DATA_LOCKERS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/lockers',
      C3DATA_LOCKER_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/locker_notes',
      C3DATA_LOCKER_INSPECTIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/locker_inspections',

      C3DATA_STATIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/stations',
      C3DATA_STATION_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/station_notes',
      C3DATA_STATION_INSPECTIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/station_inspections',

      // C3DATA_KEYFOBS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/keyfobs',
      // C3DATA_KEYFOB_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/keyfob_notes',

      // C3DATA_CUSTOMERS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/customers',
      // C3DATA_CUSTOMER_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/customer_notes',
      // C3DATA_CUSTOMER_NOTIFICATIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/customer_inspections',

      // C3DATA_PAYMENTS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/payments',
      // C3DATA_PAYMENT_NOTES_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/payment_notes',
      // C3DATA_PAYMENT_NOTIFICATIONS_URL: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/payment_inspections',

      C3DATAMEDIA_LOCATION_INSPECTION_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'location_inspection_choices.json\\\')/$value',
      C3DATAMEDIA_LOCKER_INSPECTION_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'locker_inspection_choices.json\\\')/$value',
      C3DATAMEDIA_STATION_INSPECTION_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'station_inspection_choices.json\\\')/$value',
      C3DATAMEDIA_PROVINCE_CHOICES: 'https://config.cc.toronto.ca:49093/c3api_data/v2/DataAccess.svc/bicycle_parking/Media(\\\'province_choices.json\\\')/$value'
    },
    dev: {},
    qa: {},
    prod: {}
  }
});

////////////////////////////////////////////////////////////////////////////////

const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const jsonMinify = require('gulp-jsonminify');

gulp.task('c3api_cleanup', () => {
  return del('c3apis');
});

gulp.task('c3api_build_js', ['c3api_cleanup'], () => {
  return gulp.src('src/c3apis/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: ['babel-preset-env'] }))
    .pipe(gulp.dest('c3apis'));
});

gulp.task('c3api_build_others', ['c3api_cleanup'], () => {
  return gulp.src(['src/c3apis/**/*.*', '!src/c3apis/**/*.js'])
    .pipe(gulp.dest('c3apis'));
});

gulp.task('c3api_build', ['c3api_build_js', 'c3api_build_others']);

gulp.task('c3api_build_js_minify', ['c3api_cleanup'], () => {
  return gulp.src('src/c3apis/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: ['babel-preset-env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('c3apis'));
});

gulp.task('c3api_build_json_minify', ['c3api_cleanup'], () => {
  return gulp.src(['src/c3apis/**/*.json'])
    .pipe(jsonMinify())
    .pipe(gulp.dest('c3apis'));
});

gulp.task('c3api_build_minify', ['c3api_build_js_minify', 'c3api_build_json_minify', 'c3api_build_others']);

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

