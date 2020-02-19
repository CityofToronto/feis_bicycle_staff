/* global entity__fields */

/* exported entityLocationInspectionDetails__fields */
const entityLocationInspectionDetails__fields = {
  location: ({ auth }) => ({
    title: 'Location',
    bindTo: 'location',
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
      url: '/* @echo C3DATA_LOCATIONS_URL */?$select=id,site_name&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_site_name = a.site_name.toLowerCase();
          const b_site_name = b.site_name.toLowerCase();
          if (a_site_name > b_site_name) {
            return 1;
          }
          if (a_site_name < b_site_name) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: item.site_name,
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
  result: ({ auth }) => ({
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
      url: '/* @echo C3DATAMEDIA_INSPECTION_CHOICES */'
    },
    orientation: 'horizontal'
  }),
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
