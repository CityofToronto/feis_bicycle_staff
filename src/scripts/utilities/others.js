/* global $ */

/* exported deepCloneObject */
function deepCloneObject(obj) {
  if (Array.isArray(obj)) {
    obj = Array.from(obj);
    obj.forEach((item) => {
      return deepCloneObject(item);
    });
  } else if (typeof obj === 'object' && obj) {
    obj = Object.assign({}, obj);
    for (const key in obj) {
      obj[key] = deepCloneObject(obj[key]);
    }
  }

  return obj;
}

/* exported fixButtonLinks */
function fixButtonLinks($container) {
  $container.find('a.btn:not([role="button"])')
    .attr('role', 'button')
    .on('keydown', (event) => {
      if (event.which === 32) {
        event.preventDefault();
        event.target.click();
      }
    });
}

/* exported functionToValue */
function functionToValue(value, ...args) {
  if (typeof value === 'function') {
    return value(...args);
  }
  return value;
}

/* exported loadScripts */
function loadScripts(...urls) {
  return Promise.all(urls.map((url) => {
    if (document.querySelectorAll(`script[src="${url}"]`).length > 0) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.setAttribute('src', url);
      script.onerror = () => { reject(); };
      script.onload = () => { resolve(); };
      script.onreadystatechange = () => resolve();

      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }));
}

/* exported stringToFunction */
function stringToFunction(str) {
  if (typeof str !== 'string') {
    return str;
  }

  if (str.indexOf('function(') === 0) {
    return Function(`return ${str}`)();
  } else if (typeof window[str] === 'function') {
    return window[str];
  }

  return null;
}

/* exported ajaxes */
function ajaxes(options) {
  if (Array.isArray(options)) {
    return Promise.all(options.map((option) => ajaxes(option)));
  }

  let promise;

  if (options) {
    promise = new Promise((resolve, reject) => {
      ajaxes.requests.push(() => {
        ajaxes.active++;
        setTimeout(() => {
          $.ajax(options).then((data, textStatus, jqXHR) => {
            ajaxes.active--;
            resolve({ data, textStatus, jqXHR });
            ajaxes();
          }, (jqXHR, textStatus, errorThrown) => {
            ajaxes.active--;
            ajaxes();
            reject({ jqXHR, textStatus, errorThrown });
          });
        }, ajaxes.DELAY);
      });
    });
  }

  if (ajaxes.active !== ajaxes.MAX && ajaxes.requests.length > 0) {
    (ajaxes.requests.shift())();
  }

  return promise;
}

ajaxes.requests = [];
ajaxes.active = 0;
ajaxes.MAX = 3;
ajaxes.DELAY = 0;
