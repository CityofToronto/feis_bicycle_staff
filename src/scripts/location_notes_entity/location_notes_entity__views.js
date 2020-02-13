/* global ajaxes query__objectToString */
/* global locationNotesEntity__columns */

/* exported locationNotesEntity__views */
const locationNotesEntity__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Location Notes',
    fragment: 'entities/location_notes/all',
    stateSaveWebStorageKey: 'entity_location_notes_all',

    definition: (auth) => ({
      columns: Object.keys(locationNotesEntity__columns).map(
        (key) => typeof locationNotesEntity__columns[key] === 'function'
          ? locationNotesEntity__columns[key]({ auth, view: this })
          : locationNotesEntity__columns[key]
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
            promises.push(() => {
              const filter = encodeURIComponent(locations.map((id) => `id eq '${id}'`).join(' or '));
              return ajaxes({
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
              });
            });
          }

          promises.then(() => {
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
    })
  }
};
