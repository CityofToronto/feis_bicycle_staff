/* exported query_objectToString */
function query_objectToString(obj) {
  return Object.keys(obj || {}).map((key) => {
    return `${key}=${encodeURIComponent(obj[key])}`;
  }).join('&');
}

/* exported query_stringToObject */
function query_stringToObject(str) {
  return (str || '').split('&').reduce((acc, cur) => {
    const [name, value] = cur.split('=');
    acc[name] = decodeURIComponent(value);
    return acc;
  }, {});
}
