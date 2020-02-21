/* global entity__fields */

/* exported lockerNotesEntity__fields */
const lockerNotesEntity__fields = {
  locker: (auth) => ({
    title: 'Locker',
    bindTo: 'locker',
    required: true,
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_LOCKERS_URL */?$select=id,number&$filter=__Status eq \'Active\'&$orderby=tolower(number)'
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.map((item) => {
          return {
            text: `${item.number}`,
            value: item.id
          };
        });
      }
      return [];
    }
  }),

  date: {
    title: 'Date',
    bindTo: 'date',
    required: true,
    type: 'datetimepicker',
    options: {
      format: 'YYYY/MM/DD h:mm A'
    }
  },
  note: {
    title: 'Note',
    bindTo: 'note',
    type: 'textarea',
    rows: 10
  },

  id: entity__fields.id,
  __Status: entity__fields.__Status,
  __CreatedOn: entity__fields.__CreatedOn,
  __ModifiedOn: entity__fields.__ModifiedOn,
  __Owner: entity__fields.__Owner
};
