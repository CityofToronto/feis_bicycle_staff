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
    },
    dev: {},
    qa: {},
    prod: {}
  }
});

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

