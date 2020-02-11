/* global $ moment */
/* global ajaxes */

/* exported entityCustomerDetails__fields */
const entityCustomerDetails__fields = {
  first_name: {
    title: 'First Name',
    bindTo: 'first_name',
    required: true,
    type: 'text'
  },
  last_name: {
    title: 'Last Name',
    bindTo: 'last_name',
    required: true,
    type: 'text'
  },
  title: {
    title: 'Title',
    bindTo: 'title',
    type: 'text'
  },

  email: {
    title: 'Email',
    bindTo: 'email',
    type: 'email'
  },
  primary_phone: {
    title: 'Primary Phone',
    bindTo: 'primary_phone',
    type: 'phone'
  },
  alternate_phone: {
    title: 'Alternate Phone',
    bindTo: 'alternate_phone',
    type: 'phone'
  },

  civic_address: {
    title: 'Street Address',
    bindTo: 'civic_address'
  },
  municipality: {
    title: 'City',
    bindTo: 'municipality'
  },
  province: (auth) => ({
    title: 'Province',
    bindTo: 'province',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
    },
  }),
  postal_code: {
    title: 'Postal Code',
    bindTo: 'postal_code'
  },

  bicycle_1_make: {
    title: 'Bicycle 1 Make',
    bindTo: 'bicycle_1_make'
  },
  bicycle_1_model: {
    title: 'Bicycle 1 Model',
    bindTo: 'bicycle_1_model'
  },
  bicycle_1_colour: {
    title: 'Bicycle 1 Colour',
    bindTo: 'bicycle_1_colour'
  },
  bicycle_2_make: {
    title: 'Bicycle 2 Make',
    bindTo: 'bicycle_2_make'
  },
  bicycle_2_model: {
    title: 'Bicycle 2 Model',
    bindTo: 'bicycle_2_model'
  },
  bicycle_2_colour: {
    title: 'Bicycle 2 Colour',
    bindTo: 'bicycle_2_colour'
  },

  request_type: (auth) => ({
    title: 'Request Type',
    bindTo: 'request_type',
    required: false,
    type: 'dropdown',
    choices: [{ text: 'Bicycle Lockers' }, { text: 'Bicycle Stations' }],

    postRender: ({ field, section, model } = {}) => {
      const $element = $(`#${field.id}`);
      section.$requestTypeElement = $element;

      $element.on('init change', () => {
        switch (model.get('request_type')) {
          case 'Bicycle Lockers':
            ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: '/* @echo C3DATA_LOCATIONS_URL */?$orderby=site_name'
            }).then(({ data }) => {
              const locationOptions = `
                <option value="">- Select -</option>
                ${data.value.map((location) => `<option value="${location.id}">${location.site_name} - 0 available (of ${location.lockers_total})</option>`).join('')}
              `;

              const ids = data.value.map((location) => location.id);

              const choice1 = model.get('request_locker_choice_1');
              const choice1Options = choice1 && ids.indexOf(choice1) == -1
                ? `<option value="${choice1}">${choice1}</option>${locationOptions}`
                : locationOptions;
              section.$requestChoice1Element.html(choice1Options);
              if (choice1) {
                section.$requestChoice1Element.val(choice1);
              } else {
                section.$requestChoice1Element.val('');
              }

              const choice2 = model.get('request_locker_choice_2');
              const choice2Options = choice2 && ids.indexOf(choice2) == -1
                ? `<option value="${choice2}">${choice2}</option>${locationOptions}`
                : locationOptions;
              section.$requestChoice2Element.html(choice2Options);
              if (choice2) {
                section.$requestChoice2Element.val(choice2);
              } else {
                section.$requestChoice2Element.val('');
              }

              const choice3 = model.get('request_locker_choice_3');
              const choice3Options = choice3 && ids.indexOf(choice3) == -1
                ? `<option value="${choice3}">${choice3}</option>${locationOptions}`
                : locationOptions;
              section.$requestChoice3Element.html(choice3Options);
              if (choice3) {
                section.$requestChoice3Element.val(choice3);
              } else {
                section.$requestChoice3Element.val('');
              }

              section.$requestChoice1Element.trigger('init');
              section.$requestChoice2Element.trigger('init');
              section.$requestChoice3Element.trigger('init');
            });
            break;

          case 'Bicycle Stations':
            ajaxes({
              beforeSend(jqXHR) {
                if (auth && auth.sId) {
                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                }
              },
              contentType: 'application/json; charset=utf-8',
              method: 'GET',
              url: '/* @echo C3DATA_STATIONS_URL */?$orderby=site_name'
            }).then(({ data }) => {
              const stationOptions = `
                <option value="">- Select -</option>
                ${data.value.map((station) => `<option value="${station.id}">${station.site_name}</option>`).join('')}
              `;

              const ids = data.value.map((station) => station.id);

              const choice1 = model.get('request_station_choice_1');
              const choice1Options = choice1 && ids.indexOf(choice1) == -1
                ? `<option value="${choice1}">${choice1}</option>${stationOptions}`
                : stationOptions;
              section.$requestChoice1Element.html(choice1Options);
              if (choice1) {
                section.$requestChoice1Element.val(choice1);
              } else {
                section.$requestChoice1Element.val('');
              }

              const choice2 = model.get('request_station_choice_2');
              const choice2Options = choice2 && ids.indexOf(choice2) == -1
                ? `<option value="${choice2}">${choice2}</option>${stationOptions}`
                : stationOptions;
              section.$requestChoice2Element.html(choice2Options);
              if (choice2) {
                section.$requestChoice2Element.val(choice2);
              } else {
                section.$requestChoice2Element.val('');
              }

              const choice3 = model.get('request_station_choice_3');
              const choice3Options = choice3 && ids.indexOf(choice3) == -1
                ? `<option value="${choice3}">${choice3}</option>${stationOptions}`
                : stationOptions;
              section.$requestChoice3Element.html(choice3Options);
              if (choice3) {
                section.$requestChoice3Element.val(choice3);
              } else {
                section.$requestChoice3Element.val('');
              }

              section.$requestChoice1Element.trigger('init');
              section.$requestChoice2Element.trigger('init');
              section.$requestChoice3Element.trigger('init');
            });
            break;

          default:
            section.$requestChoice1Element.html('<option value="">- Select a Request Type -</option>');
            section.$requestChoice2Element.html('<option value="">- Select a Request Type -</option>');
            section.$requestChoice3Element.html('<option value="">- Select a Request Type -</option>');

            section.$requestChoice1Element.trigger('init');
            section.$requestChoice2Element.trigger('init');
            section.$requestChoice3Element.trigger('init');
        }
      });
    }
  }),
  choice_1: {
    title: 'Choice 1',
    required: false,
    type: 'dropdown',
    choices: [{ text: '- Select a Request Type -', value: '' }],

    postRender: ({ field, section, model, formValidator }) => {
      const $element = $(`#${field.id}`);
      section.$requestChoice1Element = $element;

      $element.on('init', () => {
        if ($element.val()) {
          formValidator.validateField(field.id);
        } else {
          formValidator.updateStatus(field.id, 'NOT_VALIDATED');
        }
      });

      $element.on('init change', () => {
        const val = $element.val();
        switch (model.get('request_type')) {
          case 'Bicycle Lockers':
            if (val) {
              model.set('request_locker_choice_1', val);
            } else {
              model.unset('request_locker_choice_1');
            }
            break;

          case 'Bicycle Stations':
            if (val) {
              model.set('request_station_choice_1', val);
            } else {
              model.unset('request_station_choice_1');
            }
            break;
        }
      });
    }
  },
  choice_2: {
    title: 'Choice 2',
    required: false,
    type: 'dropdown',
    choices: [{ text: '- Select a Request Type -', value: '' }],

    postRender: ({ field, section, model, formValidator }) => {
      const $element = $(`#${field.id}`);
      section.$requestChoice2Element = $element;

      $element.on('init', () => {
        formValidator.updateStatus(field.id, 'NOT_VALIDATED');
      });

      $element.on('init change', () => {
        const val = $element.val();
        switch (model.get('request_type')) {
          case 'Bicycle Lockers':
            if (val) {
              model.set('request_locker_choice_2', val);
            } else {
              model.unset('request_locker_choice_2');
            }
            break;

          case 'Bicycle Stations':
            if (val) {
              model.set('request_station_choice_2', val);
            } else {
              model.unset('request_station_choice_2');
            }
            break;
        }
      });
    }
  },
  choice_3: {
    title: 'Choice 3',
    required: false,
    type: 'dropdown',
    choices: [{ text: '- Select a Request Type -', value: '' }],

    postRender: ({ field, section, model, formValidator }) => {
      const $element = $(`#${field.id}`);
      section.$requestChoice3Element = $element;

      $element.on('init', () => {
        formValidator.updateStatus(field.id, 'NOT_VALIDATED');
      });

      $element.on('init change', () => {
        const val = $element.val();
        switch (model.get('request_type')) {
          case 'Bicycle Lockers':
            if (val) {
              model.set('request_locker_choice_3', val);
            } else {
              model.unset('request_locker_choice_3');
            }
            break;

          case 'Bicycle Stations':
            if (val) {
              model.set('request_station_choice_3', val);
            } else {
              model.unset('request_station_choice_3');
            }
            break;
        }
      });
    }
  },

  subscription_type: {
    title: 'Subscription Type',
    bindTo: 'subscription_type',
    type: 'dropdown',
    choices: [{ text: 'Bicycle Locker' }, { text: 'Bicycle Station' }]
  },

  subscription_start_date: {
    title: 'Subscription Start Date',
    bindTo: 'subscription_start_date',
    type: 'datetimepicker'
  },
  subscription_expiration_date: {
    title: 'Subscription Expiration Date',
    bindTo: 'subscription_expiration_date',
    type: 'datetimepicker'
  },
  subscription_end_date: {
    title: 'Subscription End Date',
    bindTo: 'subscription_end_date',
    type: 'datetimepicker'
  },

  location: (auth) => ({
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
      url: '/* @echo C3DATA_LOCATIONS_URL */?$orderby=site_name'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({
        text: value.site_name,
        value: value.id
      }));
    }
  }),

  locker: {
    title: 'Locker',
    bindTo: 'locker',
    required: true,
    type: 'dropdown',
    choices: []
  },

  locker_key_date_assigned: {
    title: 'Locker Key Assigned Date',
    bindTo: 'locker_key_date_assigned',
    type: 'datetimepicker'
  },
  locker_key_date_returned: {
    title: 'Locker Key Return Date',
    bindTo: 'locker_key_date_returned',
    type: 'datetimepicker'
  },

  station: (auth) => ({
    title: 'Station',
    bindTo: 'station',
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
      url: '/* @echo C3DATA_STATIONS_URL */?$orderby=site_name'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name, value: value.id }));
    }
  }),

  // keyfob: (auth) => ({
  //   title: 'Key Fob',
  //   bindTo: 'keyfob',
  //   type: 'dropdown',
  //   choices: {
  //     beforeSend(jqXHR) {
  //       if (auth && auth.sId) {
  //         jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
  //       }
  //     },
  //     contentType: 'application/json; charset=utf-8',
  //     method: 'GET',
  //     url: '/* @echo C3DATA_STATIONS_URL */?$orderby=number'
  //   },
  //   // choicesMap: (data) => {
  //   //   return data.value.map((value) => ({ text: value.number })).sort((a, b) => {
  //   //     if (a.text > b.text) {
  //   //       return 1;
  //   //     }
  //   //     if (a.text < b.text) {
  //   //       return -1;
  //   //     }
  //   //     return 0;
  //   //   });
  //   // }
  //   choicesMap: (data) => {
  //     return data.value.map((value) => ({ text: value.number, value: value.id }));
  //   }
  // }),

  keyfob_date_assigned: {
    title: 'Key Fob Assigned Date',
    bindTo: 'keyfob_date_assigned',
    type: 'datetimepicker'
  },
  keyfob_date_returned: {
    title: 'Key Fob Return Date',
    bindTo: 'keyfob_date_returned',
    type: 'datetimepicker'
  },



  latest_note__date: (model) => ({
    title: 'Latest Note Date',
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('latest_note__date'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:latest_note__date`, handler);
      handler();
    }
  }),
  latest_note__note: (model) => ({
    title: 'Latest Note',
    type: 'textarea',
    rows: 5,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_note__note'));
      }
      model.on('change:latest_note__note', handler);
      handler();
    }
  }),

  id: (model) => ({
    title: 'ID',
    required: true,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('id'));
      }
      model.on('change:id', handler);
      handler();
    }
  }),
  __Status: (auth, model) => ({
    title: 'Status',
    bindTo: '__Status',
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
      url: '/* @echo C3DATAMEDIA_STATUS_CHOICES */'
    },
    orientation: 'horizontal',
    postRender({ field }) {
      function handler() {
        $(`#${field.id}Element input[type="radio"][value="${model.get(field.bindTo)}"]`).prop('checked', true);
      }
      model.on('change:__Status', handler);
    }
  }),
  __CreatedOn: (model) => ({
    title: 'Created On',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('__CreatedOn'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:__CreatedOn`, handler);
      handler();
    }
  }),
  __ModifiedOn: (model) => ({
    title: 'Modified On',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('__ModifiedOn'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:__ModifiedOn`, handler);
      handler();
    }
  }),
  __Owner: (model) => ({
    title: 'Modified By',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('__Owner'));
      }
      model.on('change:__Owner', handler);
      handler();
    }
  })
};
