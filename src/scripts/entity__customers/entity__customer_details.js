/* global $ moment */

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

  request_type: {
    title: 'Request Type',
    bindTo: 'request_type',
    required: true,
    type: 'dropdown',
    choices: [{ text: 'Bicycle Lockers' }, { text: 'Bicycle Stations' }]
  },

  request_locker_choice_1: (auth) => ({
    title: 'Bicycle Locker (Choice 1)',
    bindTo: 'request_locker_choice_1',
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
      url: '/* @echo C3DATA_LOCATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),
  request_locker_choice_2: (auth) => ({
    title: 'Bicycle Locker (Choice 2)',
    bindTo: 'request_locker_choice_2',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_LOCATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),
  request_locker_choice_3: (auth) => ({
    title: 'Bicycle Locker (Choice 3)',
    bindTo: 'request_locker_choice_3',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_LOCATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),
  request_station_choice_1: (auth) => ({
    title: 'Bicycle 2 Make',
    bindTo: 'Bicycle Station (Choice 1)',
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
      url: '/* @echo C3DATA_STATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),
  request_station_choice_2: (auth) => ({
    title: 'Bicycle 2 Model',
    bindTo: 'Bicycle Station (Choice 2)',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_STATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),
  request_station_choice_3: (auth) => ({
    title: 'Bicycle Station (Choice 3)',
    bindTo: 'request_station_choice_3',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_STATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),

  subscription_type: {
    title: 'Subscription Type',
    bindTo: 'subscription_type',
    type: 'dropdown',
    choices: [{ text: 'Bicycle Lockers' }, { text: 'Bicycle Stations' }]
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
      url: '/* @echo C3DATA_LOCATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
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
    bindTo: 'locker_kelocker_key_date_returnedy_date_returned',
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
      url: '/* @echo C3DATA_STATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.site_name })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),

  keyfob: (auth) => ({
    title: 'Key Fob',
    bindTo: 'keyfob',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_STATIONS_URL */'
    },
    choicesMap: (data) => {
      return data.value.map((value) => ({ text: value.number })).sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
  }),

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
  })
};
