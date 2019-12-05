/* global $ */
/* global oData_getErrorMessage */

let auth__webStorage = localStorage;
let auth__webStorageKey = 'bicycle_auth';

let auth__url = '/* @echo C3auth__url */';
let auth__app = 'Bicycle Parking';
let auth__checkLoginInterval = 5 * 60000;

let auth__checkAccessUrl = '/* @echo C3CONFIG_ISAUTH */';

/* exported auth__init */
function auth__init(auth = {}) {
  try {
    const { sId, userId } = JSON.parse(auth__webStorage.getItem(auth__webStorageKey));
    auth.sId = sId;
    auth.userId = userId;
  } catch (error) {
    // Do nothing
  }

  return auth;
}

/* exported auth__login */
function auth__login(auth, user, pwd) {
  auth__logout(auth);

  return new Promise((resolve, reject) => {
    $.ajax(auth__url, {
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ app: auth__app, user, pwd }),
      dataType: 'json',
      method: 'POST',
    }).then(({ sid, userID } = {}) => {
      auth.sId = sid;
      auth.userId = userID;

      if (auth__webStorage && auth__webStorageKey) {
        auth__webStorage.setItem(auth__webStorageKey, JSON.stringify(auth));
      }

      resolve(auth);
    }, (jqXHR, textStatus, errorThrown) => {
      reject(oData_getErrorMessage(jqXHR, errorThrown));
    });
  });
}

/* exported auth__logout */
function auth__logout(auth = {}) {
  const { sId, userId } = auth;

  if (sId) {
    delete auth.sId;
    delete auth.userId;
    delete auth.lastChecked;

    if (auth__webStorage && auth__webStorageKey) {
      auth__webStorage.removeItem(auth__webStorageKey);
    }

    return new Promise((resolve, reject) => {
      $.ajax(`${auth__url}('${sId}')`, {
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

/* exported auth__checkLogin */
function auth__checkLogin(auth = {}, force = false) {
  if (force) {
    delete auth.lastChecked;
  }

  const { lastChecked, sId } = auth;

  if (sId) {
    const now = new Date();

    if (!lastChecked || (now.getTime() - lastChecked.getTime()) > auth__checkLoginInterval) {
      auth.lastChecked = now;

      return new Promise((resolve) => {
        $.ajax(`${auth__url}('${sId}')`).then(() => {
          resolve(true);
        }, () => {
          auth__logout(auth);
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

/* exported auth__checkAccess */
function auth__checkAccess(auth = {}, ApplicationName, Resource, Action) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        beforeSend: (jqXHR) => {
          if (isLoggedIn) {
            const { sId } = auth;
            jqXHR.setRequestHeader('Authorization', `AuthSession ${sId}`);
          }
        },
        contentType: 'application/json',
        data: JSON.stringify({ ApplicationName, Resource, Action }),
        method: 'POST',
        url: auth__checkAccessUrl
      }).then((data) => {
        const json = JSON.parse(data);
        resolve(json.Authorized === true);
      }, (jqXHR, textStatus, errorThrown) => {
        reject(oData_getErrorMessage(jqXHR, errorThrown));
      });
    });
  });
}
