/* exported entityKeyfobNoteDetails__fields */
const entityKeyfobNoteDetails__fields = {
  keyfob: (auth) => ({
    title: 'Key Fob',
    bindTo: 'keyfob',
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
      url: '/* @echo C3DATA_KEYFOBS_URL */?$select=id,number&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_number = a.number.toLowerCase();
          const b_number = b.number.toLowerCase();
          if (a_number > b_number) {
            return 1;
          }
          if (a_number < b_number) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: item.number,
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
  }
};
