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
