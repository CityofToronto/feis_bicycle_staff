/* global moment */
/* global query__objectToString */

/* exported location_inspections_datatable_columns */
const location_inspections_datatable_columns = {
  action: (fragmentPrefix) => ({
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    render(data) {
      const href = `#${fragmentPrefix}/${data}?${query__objectToString({ resetState: 'yes' })}`;
      return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
    },
    searchable: false
  }),

  location: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location'
  },

  location__site_name: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location__site_name'
  },

  date: {
    title: 'Date',
    className: 'minWidth',
    data: 'date',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },

  result: (auth) => ({
    title: 'Result',
    className: 'minWidth',
    data: 'result',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_LOCATION_INSPECTION_CHOICES */'
    },
    render(data) {
      return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problems' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }),

  note: {
    title: 'Note',
    className: 'minWidthLarge',
    data: 'note',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  __CreatedOn: {
    title: 'Created On',
    className: 'minWidth',
    data: '__CreatedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },
  __ModifiedOn: {
    title: 'Modified On',
    className: 'minWidth',
    data: '__ModifiedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },
  __Owner: {
    title: 'Modified By',
    className: 'minWidth',
    data: '__Owner',
    type: 'string'
  },
  __Status: {
    title: 'Status',
    className: 'statusWidth',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: [{ text: 'Active' }, { text: 'Inactive' }],
    render(data) {
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }
};

/* exported location_inspection_form_sections */
const location_inspection_form_sections = (auth) => [
  {
    title: 'Details',

    rows: [
      {
        fields: [
          {
            title: 'Locker Location',
            bindTo: 'location',
            required: true,
            className: 'col-sm-8',
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
          }
        ]
      },
      {
        fields: [
          {
            title: 'Date',
            bindTo: 'date',
            required: true,
            className: 'col-sm-4',
            type: 'datetimepicker',
            options: {
              format: 'YYYY/MM/DD h:mm A'
            }
          },
          {
            title: 'Result',
            bindTo: 'result',
            required: true,
            className: 'col-sm-4',
            type: 'radio',
            choices: [{ text: 'Unknown' }, { text: 'OK' }, { text: 'Problems' }],
            orientation: 'horizontal'
          }
        ]
      },
      {
        fields: [
          {
            title: 'Note',
            bindTo: 'note',
            required: true,
            type: 'textarea',
            rows: 10
          }
        ]
      }
    ]
  }
];
