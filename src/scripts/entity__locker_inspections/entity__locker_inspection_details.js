/* exported entityLockerInspectionDetails__fields */
const entityLockerInspectionDetails__fields = {
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
      url: '/* @echo C3DATA_LOCKERS_URL */?$select=id,location__site_name,number&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_site_name = `${a.location__site_name} ${a.number}`.toLowerCase();
          const b_site_name = `${b.location__site_name} ${b.number}`.toLowerCase();
          if (a_site_name > b_site_name) {
            return 1;
          }
          if (a_site_name < b_site_name) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: `${item.location__site_name} ${item.number}`,
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
  result: (auth) => ({
    title: 'Result',
    bindTo: 'result',
    required: true,
    type: 'radio',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_LOCKER_INSPECTION_CHOICES */'
    },
    orientation: 'horizontal'
  }),
  note: {
    title: 'Note',
    bindTo: 'note',
    type: 'textarea',
    rows: 10
  }
};
