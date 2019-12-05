/* exported query_objectToString */
function query_objectToString(obj) {
  return Object.keys(obj || {})
    .filter((key) => obj[key] != null)
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

/* exported query_stringToObject */
function query_stringToObject(str) {
  return (str || '').split('&').reduce((acc, cur) => {
    const [name, value] = cur.split('=');
    if (name && value) {
      acc[name] = decodeURIComponent(value);
    }
    return acc;
  }, {});
}
