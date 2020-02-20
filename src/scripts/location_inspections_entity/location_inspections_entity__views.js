/* global ajaxes query__objectToString */
/* global locationInspectionsEntity__columns */

/* exported locationInspectionsEntity__views */
const locationInspectionsEntity__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locker Location Inspections',
    fragment: 'entities/location_inspections/all',
    stateSaveWebStorageKey: 'entity_location_inspections_all',

    definition(auth) {
      return {
        columns: Object.keys(locationInspectionsEntity__columns).map(
          (key) => typeof locationInspectionsEntity__columns[key] === 'function'
            ? locationInspectionsEntity__columns[key]({ auth, fragment: this.fragment })
            : locationInspectionsEntity__columns[key]
        ),

        order: [[1, 'asc']],

        searchCols: [],

        ajaxCore(data, callback, settings, queryObject, url, options = {}) {
          const { auth } = options;

          return ajaxes({
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            },
            contentType: 'application/json; charset=utf-8',
            method: 'GET',
            url: `${url}?${query__objectToString(queryObject)}`
          }).then(({ data: response }) => {
            response.value.forEach((locationNote) => {
              locationNote.calc_location_site_name = null;
            });

            const promises = [];

            const locations = response.value.map(({ location }) => location)
              .filter((location, index, array) => array.indexOf(location) === index);

            if (locations.length > 0) {
              const filter = encodeURIComponent(locations.map((id) => `id eq '${id}'`).join(' or '));
              promises.push(ajaxes({
                beforeSend(jqXHR) {
                  if (auth && auth.sId) {
                    jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                  }
                },
                contentType: 'application/json; charset=utf-8',
                method: 'GET',
                url: `/* @echo C3DATA_LOCATIONS_URL */?$filter=${filter}`,
              }).then(({ data: response2 }) => {
                const locationMap = response2.value.reduce((acc, { id, site_name }) => {
                  acc[id] = site_name;
                  return acc;
                }, {});

                response.value.forEach((locationNote) => {
                  locationNote.calc_location_site_name = locationMap[locationNote.location];
                });
              }));
            }

            Promise.all(promises).then(() => {
              callback({
                data: response.value,
                draw: data.draw,
                recordsTotal: response['@odata.count'],
                recordsFiltered: response['@odata.count']
              });
            });
          }).catch((error) => {
            callback({ data: [], draw: data.draw, recordsTotal: 0, recordsFiltered: 0 });
            throw error;
          });
        }
      };
    }
  }
};
