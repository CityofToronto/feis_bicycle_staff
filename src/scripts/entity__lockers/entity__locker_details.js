/* global $ moment */

/* exported entityLocationDetails__fields */
const entityLocationDetails__fields = {
  site_name: {
    title: 'Site Name',
    bindTo: 'site_name',
    required: true
  },
  description: {
    title: 'Description',
    bindTo: 'description',
    type: 'textarea'
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

  primary_contact_first_name: {
    title: 'First Name (Primary Contact)',
    bindTo: 'primary_contact_first_name'
  },
  primary_contact_last_name: {
    title: 'Last Name (Primary Contact)',
    bindTo: 'primary_contact_last_name'
  },
  primary_contact_email: {
    title: 'Email (Primary Contact)',
    bindTo: 'primary_contact_email'
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone (Primary Contact)',
    bindTo: 'primary_contact_primary_phone'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone (Primary Contact)',
    bindTo: 'primary_contact_alternate_phone'
  },

  alternate_contact_first_name: {
    title: 'First Name (Alternate Contact)',
    bindTo: 'alternate_contact_first_name'
  },
  alternate_contact_last_name: {
    title: 'Last Name (Alternate Contact)',
    bindTo: 'alternate_contact_last_name'
  },
  alternate_contact_email: {
    title: 'Email (Alternate Contact)',
    bindTo: 'alternate_contact_email'
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone (Alternate Contact)',
    bindTo: 'alternate_contact_primary_phone'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone (Alternate Contact)',
    bindTo: 'alternate_contact_alternate_phone'
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

  latest_inspection__date: (model) => ({
    title: 'Latest Inspection Date',
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('latest_inspection__date'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:latest_inspection__date`, handler);
      handler();
    }
  }),
  latest_inspection__result: (model) => ({
    title: 'Latest Inspection Result',
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_inspection__result'));
      }
      model.on('change:latest_inspection__result', handler);
      handler();
    }
  }),
  latest_inspection__note: (model) => ({
    title: 'Latest Inspection Note',
    type: 'textarea',
    rows: 5,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_inspection__note'));
      }
      model.on('change:latest_inspection__note', handler);
      handler();
    }
  })
};
