/* global ajaxes query__objectToString */
/* global lockerNotesEntity__columns */

/* exported lockerNotesEntity__views */
const lockerNotesEntity__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locker Notes',
    fragment: 'entities/locker_notes/all',
    stateSaveWebStorageKey: 'entity_locker_notes_all',

    definition(auth) {
      return {
        columns: Object.keys(lockerNotesEntity__columns).map(
          (key) => typeof lockerNotesEntity__columns[key] === 'function'
            ? lockerNotesEntity__columns[key]({ auth, fragment: this.fragment })
            : lockerNotesEntity__columns[key]
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
            response.value.forEach((lockerNote) => {
              lockerNote.calc_locker_number = null;
            });

            const promises = [];

            const lockers = response.value.map(({ locker }) => locker)
              .filter((locker, index, array) => array.indexOf(locker) === index);

            if (lockers.length > 0) {
              const filter = encodeURIComponent(lockers.map((id) => `id eq '${id}'`).join(' or '));
              promises.push(ajaxes({
                beforeSend(jqXHR) {
                  if (auth && auth.sId) {
                    jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                  }
                },
                contentType: 'application/json; charset=utf-8',
                method: 'GET',
                url: `/* @echo C3DATA_LOCKERS_URL */?$filter=${filter}`,
              }).then(({ data: response2 }) => {
                const lockerNoteMap = response2.value.reduce((acc, { id, number }) => {
                  acc[id] = number;
                  return acc;
                }, {});

                response.value.forEach((lockerNote) => {
                  lockerNote.calc_locker_number = lockerNoteMap[lockerNote.locker];
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
