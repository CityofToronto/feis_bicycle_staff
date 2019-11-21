/* global $ */
/* global oData_getErrorMessage */

const AUTH_WEBSTORAGE = localStorage;
const AUTH_WEBSTORAGE_KEY = 'bicycle_auth';

const AUTH_URL = '/* @echo C3AUTH_URL */';
const AUTH_APPNAME = 'Bicycle Parking';

/* exported auth_init */
function auth_init(auth = {}) {
  try {
    const data = JSON.parse(AUTH_WEBSTORAGE.getItem(AUTH_WEBSTORAGE_KEY));
    auth.sId = data.sId;
    auth.userId = data.userId;
  } catch (error) {
    // Do nothing
  }

  return auth;
}

/* exported auth_login */
function auth_login(auth, user, pwd) {
  auth_logout(auth);

  return new Promise((resolve, reject) => {
    $.ajax(AUTH_URL, {
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ app: AUTH_APPNAME, user, pwd }),
      dataType: 'json',
      method: 'POST',
    }).then((data) => {
      auth.sId = data.sid;
      auth.userId = data.userID;

      AUTH_WEBSTORAGE.setItem(AUTH_WEBSTORAGE_KEY, JSON.stringify(auth));

      resolve(data);
    }, (jqXHR, textStatus, errorThrown) => {
      reject(oData_getErrorMessage(jqXHR, errorThrown));
    });
  });
}

/* exported auth_logout */
function auth_logout(auth = {}) {
  const { sId, userId } = auth;

  if (sId) {
    delete auth.sId;
    delete auth.userId;
    delete auth.lastChecked;

    AUTH_WEBSTORAGE.removeItem(AUTH_WEBSTORAGE_KEY);

    return new Promise((resolve, reject) => {
      $.ajax(`${AUTH_URL}('${sId}')`, {
        headers: { Authorization: userId },
        method: 'DELETE'
      }).then((data) => {
        resolve(data);
      }, (jqXHR, textStatus, errorThrown) => {
        reject(oData_getErrorMessage(jqXHR, errorThrown));
      });
    });
  } else {
    return Promise.resolve();
  }
}

/* exported auth_checkLogin */
function auth_checkLogin(auth = {}, force = false) {
  if (force) {
    delete auth.lastChecked;
  }

  const { lastChecked, sId } = auth;

  if (sId) {
    const now = new Date();
    if (!lastChecked || (now.getTime() - lastChecked.getTime()) > (5 * 60000)) {
      auth.lastChecked = now;
      return new Promise((resolve) => {
        $.ajax(`${AUTH_URL}('${sId}')`).then(() => {
          resolve(true);
        }, () => {
          auth_logout(auth);
          resolve(false);
        });
      });
    } else {
      return Promise.resolve(true);
    }
  } else {
    return Promise.resolve(false);
  }
}
