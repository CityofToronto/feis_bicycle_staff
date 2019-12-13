/* exported oData__escapeValue */
function oData__escapeValue(value) {
  return value
    .replace(/'/g, "''")
    .replace(/%/g, '%25')
    .replace(/\+/g, '%2B')
    .replace(/\//g, '%2F')
    .replace(/\?/g, '%3F')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D')
    .replace(/\s/g, '%20');
}

/* exported oData__getErrorMessage */
function oData__getErrorMessage(jqXHR, errorThrown) {
  if (jqXHR) {
    if (jqXHR.responseJSON) {
      if (jqXHR.responseJSON.error && jqXHR.responseJSON.error.message) {
        return `An error occured. ${jqXHR.responseJSON.error.message}`;
      }
    } else if (jqXHR.responseText) {
      return `An error occured. ${jqXHR.responseText}`;
    }
  }

  return `An error occured. ${errorThrown}`;
}
