/* global $ moment */

/* exported location_notes_datatable_columns */
const location_notes_datatable_columns = () => ({
  action: {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    searchable: false
  },

  location: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location'
  },
  date: {
    title: 'Date',
    className: 'minWidth',
    data: 'date',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD');
      } else {
        return '';
      }
    }
  },
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

  location__site_name: {
    title: 'Locker Location',
    className: 'minWidth',
    data: 'location__site_name'
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
});

/* exported location_note_form_sections */
const location_note_form_sections = (auth) => [
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
                  }
                });
              }
              return [];
            },
            postRender({ model, field }) {
              function displayHandler() {
                if (model.isNew()) {
                  $(`#${field.id}Element`).removeClass('hide');
                } else {
                  $(`#${field.id}Element`).addClass('hide');
                }
              }
              displayHandler();
              model.on(`change:${model.idAttribute}`, displayHandler);
            }
          },
          {
            title: 'Locker Location',
            bindTo: 'location__site_name',
            required: true,
            className: 'col-sm-8',
            type: 'text',
            htmlAttr: { readonly: true },
            postRender({ model, field }) {
              function valueHandler() {
                $(`#${field.id}`).val(model.get(field.bindTo));
              }
              valueHandler();
              model.on(`change:${field.bindTo}`, valueHandler);

              function displayHandler() {
                if (model.isNew()) {
                  $(`#${field.id}Element`).addClass('hide');
                } else {
                  $(`#${field.id}Element`).removeClass('hide');
                }
              }
              displayHandler();
              model.on(`change:${model.idAttribute}`, displayHandler);
            }
          },
          {
            title: 'Date',
            bindTo: 'date',
            required: true,
            className: 'col-sm-4',
            type: 'datetimepicker',
            options: {
              format: 'YYYY/MM/DD'
            }
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
