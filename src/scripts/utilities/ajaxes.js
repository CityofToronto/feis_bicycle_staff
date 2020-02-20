/* global $ */

const AJAXES__DEFAULT_WEBSTORAGE = null;
const AJAXES__DEFAULT_WEBSTORAGE_KEY_PREFIX = 'ajaxes -> ';

const AJAXES__WEBSTORAGE_DURATION = 5 * 60 * 1000;
const AJAXES__REQUEST_MAX_ACTIVE = 100;

const ajaxes__requests = [];

let ajaxes__activeCounter = 0;

/* exported ajaxes */
function ajaxes(options) {
  if (Array.isArray(options)) {
    return Promise.all(options.map((option) => ajaxes(option)));
  }

  let promise;

  if (options) {
    const {
      method,
      webStorage = AJAXES__DEFAULT_WEBSTORAGE,
      webStorageKeyPrefix = AJAXES__DEFAULT_WEBSTORAGE_KEY_PREFIX
    } = options;

    if ((!method || method === 'GET') && webStorage && webStorageKeyPrefix) {
      try {
        const webStorageKey = `${webStorageKeyPrefix}${options.url}`;
        const { timestamp, data } = JSON.parse(webStorage.getItem(webStorageKey));
        const now = (new Date()).getTime();
        if (now - timestamp <= AJAXES__WEBSTORAGE_DURATION) {
          return Promise.resolve({ data });
        } else {
          webStorage.remove(webStorageKey);
        }
      } catch (error) {
        // Do nothing
      }
    }

    promise = new Promise((resolve, reject) => {
      ajaxes__requests.push(() => {
        ajaxes__activeCounter++;
        $.ajax(options).then((data, textStatus, jqXHR) => {
          if ((!method || method === 'GET') && webStorage && webStorageKeyPrefix) {
            const webStorageKey = `${webStorageKeyPrefix}${options.url}`;
            const timestamp = (new Date()).getTime();
            webStorage.setItem(webStorageKey, JSON.stringify({ timestamp, data }));
          }

          ajaxes__activeCounter--;
          ajaxes();
          resolve({ data, textStatus, jqXHR });
        }, (jqXHR, textStatus, errorThrown) => {
          ajaxes__activeCounter--;
          ajaxes();
          reject({ jqXHR, textStatus, errorThrown });
        });
      });
    });
  }

  if (ajaxes__activeCounter !== AJAXES__REQUEST_MAX_ACTIVE && ajaxes__requests.length > 0) {
    (ajaxes__requests.shift())();
  }

  return promise;
}
