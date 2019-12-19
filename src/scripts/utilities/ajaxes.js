/* global $ */

const ajaxes__requests = [];
let ajaxes__activeCounter = 0;

/* exported ajaxes */
function ajaxes(options) {
  if (Array.isArray(options)) {
    return Promise.all(options.map((option) => ajaxes(option)));
  }

  let promise;

  if (options) {
    promise = new Promise((resolve, reject) => {
      ajaxes__requests.push(() => {
        ajaxes__activeCounter++;
        $.ajax(options).then((data, textStatus, jqXHR) => {
          ajaxes__activeCounter--;
          resolve({ data, textStatus, jqXHR });
          ajaxes();
        }, (jqXHR, textStatus, errorThrown) => {
          ajaxes__activeCounter--;
          ajaxes();
          reject({ jqXHR, textStatus, errorThrown });
        });
      });
    });
  }

  if (ajaxes__activeCounter !== 3 && ajaxes__requests.length > 0) {
    (ajaxes__requests.shift())();
  }

  return promise;
}
