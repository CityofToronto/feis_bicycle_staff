/* global $ moment */
/* global entity__fields */

/* exported entity__locationDetails__fields */
const entity__locationDetails__fields = {
  site_name: {
    title: 'Site Name',
    type: 'text',
    required: true,
    bindTo: 'site_name'
  },
  description: {
    title: 'Description',
    type: 'textarea',
    required: false,
    bindTo: 'description'
  },

  civic_address: {
    title: 'Street Address',
    type: 'text',
    required: false,
    bindTo: 'civic_address'
  },
  municipality: {
    title: 'City',
    type: 'text',
    required: false,
    bindTo: 'municipality'
  },
  province: ({ auth }) => ({
    title: 'Province',
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */',
      webStorage: sessionStorage
    },
    required: false,
    bindTo: 'province',
  }),
  postal_code: {
    title: 'Postal Code',
    type: 'text',
    required: false,
    bindTo: 'postal_code'
  },

  primary_contact_heading: {
    type: 'html',
    html: '<h4 id="primaryContact">Primary Contact</h4>'
  },
  primary_contact_first_name: {
    title: 'First Name (Primary Contact)',
    type: 'text',
    required: false,
    htmlAttr: {
      'aria-labelledby': 'primaryContact'
    },
    bindTo: 'primary_contact_first_name'
  },
  primary_contact_last_name: {
    title: 'Last Name (Primary Contact)',
    type: 'text',
    required: false,
    bindTo: 'primary_contact_last_name'
  },
  primary_contact_email: {
    title: 'Email (Primary Contact)',
    type: 'email',
    required: false,
    bindTo: 'primary_contact_email'
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone (Primary Contact)',
    type: 'phone',
    required: false,
    bindTo: 'primary_contact_primary_phone'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone (Primary Contact)',
    type: 'phone',
    required: false,
    bindTo: 'primary_contact_alternate_phone'
  },

  alternate_contact_heading: {
    type: 'html',
    html: '<h4>Alternate Contact</h4>'
  },
  alternate_contact_first_name: {
    title: 'First Name (Alternate Contact)',
    type: 'text',
    required: false,
    bindTo: 'alternate_contact_first_name'
  },
  alternate_contact_last_name: {
    title: 'Last Name (Alternate Contact)',
    type: 'text',
    required: false,
    bindTo: 'alternate_contact_last_name'
  },
  alternate_contact_email: {
    title: 'Email (Alternate Contact)',
    type: 'email',
    required: false,
    bindTo: 'alternate_contact_email'
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone (Alternate Contact)',
    type: 'phone',
    required: false,
    bindTo: 'alternate_contact_primary_phone'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone (Alternate Contact)',
    type: 'phone',
    required: false,
    bindTo: 'alternate_contact_alternate_phone'
  },

  latest_note__date: ({ model }) => ({
    title: 'Latest Note Date',
    type: 'text',
    required: false,
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
  latest_note__note: ({ model }) => ({
    title: 'Latest Note',
    type: 'textarea',
    rows: 5,
    required: false,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_note__note'));
      }
      model.on('change:latest_note__note', handler);
      handler();
    }
  }),

  latest_inspection__date: ({ model }) => ({
    title: 'Latest Inspection Date',
    type: 'text',
    required: false,
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
  latest_inspection__result: ({ model }) => ({
    title: 'Latest Inspection Result',
    type: 'text',
    required: false,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_inspection__result'));
      }
      model.on('change:latest_inspection__result', handler);
      handler();
    }
  }),
  latest_inspection__note: ({ model }) => ({
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
  }),

  id: entity__fields.id,
  __Status: entity__fields.__Status,
  __CreatedOn: entity__fields.__CreatedOn,
  __ModifiedOn: entity__fields.__ModifiedOn,
  __Owner: entity__fields.__Owner
};
