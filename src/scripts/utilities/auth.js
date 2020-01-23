/* global ajaxes */

const AUTH__DEFAULT_WEBSTORAGE = localStorage;
const AUTH__DEFAULT_WEBSTORAGE_KEY = 'auth';

const AUTH__DEFAULT_APP = 'cotApp';
const AUTH__DEFAULT_LOGIN_INTERVAL = 5 * 60000;

/* exported auth__init */
function auth__init(auth = {}) {
  const {
    webStorage = AUTH__DEFAULT_WEBSTORAGE,
    webStorageKey = AUTH__DEFAULT_WEBSTORAGE_KEY
  } = auth;
  try {
    const { sId, userId } = JSON.parse(webStorage.getItem(webStorageKey));
    auth.sId = sId;
    auth.userId = userId;
  } catch (error) {
    // Do nothing
  }

  return auth;
}

/* exported auth__login */
function auth__login(auth, user, pwd) {
  const {
    app = AUTH__DEFAULT_APP,
    url,
    webStorage = AUTH__DEFAULT_WEBSTORAGE,
    webStorageKey = AUTH__DEFAULT_WEBSTORAGE_KEY
  } = auth;

  return auth__logout(auth).then(() => {
    return ajaxes({
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ app, user, pwd }),
      dataType: 'json',
      method: 'POST',
      url,
      webStorage: null
    }).then((result) => {
      const { data: { sid, userID } } = result;

      auth.sId = sid;
      auth.userId = userID;
      webStorage.setItem(webStorageKey, JSON.stringify(auth));

      return result;
    });
  });
}

/* exported auth__logout */
function auth__logout(auth = {}) {
  const {
    sId,
    url,
    userId,
    webStorage = AUTH__DEFAULT_WEBSTORAGE,
    webStorageKey = AUTH__DEFAULT_WEBSTORAGE_KEY
  } = auth;

  if (sId) {
    delete auth.sId;
    delete auth.userId;
    delete auth.lastChecked;

    webStorage.removeItem(webStorageKey);

    return ajaxes({
      headers: { Authorization: userId },
      method: 'DELETE',
      url: `${url}('${sId}')`,
      webStorage: null
    }).catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });
  } else {
    return Promise.resolve();
  }
}

/* exported auth__checkLogin */
function auth__checkLogin(auth = {}, options = {}) {
  const { force = false } = options;
  if (force) {
    delete auth.lastChecked;
  }

  const {
    checkLoginInterval = AUTH__DEFAULT_LOGIN_INTERVAL,
    lastChecked,
    url,
    sId
  } = auth;

  if (sId) {
    const now = new Date();
    if (!lastChecked || (now.getTime() - lastChecked.getTime()) > checkLoginInterval) {
      auth.lastChecked = now;

      return ajaxes({
        method: 'GET',
        url: `${url}('${sId}')`,
        webStorage: null
      }).then(() => {
        return true;
      }, () => {
        return auth__logout(auth).then(() => {
          return false;
        });
      });
    } else {
      return Promise.resolve(true);
    }
  } else {
    return Promise.resolve(false);
  }
}

/* exported auth__checkAccess */
function auth__checkAccess(auth = {}, applicationName, resource, action) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    const { checkAccessUrl, sId } = auth;
    return ajaxes({
      beforeSend: (jqXHR) => {
        if (isLoggedIn) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${sId}`);
        }
      },
      contentType: 'application/json',
      data: JSON.stringify({ ApplicationName: applicationName, Resource: resource, Action: action }),
      method: 'POST',
      url: checkAccessUrl,
      webStorage: null
    }).then(({ data = {} }) => {
      const { Authorized } = data;
      return Authorized;
    }, (error) => {
      return error;
    });
  });
}
